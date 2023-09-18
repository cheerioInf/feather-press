import { usePageData } from '@runtime';
import { Nav } from '../components/Nav';
import { HomeLayout } from './HomeLayout';
import { DocLayout } from './DocLayout';
import { Helmet } from 'react-helmet-async';
import { NotFoundLayout } from './NotFoundLayout';
import '../styles/base.css';
import '../styles/varsnew.css';
import '../styles/doc.css';
import 'uno.css';

export function Layout() {
  // 监听窗口大小变化，设置根元素字体大小，用于 rem 布局
  const setRootFontSize = () => {
    const html = document.documentElement;
    const width = html.getBoundingClientRect().width;
    // 最小字体 12px，最大字体 18px
    const fontSize = Math.min(Math.max(width / 100, 12), 16);
    html.style.fontSize = `${fontSize}px`;
  };
  window.addEventListener('resize', setRootFontSize);
  setRootFontSize();
  const pageData = usePageData();
  const { pageType, title } = pageData;
  // 根据 pageType 分发不同的页面内容
  const getContent = () => {
    if (pageType === 'home') {
      return <HomeLayout />;
    } else if (pageType === 'doc') {
      return <DocLayout />;
    } else if (pageType === '404') {
      return <NotFoundLayout />;
    }
  };

  return (
    <div>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Nav />
      <section className="pt-[--feather-nav-height]">{getContent()}</section>
    </div>
  );
}
