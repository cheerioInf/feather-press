import { resolve } from 'path';
import { cac } from 'cac';
import * as process from 'process';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const version = require('../../package.json').version;

const cli = cac('feather')
  .version(version)
  .help(() => {
    console.log('欢迎使用 FeatherPress');
  });

cli
  .command('dev [root]', 'start dev server 启动开发服务器')
  .action(async (root: string) => {
    const createServer = async (root: string = process.cwd()) => {
      const { createDevServer } = await import('./dev.js');
      const server = await createDevServer(root, async () => {
        await server.close();
        await createServer();
      });
      await server.listen();
      server.printUrls();
    };

    try {
      root = root ? resolve(root) : process.cwd();
      await createServer(root);
    } catch (e) {
      throw new Error(e);
    }
  });

cli
  .command('build [root]', 'build for production 构建生产环境')
  .action(async (root: string) => {
    const { resolveConfig } = await import('./config.js');
    const { build } = await import('./build.js');

    try {
      root = root ? resolve(root) : process.cwd();
      const config = await resolveConfig(root, 'build', 'production');
      await build(root, config);
    } catch (e) {
      throw new Error(e);
    }
  });

cli
  .command('preview [root]', 'preview production build 本地预览生产环境')
  .option('--port <port>', 'port to use for preview server 本地预览服务器端口')
  .action(async (root: string, { port }: { port: number }) => {
    const { preview } = await import('./preview.js');

    try {
      root = root ? resolve(root) : process.cwd();
      await preview(root, { port });
    } catch (e) {
      throw new Error(e);
    }
  });

cli.parse();
