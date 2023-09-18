import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    cli: 'src/node/cli.ts',
    index: 'src/node/index.ts',
    dev: 'src/node/dev.ts'
  },
  clean: true,
  outDir: 'dist',
  // 可以指定多个输出格式
  format: ['cjs', 'esm'],
  // 将类型打包成 .d.ts 类型声明文件
  dts: true,
  // 开启兼容性处理，比如 __dirname 会被替换成 import.meta.url
  shims: true,
  banner: {
    js: 'import { createRequire as createRequire0 } from "module"; const require = createRequire0(import.meta.url);'
  }
});
