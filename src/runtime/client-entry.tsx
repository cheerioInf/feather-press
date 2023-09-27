import { createRoot, hydrateRoot } from 'react-dom/client';
import { App, initPageData } from './App';
import { BrowserRouter } from 'react-router-dom';
import { DataContext } from './hooks';
import { ComponentType } from 'react';
import { HelmetProvider } from 'react-helmet-async';

async function renderInBrowser() {
  const containerEl = document.getElementById('root');
  if (!containerEl) {
    throw new Error('root element not found');
  }

  if (import.meta.env.DEV) {
    // 开发环境
    const pageData = await initPageData(location.pathname);

    createRoot(containerEl).render(
      <HelmetProvider>
        <DataContext.Provider value={pageData}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </DataContext.Provider>
      </HelmetProvider>
    );
  } else {
    // 生产环境
    const islands = document.querySelectorAll('[__island]');
    if (islands.length === 0) {
      return;
    }

    for (const island of islands) {
      const [id, index] = island.getAttribute('__island').split(':');
      const Element = window.ISLANDS[id] as ComponentType<unknown>;
      hydrateRoot(island, <Element {...window.ISLAND_PROPS[index]} />);
    }
  }
  return;
}

renderInBrowser().then();
