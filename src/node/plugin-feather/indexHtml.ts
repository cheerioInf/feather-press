import { readFile } from 'fs/promises';
import { Plugin } from 'vite';
import { CLIENT_ENTRY_PATH, DEFAULT_HTML_PATH } from '../constants';

/**
 * 将 template.html 作为 index.html
 * @returns vite 插件
 */
export default function pluginIndexHtml(): Plugin {
  return {
    name: 'feather:index-html',
    apply: 'serve',
    // 注入在内部中间件之后运行的中间件
    configureServer(server) {
      return () => {
        // req: http 请求
        // res: http 响应
        // next: express 的 next 函数
        server.middlewares.use(async (req, res, next) => {
          // 读取 template.html
          let html = await readFile(DEFAULT_HTML_PATH, 'utf-8');

          try {
            // 接入热更新，transformIndexHtml 为转换 index.html 的专用钩子
            html = await server.transformIndexHtml(
              req.url,
              html,
              req.originalUrl
            );

            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.end(html);
          } catch (e) {
            // 捕获错误
            // 将错误传递给下一个中间件
            return next(e);
          }
        });
      };
    },
    // 转换 index.html 的专用钩子
    // 自动添加 ssg 同构脚本
    transformIndexHtml(html) {
      return {
        html,
        tags: [
          {
            tag: 'script',
            attrs: {
              type: 'module',
              // @fs 的作用是将路径转换为项目根目录的路径
              src: `/@fs/${CLIENT_ENTRY_PATH}`
            },
            injectTo: 'body'
          }
        ]
      };
    }
  };
}
