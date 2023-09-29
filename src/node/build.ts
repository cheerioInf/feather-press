import { InlineConfig, build as viteBuild } from 'vite';
import {
  CLIENT_ENTRY_PATH,
  CLIENT_OUTPUT,
  EXTERNALS,
  PACKAGE_ROOT,
  SERVER_ENTRY_PATH
} from './constants';
import { join } from 'path';
import fs from 'fs-extra';
import { pathToFileURL } from 'url';
import type { RollupOutput } from 'rollup';
import { createVitePlugins } from './vitePlugins';
import { SiteConfig } from '../shared/types';
import { renderPage } from './renderPage';

async function bundle(root: string, config: SiteConfig) {
  try {
    const resolveViteConfig = async (
      isServer: boolean
    ): Promise<InlineConfig> => {
      return {
        mode: 'production',
        root,
        plugins: await createVitePlugins(config, undefined, isServer),
        ssr: {
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

    // 必须进行 server 打包，但是此处可以无需返回值
    const [clientBundle, serverBundle] = await Promise.all([
      clientBuild(),
      serverBuild()
    ]);

    const publicDir = join(root, 'public');
    if (fs.pathExistsSync(publicDir)) {
      await fs.copy(publicDir, join(root, CLIENT_OUTPUT));
    }

    // 拷贝 vendors 目录到 build 目录
    await fs.copy(join(PACKAGE_ROOT, 'vendors'), join(root, CLIENT_OUTPUT));

    return [clientBundle, serverBundle] as [RollupOutput, RollupOutput];
  } catch (err) {
    console.error(err);
  }
}

export async function build(root: string, config: SiteConfig) {
  const [clientBundle] = await bundle(root, config);

  const serverEntryPath = join(root, '.temp', 'server-entry.js');
  const { render, routes } = await import(
    String(pathToFileURL(serverEntryPath))
  );

  // 生成 html 文件，将 client bundle 注入到 html 中，输出到 build 目录，完成打包
  try {
    await renderPage(render, routes, root, clientBundle);
  } catch (err) {
    console.error('Render page error.\n', err);
  }
}
