import path from 'path';
import fse from 'fs-extra';
import execa from 'execa';

const exampleDir = path.resolve(__dirname, '../e2e/playground/basic');
// 默认的 execa 配置，cwd 表示执行命令的目录，stdout 表示输出到控制台，stdin 表示从控制台输入，stderr 表示输出错误信息到控制台
const defaultExecaOpts = {
  cwd: exampleDir,
  stdout: process.stdout,
  stdin: process.stdin,
  stderr: process.stderr
};

async function prepareE2E() {
  // 如果没有 dist 目录，则执行 build 命令
  if (!fse.existsSync(path.resolve(__dirname, '../dist'))) {
    execa.commandSync('pnpm build', {
      cwd: path.resolve(__dirname, '../')
    });
  }

  // 安装 playwright
  execa.commandSync('npx playwright install', {
    cwd: path.join(__dirname, '../'),
    stdout: process.stdout,
    stdin: process.stdin,
    stderr: process.stderr
  });

  // 如果没有 playground/basic/node_modules 目录，则执行 pnpm i 命令
  execa.commandSync('pnpm i', {
    cwd: exampleDir,
    stdout: process.stdout,
    stdin: process.stdin,
    stderr: process.stderr
  });

  // 执行 pnpm dev 命令，启动 playground/basic 项目
  execa.commandSync('pnpm dev', defaultExecaOpts);
}

prepareE2E();
