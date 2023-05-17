import { Plugin } from 'vite';
import { RouteService } from './RouteService';

export interface Route {
  path: string;
  element: React.ReactElement;
  filePath: string;
}

interface PluginOptions {
  root: string;
}

export const CONVENTIONAL_ROUTE_ID = 'feather:routes';

export function pluginRoutes(options: PluginOptions): Plugin {
  const routeService = new RouteService(options.root);

  return {
    name: 'feather:routes',
    async configResolved() {
      // Vite 启动时，对 RouteService 进行初始化
      await routeService.init();
    },
    resolveId(id: string) {
      if (id === CONVENTIONAL_ROUTE_ID) {
        return '\0' + id;
      }
    },
    load(id: string) {
      if (id === '\0' + CONVENTIONAL_ROUTE_ID) {
        return routeService.generateRoutesCode();
      }
    }
  };
}
