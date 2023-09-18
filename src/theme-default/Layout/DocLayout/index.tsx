import { Content, usePageData } from '@runtime';
import { useLocation } from 'react-router-dom';
import { Sidebar } from '../../components/Sidebar/index';
import styles from './index.module.scss';
import { DocFooter } from '../../components/DocFooter/index';
import { Aside } from '../../components/Aside';
import { useState, useEffect } from 'react';

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

  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isIpad = width <= 1000 && width >= 768;
  const isMobile = width <= 768;

  return (
    <div>
      <div className={styles.content} flex="~">
        {isMobile ? null : (
          <Sidebar sidebarData={matchedSidebar} pathname={pathname} />
        )}
        <div
          className={styles.docContent}
          style={{
            paddingLeft: isMobile ? '0rem' : '20rem'
          }}
        >
          <div className="feather-doc">
            <Content />
          </div>
          <DocFooter />
        </div>
        {isIpad || isMobile ? null : (
          <div className={styles.asideContainer}>
            <Aside headers={toc} __island />
          </div>
        )}
      </div>
    </div>
  );
}
