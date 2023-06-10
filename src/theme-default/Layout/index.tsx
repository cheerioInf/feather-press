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
