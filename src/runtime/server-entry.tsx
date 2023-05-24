import { App, initPageData } from './App';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { DataContext } from './hooks';

export async function render(pagePath: string) {
  // 生产 pageData
  const pageData = await initPageData(pagePath);

  return renderToString(
    <DataContext.Provider value={pageData}>
      <StaticRouter location={pagePath}>
        <App />
      </StaticRouter>
    </DataContext.Provider>
  );
}

export { routes } from 'feather:routes';
