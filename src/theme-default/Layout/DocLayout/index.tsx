import { Content, usePageData } from '@runtime';
import { useLocation } from 'react-router-dom';
import { Sidebar } from '../../components/Sidebar';
import './index.scss';
import { DocFooter } from '../../components/DocFooter';
import { Aside } from '../../components/Aside';

export function DocLayout() {
  const { siteData, toc } = usePageData();
  const sidebarData = siteData.themeConfig?.sidebar || {};
  const { pathname } = useLocation();
  const matchedSidebarKey = Object.keys(sidebarData).find((key) => {
    if (pathname.startsWith(key)) {
      return true;
    }
  });

  const matchedSidebar = sidebarData[matchedSidebarKey] || [];

  return (
    <div>
      <div className="content" flex="~">
        <div className="hidden md:block">
          <Sidebar sidebarData={matchedSidebar} pathname={pathname} />
        </div>
        <div className="doc-content pl-0 md:pl-100">
          <div className="feather-doc">
            <Content />
          </div>
          <DocFooter />
        </div>
        <div className="aside-container hidden lg:block">
          <Aside headers={toc} />
        </div>
      </div>
    </div>
  );
}
