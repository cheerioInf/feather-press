import { createRoot } from 'react-dom/client';
import { App, initPageData } from './App';
import { BrowserRouter } from 'react-router-dom';
import { DataContext } from './hooks';

async function renderInBrowser() {
  // 获取 root 元素
  const containerEl = document.getElementById('root');
  // 如果 root 元素不存在，抛出错误
  if (!containerEl) {
    throw new Error('root element not found');
  }
  const pageData = await initPageData(location.pathname);
  // 渲染
  createRoot(containerEl).render(
    <DataContext.Provider value={pageData}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </DataContext.Provider>
  );
}

renderInBrowser();
