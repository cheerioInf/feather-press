#!/usr/bin/env node
// bin 的作用是将脚本注册为全局命令，使 feather 命令可以在命令行中直接运行。
// 该文件是指向 dist 文件夹中的 cli.js 文件的符号链接
// 这样我们就可以直接从命令行运行 cli.js 文件
// 无需指定文件的路径
require("../dist/node/cli.js")