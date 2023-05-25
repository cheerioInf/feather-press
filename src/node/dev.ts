import { createServer as createViteDevServer } from 'vite';
import { PACKAGE_ROOT } from './constants';
import { resolveConfig } from './config';
import { createVitePlugins } from './vitePlugins';

/**
 * 创建开发服务器
 * @param root 项目根目录
 * @param restartServer 重启服务器的函数
 */
export async function createDevServer(
  root: string,
  restartServer: () => Promise<void>
) {
  // 通过 resolveConfig 获取配置
  const config = await resolveConfig(root, 'serve', 'development');
  // 调用 vite 的 createServer 方法创建 deServer
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
