import { createServer as createViteDevServer } from "vite";
import pluginIndexHtml from "./plugin-feather/indexHtml";
import pluginReact from "@vitejs/plugin-react";

// 接收 root 参数，返回一个 vite 的 dev server
export async function createDevServer(root = process.cwd()) {
  // 调用 vite 的 createServer 方法创建 dev server
  return createViteDevServer({
    root,
    plugins: [pluginIndexHtml(), pluginReact()],
  });
}
