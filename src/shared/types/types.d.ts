/// <reference types="vite/client" />

import { ComponentType } from 'react';

declare global {
  interface Window {
    ISLANDS: Record<string, ComponentType<unknown>>;
    ISLAND_PROPS: unknown[];
  }
}

declare module 'feather:site-data' {
  import type { UserConfig } from './types';
  const siteData: UserConfig;
  export default siteData;
}

declare module 'feather:routes' {
  import type { Route } from '../node/plugin-routes';
  export const routes: Route[];
}
