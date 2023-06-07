import { App, initPageData } from './App';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { DataContext } from './hooks';

export interface RenderResult {
  appHtml: string;
  propsData: unknown[];
  islandToPathMap: Record<string, string>;
}

export async function render(pagePath: string) {
  // 生产 pageData
  const pageData = await initPageData(pagePath);
  const { clearIslandData, data } = await import('./jsx-runtime');
  const { islandProps, islandToPathMap } = data;
  clearIslandData();

  const appHtml = renderToString(
    <DataContext.Provider value={pageData}>
      <StaticRouter location={pagePath}>
        <App />
      </StaticRouter>
    </DataContext.Provider>
  );

  return {
    appHtml,
    islandProps,
    islandToPathMap
  };
}

export { routes } from 'feather:routes';
