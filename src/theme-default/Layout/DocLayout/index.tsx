import { Content, usePageData } from '@runtime';
import { useLocation } from 'react-router-dom';
import { Sidebar } from '../../components/Sidebar';
import styles from './index.module.scss';
import { DocFooter } from '../../components/DocFooter';
import { Aside } from '../../components/Aside';
import useWindowType from '../../logic/useWindowType';

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
  const windowType = useWindowType();

  return (
    <div>
      <div className={styles.content} flex="~">
        {windowType === 'mobile' ? null : (
          <Sidebar sidebarData={matchedSidebar} pathname={pathname} />
        )}
        <div
          className={styles.docContent}
          style={{
            paddingLeft: windowType === 'mobile' ? '0rem' : '25rem'
          }}
        >
          <div className="feather-doc">
            <Content />
          </div>
          <DocFooter />
        </div>
        {windowType === 'ipad' || windowType === 'mobile' ? null : (
          <div className={styles.asideContainer}>
            <Aside headers={toc} />
          </div>
        )}
      </div>
    </div>
  );
}
