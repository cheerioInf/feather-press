import { join } from "path";

// 这里的 __dirname 是指 src/node/constants
// 而不是 src/node/constants/index.ts
// 经过 join 之后，PACKAGE_ROOT 是指项目根目录
export const PACKAGE_ROOT = join(__dirname, "..", "..", "..");

// DEFAULT_HTML_PATH 是指项目根目录下的 template.html
export const DEFAULT_HTML_PATH = join(PACKAGE_ROOT, "template.html");

export const CLIENT_ENTRY_PATH = join(
  PACKAGE_ROOT,
  "src",
  "runtime",
  "client-entry.tsx"
);
