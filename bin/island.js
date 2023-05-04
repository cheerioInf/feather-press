#!/usr/bin/env node
// 该文件是指向dist文件夹中的 cli.js 文件的符号链接
// 这样我们就可以直接从命令行运行 cli.js 文件
// 无需指定文件的路径
require("../dist/node/cli.js")