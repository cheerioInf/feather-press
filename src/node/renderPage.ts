import { build as viteBuild } from 'vite';
import fs from 'fs-extra';
import { RenderResult } from 'runtime/server-entry';
import { Route } from './plugin-routes';
import { RollupOutput } from 'rollup';
import { dirname, join } from 'path';
import { EXTERNALS, MASK_SPLITTER } from './constants';
import { HelmetData } from 'react-helmet-async';

export async function renderPage(
  render: (url: string, helmetContext: object) => Promise<RenderResult>,
  routes: Route[],
  root: string,
  clientBundle: RollupOutput
) {
  console.log('Rendering page in server side...');

  async function buildIslands(
    root: string,
    islandPathToMap: Record<string, string>
  ) {
    // 根据 islandPathToMap 拼接模块代码内容
    const islandsInjectCode = `
    ${Object.entries(islandPathToMap)
      .map(
        ([islandName, islandPath]) =>
          `import { ${islandName} } from '${islandPath}';`
      )
      .join('')}
    window.ISLANDS = { ${Object.entries(islandPathToMap)
      .map(([islandName]) => `${islandName}`)
      .join(',')} };
    window.ISLAND_PROPS = JSON.parse(
      document.getElementById('island-props').textContent
    );
  `;

    const injectId = 'island:inject';
    return viteBuild({
      mode: 'production',
      esbuild: {
        jsx: 'automatic'
      },
      build: {
        // 输出目录
        outDir: join(root, '.temp'),
        rollupOptions: {
          external: EXTERNALS,
          input: injectId
        }
      },
      plugins: [
        // 重点插件，用来加载我们拼接的 Islands 注册模块的代码
        {
          name: 'island:inject',
          enforce: 'post',
          resolveId(id) {
            if (id.includes(MASK_SPLITTER)) {
              const [originId, importer] = id.split(MASK_SPLITTER);
              return this.resolve(originId, importer, { skipSelf: true });
            }
            if (id === injectId) {
              return id;
            }
          },
          load(id) {
            if (id === injectId) {
              return islandsInjectCode;
            }
          },
          generateBundle(_options, bundle) {
            for (const name in bundle) {
              if (bundle[name].type === 'asset') {
                delete bundle[name];
              }
            }
          }
        }
      ],
      logLevel: 'silent'
    });
  }

  // 获取 client bundle 的入口 chunk
  const clientChunk = clientBundle.output.find(
    (chunk) => chunk.type === 'chunk' && chunk.isEntry
  );

  // 遍历路由数组，生成同构 html 文件
  await Promise.all(
    [
      ...routes,
      {
        path: '/404'
      }
    ].map(async (route) => {
      const routePath = route.path;
      const helmetContext = {
        context: {}
      } as HelmetData;
      // appHtml 为渲染后的 html 字符串
      // islandToPathMap 为拼接的 Islands 注册模块的代码
      // islandProps 为拼接的 Islands 的 props
      const {
        appHtml,
        islandToPathMap,
        islandProps = []
      } = await render(routePath, helmetContext.context);

      // 获取 css 文件
      const styleAssets = clientBundle.output.filter(
        (chunk) => chunk.type === 'asset' && chunk.fileName.endsWith('.css')
      );

      let islandBundle: RollupOutput | undefined;
      let flag = true;
      while (flag) {
        try {
          islandBundle = (await buildIslands(
            root,
            islandToPathMap
          )) as RollupOutput;
          flag = false;
        } catch (err) {
          continue;
        }
      }

      const islandsCode = (islandBundle as RollupOutput).output[0].code;

      const normalizeVendorFilename = (fileName: string) =>
        fileName.replace(/\//g, '_') + '.js';
      const { helmet } = helmetContext.context;
      const html = `
      <!DOCTYPE html>
      <html lang='en'>
        <head>
          <title></title>
          <meta charset='utf-8'>
          <meta name='viewport' content='width=device-width,initial-scale=1'>
          ${helmet?.title?.toString() || ''}
          ${helmet?.meta?.toString() || ''}
          ${helmet?.link?.toString() || ''}
          ${helmet?.style?.toString() || ''}
          <meta name='description' content='xxx'>
          ${styleAssets
            .map((item) => `<link rel='stylesheet' href='/${item.fileName}' />`)
            .join('\n')}
        </head>
        <body>
          <div id='root'>${appHtml}</div>
          <script type='importmap'>
            {
              "imports": {
                ${EXTERNALS.map(
                  (name) => `"${name}": "/${normalizeVendorFilename(name)}"`
                ).join(',')}
              }
            }
          </script>
          <script type='module'>${islandsCode}</script>
          <script type='module' src='/${clientChunk?.fileName}'></script>
          <script id='island-props' type='module'>${JSON.stringify(
            islandProps
          )}</script>
        </body>
      </html>`.trim();

      const fileName = routePath.endsWith('/')
        ? `${routePath}index.html`
        : `${routePath}.html`;

      await fs.ensureDir(join(root, 'build', dirname(fileName)));

      await fs.writeFile(join(root, 'build', fileName), html);
    })
  );
}
