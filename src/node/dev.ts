import { createServer as createViteDevServer } from 'vite';
import { PACKAGE_ROOT } from './constants';
import { resolveConfig } from './config';
import { createVitePlugins } from './vitePlugins';

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
    plugins: await createVitePlugins(config, restartServer),
    server: {
      fs: {
        allow: [PACKAGE_ROOT]
      }
    }
  });
}
