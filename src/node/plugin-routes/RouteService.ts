import fastGlob from 'fast-glob';
import { normalizePath } from 'vite';
import { relative } from 'path';

interface RouteMeta {
  routePath: string;
  absolutePath: string;
}

export class RouteService {
  // 扫描目录
  readonly #scanDir: string;
  // 路由数据
  #routeData: RouteMeta[] = [];

  constructor(scanDir: string) {
    this.#scanDir = scanDir;
  }

  async init() {
    // 扫描目录下的所有文件的绝对路径
    const files = fastGlob
      .sync(['**/*.{js,jsx,ts,tsx,md,mdx}'], {
        cwd: this.#scanDir,
        absolute: true,
        ignore: ['**/node_modules/**', '**/build/**', 'config.ts']
      })
      .sort();

    files.forEach((file) => {
      // 1. 路由路径
      const fileRelativePath = normalizePath(relative(this.#scanDir, file));
      const routePath = this.normalizeRoutePath(fileRelativePath);
      // 2. 文件绝对路径
      this.#routeData.push({
        routePath,
        absolutePath: file
      });
    });
  }

  getRouteMeta(): RouteMeta[] {
    return this.#routeData;
  }

  // 改为客户端路由路径
  normalizeRoutePath(rawPath: string) {
    const routePath = rawPath.replace(/\.(.*)?$/, '').replace(/index$/, '');
    return routePath.startsWith('/') ? routePath : `/${routePath}`;
  }

  // 生成路由代码
  generateRoutesCode(ssr = false) {
    return `
      import React from 'react';
      ${ssr ? '' : 'import loadable from "@loadable/component";'}
      ${this.#routeData
        .map((route, index) => {
          return ssr
            ? `import Route${index} from "${route.absolutePath}";`
            : `const Route${index} = loadable(() => import('${route.absolutePath}'));`;
        })
        .join('\n')}
      export const routes = [
        ${this.#routeData
          .map((route, index) => {
            return `{ path: '${route.routePath}', element: React.createElement(Route${index}), preload: () => import('${route.absolutePath}') }`;
          })
          .join(',\n')}
      ];
    `;
  }
}
