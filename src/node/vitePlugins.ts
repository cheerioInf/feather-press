import pluginReact from '@vitejs/plugin-react';
import pluginUnocss from 'unocss/vite';
import pluginIndexHtml from './plugin-feather/indexHtml';
import { pluginConfig } from './plugin-feather/config';
import { pluginRoutes } from './plugin-routes';
import { createPluginMdx } from './plugin-mdx';
import unocssOptions from './unocssOptions';
import { SiteConfig } from 'shared/types';
import path from 'path';
import { PACKAGE_ROOT } from './constants';
import babelPluginIsland from './babel-plugin-island';

/**
 * 返回 vite 插件
 * @param config 配置文件
 * @param restartServer 重启服务器的函数
 * @param isSSR 是否为 SSR 模式
 * @returns vite 插件
 */
export async function createVitePlugins(
  config: SiteConfig,
  restartServer?: () => Promise<void>,
  isSSR = false
) {
  return [
    pluginUnocss(unocssOptions),
    pluginIndexHtml(),
    pluginReact({
      jsxRuntime: 'automatic',
      jsxImportSource: isSSR
        ? path.join(PACKAGE_ROOT, 'src', 'runtime')
        : 'react',
      babel: {
        plugins: [babelPluginIsland]
      }
    }),
    pluginConfig(config, restartServer),
    pluginRoutes({
      root: config.root,
      isSSR
    }),
    await createPluginMdx()
  ];
}
