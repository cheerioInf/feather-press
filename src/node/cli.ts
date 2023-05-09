// 引入 cac 库，用于解析命令行参数
import { cac } from "cac";
// 引入 createDevServer 函数，用于创建开发服务器
import { createDevServer } from "./dev";
// 引入 path 模块，用于处理路径
import path = require("path");

// 从 package.json 中获取版本号
const version = require("../../package.json").version;

// 创建命令行实例
// 传入项目名称、版本号、设置帮助信息
const cli = cac("island")
  .version(version)
  .help(() => {
    console.log("帮助信息");
  });

// 添加 dev 命令
// command 的第二个参数为命令描述
// action 为命令执行的函数，参数为命令行参数
cli.command("dev [root]", "start dev server").action(async (root: string) => {
  // 如果传入了 root 参数，则将 root 参数转为绝对路径
  // 否则将 root 设置为 process.cwd()，返回 Node.js 进程的当前工作目录，即运行 node 命令时所在的目录
  root = root ? path.resolve(root) : process.cwd();
  // 调用 createDevServer 函数创建开发服务器
  // root 为服务器的根目录
  const server = await createDevServer(root);
  // 调用 server.listen 方法启动 HTTP 服务器
  await server.listen();
  // 调用 server.printUrls 方法打印 URL 信息
  server.printUrls();
});

cli
  .command("build [root]", "build for production")
  .action(async (root: string) => {
    console.log("build", root);
  });

// 调用 cli.parse 方法解析命令行参数
cli.parse();
