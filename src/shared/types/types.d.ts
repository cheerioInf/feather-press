/// <reference types="vite/client" />

import { ComponentType } from 'react';
import type { UserConfig } from 'shared/types';
import type { Route } from 'node/plugin-routes';

declare module 'feather:site-data' {
  const siteData: UserConfig;
  export default siteData;
}

declare module 'feather:routes' {
  export const routes: Route[];
}

declare global {
  interface Window {
    ISLANDS: Record<string, ComponentType<unknown>>;
    ISLAND_PROPS: unknown[];
  }
}
