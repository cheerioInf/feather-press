import { InlineConfig, build as viteBuild } from "vite";
import { CLIENT_ENTRY_PATH, SERVER_ENTRY_PATH } from "./constants";
import * as path from "path";
import * as fs from "fs-extra";
import type { RollupOutput } from "rollup";

// 打包 client 和 server 的 bundle 文件
async function bundle(root: string) {
  try {
    // 生成 vite config
    const resolveViteConfig = (isServer: boolean): InlineConfig => {
      return {
        mode: "production",
        root,
        build: {
          ssr: isServer,
          outDir: isServer ? ".temp" : "build",
          rollupOptions: {
            input: isServer ? SERVER_ENTRY_PATH : CLIENT_ENTRY_PATH,
            output: {
              format: isServer ? "cjs" : "esm",
            },
          },
        },
      };
    };

    const clientBuild = async () => {
      return viteBuild(resolveViteConfig(false));
    };

    const serverBuild = async () => {
      return viteBuild(resolveViteConfig(true));
    };

    console.log("Building client + server bundles...");

    const [clientBundle, serverBundle] = await Promise.all([
      clientBuild(),
      serverBuild(),
    ]);
    return [clientBundle, serverBundle] as [RollupOutput, RollupOutput];
  } catch (err) {
    console.error(err);
  }
}

async function renderPage(
  render: () => string,
  root: string,
  clientBundle: RollupOutput
) {
  // 生成 html 文件，注入到 build 目录下的 index.html
  const appHtml = render();
  // 读取 client bundle 文件，获取 client bundle 文件名
  const clinetChunk = clientBundle.output.find(
    (chunk) => chunk.type === "chunk"
  );
  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>feather-press</title>
      </head>
      <body>
        <div id="root">${appHtml}</div>
        <script src="/${clinetChunk.fileName}"></script>
      </body>
    </html>
  `.trim();
  // 将 html 文件输出到 build 目录
  await fs.writeFile(path.join(root, "build", "index.html"), html);
  // 删除 .temp 目录
  await fs.remove(path.join(root, ".temp"));
}

export default async function build(root: string) {
  // 打包 client 和 server 的 bundle 文件
  const [clientBundle, serverBundle] = await bundle(root);
  // 读取 server bundle 文件，获取 render 函数
  const serverEntryPath = path.join(root, ".temp", "server-entry.js");
  const { render } = require(serverEntryPath);
  // 生成 html 文件，将 client bundle 注入到 html 中，输出到 build 目录，完成打包
  await renderPage(render, root, clientBundle);
}
