import { readFile } from 'fs/promises';
import { Plugin } from 'vite';
import { CLIENT_ENTRY_PATH, DEFAULT_HTML_PATH } from '../constants';

export default function pluginIndexHtml(): Plugin {
  return {
    name: 'feather:index-html',
    apply: 'serve',
    configureServer(server) {
      return () => {
        server.middlewares.use(async (req, res, next) => {
          let html = await readFile(DEFAULT_HTML_PATH, 'utf-8');

          try {
            html = await server.transformIndexHtml(
              req.url,
              html,
              req.originalUrl
            );

            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.end(html);
          } catch (e) {
            return next(e);
          }
        });
      };
    },
    transformIndexHtml(html) {
      // 添加 ssg 同构脚本
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
  } as Plugin;
}
