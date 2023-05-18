import { InlineConfig, build as viteBuild } from 'vite';
import { CLIENT_ENTRY_PATH, SERVER_ENTRY_PATH } from './constants';
import { join } from 'path';
import fs from 'fs-extra';
import type { RollupOutput } from 'rollup';
import { SiteConfig } from '../shared/types/index';
import { createVitePlugins } from './vitePlugins';

// 打包 client 和 server 的 bundle 文件
async function bundle(root: string, config: SiteConfig) {
  try {
    // 生成 vite config
    const resolveViteConfig = (isServer: boolean): InlineConfig => {
      return {
        mode: 'production',
        root,
        plugins: createVitePlugins(config),
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
      return viteBuild(resolveViteConfig(false));
    };

    const serverBuild = async () => {
      return viteBuild(resolveViteConfig(true));
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

async function renderPage(
  render: () => string,
  root: string,
  clientBundle: RollupOutput
) {
  // 生成 html 文件，注入到 build 目录下的 index.html
  const appHtml = render();
  // 读取 client bundle 文件，获取 client bundle 文件名
  const clinetChunk = clientBundle.output.find(
    (chunk) => chunk.type === 'chunk'
  );
  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>feather-press</title>
      </head>
      <body>
        <div id="root">${appHtml}</div>
        <script type="module" src="./${clinetChunk.fileName}"></script>
      </body>
    </html>
  `.trim();
  // 将 html 文件输出到 build 目录
  await fs.writeFile(join(root, 'build', 'index.html'), html);
  // 删除 .temp 目录
  await fs.remove(join(root, '.temp'));
}

export default async function build(root: string, config: SiteConfig) {
  // 打包 client 和 server 的 bundle 文件
  const [clientBundle] = await bundle(root, config);
  // 读取 server bundle 文件，获取 render 函数
  const serverEntryPath = join(root, '.temp', 'server-entry.js');
  const { render } = await import(serverEntryPath);
  // 生成 html 文件，将 client bundle 注入到 html 中，输出到 build 目录，完成打包
  try {
    await renderPage(render, root, clientBundle);
  } catch (err) {
    console.error('Render page error.\n', err);
  }
}
