import { createServer as createViteDevServer } from 'vite';
import { PACKAGE_ROOT } from './constants';
import { resolveConfig } from './config';
import { createVitePlugins } from './vitePlugins';

export async function createDevServer(
  root: string,
  restartServer: () => Promise<void>
) {
  // 通过 resolveConfig 获取配置信息
  const config = await resolveConfig(root, 'serve', 'development');
  // 调用 vite 的 createServer 方法创建 devServer
  return createViteDevServer({
    root: PACKAGE_ROOT,
    plugins: await createVitePlugins(config, restartServer, false),
    server: {
      fs: {
        allow: [PACKAGE_ROOT]
      }
    }
  });
}
