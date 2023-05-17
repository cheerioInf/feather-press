import { createServer as createViteDevServer } from 'vite';
import pluginIndexHtml from './plugin-feather/indexHtml';
import pluginReact from '@vitejs/plugin-react';
import { PACKAGE_ROOT } from './constants';
import { resolveConfig } from './config';
import { pluginConfig } from './plugin-feather/config';
import { pluginRoutes } from './plugin-routes';

// 接收 root 参数，返回一个 vite 的 devServer
export async function createDevServer(
  root = process.cwd(),
  restartServer: () => Promise<void>
) {
  // 通过 resolveConfig 获取配置
  const config = await resolveConfig(root, 'serve', 'development');
  // console.log(config);
  // 调用 vite 的 createServer 方法创建 deServer
  return createViteDevServer({
    root: PACKAGE_ROOT,
    plugins: [
      pluginIndexHtml(),
      pluginReact(),
      pluginConfig(config, restartServer),
      pluginRoutes({
        root: config.root
      })
    ],
    server: {
      fs: {
        allow: [PACKAGE_ROOT]
      }
    }
  });
}
