import { InlineConfig, build as viteBuild } from 'vite';
import { CLIENT_ENTRY_PATH, SERVER_ENTRY_PATH } from './constants';
import { dirname, join } from 'path';
import fs from 'fs-extra';
import type { RollupOutput } from 'rollup';
import { SiteConfig } from '../shared/types/index';
import { createVitePlugins } from './vitePlugins';
import { Route } from './plugin-routes';

// 打包 client 和 server 的 bundle 文件
async function bundle(root: string, config: SiteConfig) {
  try {
    // 生成 vite config
    const resolveViteConfig = async (
      isServer: boolean
    ): Promise<InlineConfig> => {
      return {
        mode: 'production',
        root,
        plugins: await createVitePlugins(config, undefined, isServer),
        ssr: {
          // 注意加上这个配置，防止 cjs 产物中 require ESM 的产物，因为 react-router-dom 的产物为 ESM 格式
          noExternal: ['react-router-dom']
        },
        build: {
          ssr: isServer,
          outDir: isServer ? join(root, '.temp') : join(root, 'build'),
          rollupOptions: {
            input: isServer ? SERVER_ENTRY_PATH : CLIENT_ENTRY_PATH,
            output: {
              format: isServer ? 'cjs' : 'esm'
            }
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
    return [clientBundle, serverBundle] as [RollupOutput, RollupOutput];
  } catch (err) {
    console.error(err);
  }
}

export async function renderPage(
  render: (url: string) => string,
  routes: Route[],
  root: string,
  clientBundle: RollupOutput
) {
  console.log('Rendering page in server side...');
  const clientChunk = clientBundle.output.find(
    (chunk) => chunk.type === 'chunk' && chunk.isEntry
  );
  await Promise.all(
    routes.map(async (route) => {
      const routePath = route.path;
      const appHtml = render(routePath);
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width,initial-scale=1">
            <title>title</title>
            <meta name="description" content="xxx">
          </head>
          <body>
            <div id="root">${appHtml}</div>
            <script type="module" src="/${clientChunk?.fileName}"></script>
          </body>
        </html>`.trim();
      const fileName = routePath.endsWith('/')
        ? `${routePath}index.html`
        : `${routePath}.html`;
      await fs.ensureDir(join(root, 'build', dirname(fileName)));
      await fs.writeFile(join(root, 'build', fileName), html);
    })
  );
  await fs.remove(join(root, '.temp'));
}

export default async function build(root: string, config: SiteConfig) {
  // 打包 client 和 server 的 bundle 文件
  const [clientBundle] = await bundle(root, config);
  // 读取 server bundle 文件，获取 render 函数
  const serverEntryPath = join(root, '.temp', 'server-entry.js');
  const { render, routes } = await import(serverEntryPath);
  // 生成 html 文件，将 client bundle 注入到 html 中，输出到 build 目录，完成打包
  try {
    await renderPage(render, routes, root, clientBundle);
  } catch (err) {
    console.error('Render page error.\n', err);
  }
}
