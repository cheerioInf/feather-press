import { createServer as createViteDevServer } from "vite";

// 接收 root 参数，返回一个 vite 的 dev server
export async function createDevServer(root = process.cwd()) {
  // 调用 vite 的 createServer 方法创建 dev server
  return createViteDevServer({
    root,
  });
}
