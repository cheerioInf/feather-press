import { InlineConfig, build as viteBuild } from 'vite';
import {
  CLIENT_ENTRY_PATH,
  CLIENT_OUTPUT,
  EXTERNALS,
  MASK_SPLITTER,
  PACKAGE_ROOT,
  SERVER_ENTRY_PATH
} from './constants';
import path, { dirname, join } from 'path';
import fs from 'fs-extra';
import type { RollupOutput } from 'rollup';
import { createVitePlugins } from './vitePlugins';
import { Route } from './plugin-routes';
import { SiteConfig } from '../shared/types/index';
import { RenderResult } from 'runtime/server-entry';
import { HelmetData } from 'react-helmet-async';

/**
 * 打包 client 和 server 的 bundle 文件
 * @param root 项目根目录
 * @param config 站点配置
 * @returns [clientBundle, serverBundle]
 */
async function bundle(root: string, config: SiteConfig) {
  try {
    /**
     * 生成 vite config
     * @param isServer 是否为 server 端
     * @returns vite config
     */
    const resolveViteConfig = async (
      isServer: boolean
    ): Promise<InlineConfig> => {
      return {
        mode: 'production',
        root,
        plugins: await createVitePlugins(config, undefined, isServer),
        ssr: {
          // 注意加上这个配置，防止 cjs 产物中 require ESM 的产物，因为 react-router-dom 的产物为 ESM 格式
          noExternal: ['react-router-dom', 'lodash-es']
        },
        build: {
          ssr: isServer,
          outDir: isServer ? join(root, '.temp') : join(root, 'build'),
          rollupOptions: {
            input: isServer ? SERVER_ENTRY_PATH : CLIENT_ENTRY_PATH,
            output: {
              format: isServer ? 'cjs' : 'esm'
            },
            external: EXTERNALS
          }
        }
      };
    };

    const clientBuild = async () => {
      return viteBuild(await resolveViteConfig(false));
    };

    const serverBuild = async () => {
      return viteBuild(await resolveViteConfig(true));
    };

    console.log('building client and server bundles...');

    const [clientBundle, serverBundle] = await Promise.all([
      clientBuild(),
      serverBuild()
    ]);

    const publicDir = join(root, 'public');
    if (fs.pathExistsSync(publicDir)) {
      await fs.copy(publicDir, join(root, CLIENT_OUTPUT));
    }

    await fs.copy(join(PACKAGE_ROOT, 'vendors'), join(root, CLIENT_OUTPUT));

    return [clientBundle, serverBundle] as [RollupOutput, RollupOutput];
  } catch (err) {
    console.error(err);
  }
}

/**
 * 生成 html 文件，将 client bundle 注入到 html 中，输出到 build 目录，完成打包
 * @param render render 函数
 * @param routes 路由数组
 * @param root 项目根目录
 * @param clientBundle client bundle
 */
export async function renderPage(
  render: (url: string, helmetContext: object) => Promise<RenderResult>,
  routes: Route[],
  root: string,
  clientBundle: RollupOutput
) {
  console.log('Rendering page in server side...');

  // 获取 client bundle 的入口 chunk
  const clientChunk = clientBundle.output.find(
    (chunk) => chunk.type === 'chunk' && chunk.isEntry
  );

  async function buildIslands(
    root: string,
    islandPathToMap: Record<string, string>
  ) {
    // 根据 islandPathToMap 拼接模块代码内容
    const islandsInjectCode = `
      ${Object.entries(islandPathToMap)
        .map(
          ([islandName, islandPath]) =>
            `import { ${islandName} } from '${islandPath}'`
        )
        .join('')}
  window.ISLANDS = { ${Object.keys(islandPathToMap).join(', ')} };
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
        outDir: path.join(root, '.temp'),
        rollupOptions: {
          input: injectId,
          external: EXTERNALS
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
          // 对于 Islands Bundle，我们只需要 JS 即可，其它资源文件可以删除
          generateBundle(_, bundle) {
            for (const name in bundle) {
              if (bundle[name].type === 'asset') {
                delete bundle[name];
              }
            }
          }
        }
      ]
    });
  }

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
      const {
        appHtml,
        islandToPathMap,
        islandProps = []
      } = await render(routePath, helmetContext.context);
      const styleAssets = clientBundle.output.filter(
        (chunk) => chunk.type === 'asset' && chunk.fileName.endsWith('.css')
      );
      const islandBundle = await buildIslands(root, islandToPathMap);
      const islandsCode = (islandBundle as RollupOutput).output[0].code;
      const normalizeVendorFilename = (fileName: string) =>
        fileName.replace(/\//g, '_') + '.js';
      const { helmet } = helmetContext.context;
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width,initial-scale=1">
            ${helmet?.title?.toString() || ''}
            ${helmet?.meta?.toString() || ''}
            ${helmet?.link?.toString() || ''}
            ${helmet?.style?.toString() || ''}
            <meta name="description" content="xxx">
            ${styleAssets
              .map((item) => `<link rel="stylesheet" href="/${item.fileName}">`)
              .join('\n')}
          </head>
          <body>
            <div id="root">${appHtml}</div>
            <script type="importmap">
              {
                "imports": {
                  ${EXTERNALS.map(
                    (name) => `"${name}": "/${normalizeVendorFilename(name)}"`
                  ).join(',')}
                }
              }
            </script>
            <script type="module">${islandsCode}</script>
            <script type="module" src="/${clientChunk?.fileName}"></script>
            <script id="island-props">${JSON.stringify(islandProps)}</script>
          </body>
        </html>`.trim();

      const fileName = routePath.endsWith('/')
        ? `${routePath}index.html`
        : `${routePath}.html`;

      // 如果目录不存在，则创建目录
      await fs.ensureDir(join(root, 'build', dirname(fileName)));
      // 将 html 文件写入 build 目录
      await fs.writeFile(join(root, 'build', fileName), html);
    })
  );

  // 删除 .temp 目录
  await fs.remove(join(root, '.temp'));
}

/**
 * 打包
 * @param root 项目根目录
 * @param config 站点配置
 */
export default async function build(root: string, config: SiteConfig) {
  // 打包 client 和 server 的 bundle 文件
  const [clientBundle] = await bundle(root, config);

  const serverEntryPath = join(root, '.temp', 'server-entry.js');
  // 获得 ssr render 函数和路由数组
  const { render, routes } = await import(serverEntryPath);
  // 生成 html 文件，将 client bundle 注入到 html 中，输出到 build 目录，完成打包
  try {
    await renderPage(render, routes, root, clientBundle);
  } catch (err) {
    console.error('Render page error.\n', err);
  }
}
