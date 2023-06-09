import { join } from 'path';

// __dirname 指的是打包后的 cli.(m)js 文件所在的目录
// 通过 join 函数，我们可以得到项目根目录
export const PACKAGE_ROOT = join(__dirname, '..');

// DEFAULT_HTML_PATH 是指项目根目录下的 template.html
export const DEFAULT_HTML_PATH = join(PACKAGE_ROOT, 'template.html');

export const RUNTIME_PATH = join(PACKAGE_ROOT, 'src', 'runtime');

// CLIENT_ENTRY_PATH 是指项目根目录下的 src/runtime/client-entry.tsx
export const CLIENT_ENTRY_PATH = join(RUNTIME_PATH, 'client-entry.tsx');

// SERVER_ENTRY_PATH 是指项目根目录下的 src/runtime/server-entry.tsx
export const SERVER_ENTRY_PATH = join(RUNTIME_PATH, 'server-entry.tsx');

export const MASK_SPLITTER = '!!ISLAND!!';

export const CLIENT_OUTPUT = 'build';

export const EXTERNALS = [
  'react',
  'react-dom',
  'react-dom/client',
  'react/jsx-runtime'
];
