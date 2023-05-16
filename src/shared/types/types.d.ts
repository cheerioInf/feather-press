declare module 'feather:site-data' {
  import type { UserConfig } from 'shared/types';
  const siteData: UserConfig;
  export default siteData;
}

declare module 'feather:routes' {
  import { RouteObject } from 'react-router-dom';
  const routes: RouteObject[];
  export default routes;
}
