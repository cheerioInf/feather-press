import { resolve } from 'path';
import { cac } from 'cac';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const version = require('../../package.json').version;

const cli = cac('feather')
  .version(version)
  .help(() => {
    console.log('欢迎使用 FeatherPress');
  });

cli.command('dev [root]', 'start dev server').action(async (root: string) => {
  const createServer = async () => {
    // 如果传入了 root 参数，则将 root 参数转为绝对路径，并规范路径
    // 否则将 root 设置为 process.cwd()
    root = root ? resolve(root) : process.cwd();
    // 创建开发服务器
    const { createDevServer } = await import('./dev.js');
    const server = await createDevServer(root, async () => {
      await server.close();
      await createServer();
    });
    await server.listen();
    server.printUrls();
  };

  try {
    await createServer();
  } catch (e) {
    console.error(e);
  }
});

cli
  .command('build [root]', 'build for production')
  .action(async (root: string) => {
    const { resolveConfig } = await import('./config.js');
    const { build } = await import('./build.js');
    try {
      root = root ? resolve(root) : process.cwd();
      const config = await resolveConfig(root, 'build', 'production');
      await build(root, config);
    } catch (e) {
      console.error(e);
    }
  });

cli
  .command('preview [root]', 'preview production build')
  .option('--port <port>', 'port to use for preview server')
  .action(async (root: string, { port }: { port: number }) => {
    const { preview } = await import('./preview.js');
    try {
      root = root ? resolve(root) : process.cwd();
      await preview(root, { port });
    } catch (e) {
      console.log(e);
    }
  });

cli.parse();
