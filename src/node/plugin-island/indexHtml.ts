import { readFile } from "fs/promises";
import { Plugin } from "vite";
import { CLIENT_ENTRY_PATH, DEFAULT_HTML_PATH } from "../constants";

export default function pluginIndexHtml(): Plugin {
  // 返回一个 vite 的 plugin
  // 这个 plugin 的作用是将 template.html 作为 index.html
  return {
    name: "island:index-html",
    // 作用于 serve 模式，即开发模式
    apply: "serve",
    // 通过 transformIndexHtml 钩子来修改 index.html
    // transformIndexHtml 的作用是在 index.html 被读取之后对其进行修改
    // 接收一个参数，即 index.html 的内容
    // 返回一个对象，包含两个属性：
    // html: string，即修改后的 index.html 的内容
    // tags: Array，即需要插入到 index.html 的标签
    // 这里的标签是一个对象，包含三个属性：
    // tag: string，即标签名
    // attrs: Record<string, string>，即标签的属性
    // injectTo: string，即标签的插入位置
    transformIndexHtml(html) {
      return {
        html,
        tags: [
          {
            tag: "script",
            attrs: {
              type: "module",
              // @fs 的作用是将路径转换为项目根目录的路径
              src: `/@fs/${CLIENT_ENTRY_PATH}`,
            },
            injectTo: "body",
          },
        ],
      };
    },
    // 通过 configureServer 钩子来修改 dev server 的行为
    // configureServer 的作用是在 dev server 启动之前对其进行配置
    configureServer(server) {
      return () => {
        // 通过 use 方法来添加中间件
        // 这里的中间件是一个 async 函数，内部的读取文件是一个异步操作
        // 接收三个参数，分别的作用是：
        // req: http.IncomingMessage，即 http 请求
        // res: http.ServerResponse，即 http 响应
        // next: express.NextFunction，即 express 的 next 函数
        server.middlewares.use(async (req, res, next) => {
          let html = await readFile(DEFAULT_HTML_PATH, "utf-8");

          try {
            // 接入热更新
            html = await server.transformIndexHtml(
              req.url,
              html,
              req.originalUrl
            );
            res.statusCode = 200;
            res.setHeader("Content-Type", "text/html");
            res.end(html);
          } catch (e) {
            // 捕获错误
            // 这里的 next 是 express 的 next，作用是将错误传递给下一个中间件
            return next(e);
          }
        });
      };
    },
  };
}
