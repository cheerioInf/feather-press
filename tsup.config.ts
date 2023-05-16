import { defineConfig } from 'tsup';

export default defineConfig({
  // 指定入口文件，tsup 会根据入口文件的依赖关系，将所有依赖的文件打包到一起
  entryPoints: {
    cli: 'src/node/cli.ts',
    index: 'src/node/index.ts',
    dev: 'src/node/dev.ts'
  },
  clean: true,
  // bundle 为 true 时，tsup 会将所有依赖的文件打包到一起
  bundle: true,
  // splitting 为 true 时，tsup 会将所有依赖的文件分开打包，这样可以实现按需加载
  splitting: true,
  outDir: 'dist',
  // format 为 cjs 时，tsup 会将所有依赖的文件打包成 CommonJS 格式，适用于 Node.js 环境
  // format 为 esm 时，tsup 会将所有依赖的文件打包成 ES Module 格式，适用于浏览器环境
  format: ['cjs', 'esm'],
  // dts 为 true 时，tsup 会将所有依赖的文件打包成 .d.ts 文件，适用于类型声明文件
  dts: true,
  // shims 为 true 时，表示 tsup 会做一些兼容性处理，比如 __dirname 会被替换成 import.meta.url
  shims: true,
  // banner 的作用是在打包后的 .js 文件的头部添加一段注释
  // js 属性表示在打包后的 .js 文件的头部添加一段注释
  banner: {
    js: 'import { createRequire as createRequire0 } from "module"; const require = createRequire0(import.meta.url);'
  }
});
