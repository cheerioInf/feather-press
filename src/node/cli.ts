// 引入 cac 库，用于解析命令行参数
import { cac } from "cac";
// 引入 createDevServer 函数，用于创建开发服务器
import { createDevServer } from "./dev";
// 引入 path 模块，用于处理路径
import path = require("path");

// 从 package.json 中获取版本号
const version = require("../../package.json").version;

// 创建命令行实例
// 传入项目名称，用于显示在帮助信息中
// 传入版本号，用于显示在帮助信息中
// 传入帮助信息，用于显示在帮助信息中
const cli = cac("island").version(version).help();

// 添加 dev 命令
// command 的第二个参数为命令描述
// alias 为命令别名
// action 为命令执行的函数，参数为命令行参数，类型为 string
cli
  .command("[root]", "start dev server")
  .alias("dev")
  .action(async (root: string) => {
    // 如果传入了 root 参数，则将 root 参数转为绝对路径
    // 否则将 root 设置为当前工作目录，即 process.cwd()
    // 解释一下 process.cwd()，这是一个 Node.js API，返回 Node.js 进程的当前工作目录，即运行 node 命令时所在的目录
    root = root ? path.resolve(root) : process.cwd();
    // 调用 createDevServer 函数创建开发服务器
    // 传入 root 参数
    // server 变量的类型为 http.Server
    // http.Server 是 Node.js 的内置 API，用于创建 HTTP 服务器
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
