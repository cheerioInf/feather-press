import { useEffect, useState } from 'react';
import { SwitchAppearance } from '../SwitchAppearance';
import { MenuItem } from './MenuItem';
import styles from './index.module.scss';
import { usePageData } from '@runtime';

export function Nav() {
  const { siteData } = usePageData();
  const nav = siteData.themeConfig.nav || [];
  const title = siteData.title || 'Feather.js';
  const githubLink = siteData.themeConfig.githubLink || '#';

  const [isShowMobileMenu, setIsShowMobileMenu] = useState(false);

  // 打开移动端菜单时，禁止滚动
  useEffect(() => {
    if (isShowMobileMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isShowMobileMenu]);

  return (
    <header fixed="~" pos="t-0 l-0" w="full" z="10">
      <div
        flex="~"
        items="center"
        justify="between"
        className={`h-14 divider-bottom ${styles.nav}`}
      >
        <div>
          <a
            href="/"
            hover="opacity-50 transition-500"
            className="w-full h-full text-lg font-semibold text-1rem flex items-center"
          >
            {title}
          </a>
        </div>
        <div className="block md:hidden">
          <div
            onClick={() => setIsShowMobileMenu(!isShowMobileMenu)}
            className="i-carbon-text-align-justify w-8 h-8 fill-current"
          ></div>
          {isShowMobileMenu && (
            <div className={styles.mobileMenu}>
              {nav.map((item) => (
                <MenuItem item={item} key={item.text} mobile />
              ))}
              <div className={styles.mobileAppearance}>
                <div
                  style={{
                    transform: 'scale(1.2)'
                  }}
                >
                  <SwitchAppearance __island />
                </div>
                <div className={styles.socialLinkIconMobile}>
                  <a
                    target="blank"
                    href={githubLink}
                    className="flex items-center"
                  >
                    <div className="i-carbon-logo-github w-10 h-10 fill-current"></div>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="hidden md:flex align-middle">
          {/* 普通菜单 */}
          <div flex="~" className="items-center">
            {nav.map((item) => (
              <MenuItem item={item} key={item.text} mobile={false} />
            ))}
          </div>
          {/* 深色模式 */}
          <div before="menu-item-before" flex="~">
            <SwitchAppearance __island />
          </div>
          {/* 外部链接 */}
          <div className={styles.socialLinkIcon} before="menu-item-before">
            <a target="blank" href={githubLink} className="flex items-center">
              <div className="i-carbon-logo-github w-6 h-6 fill-current"></div>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
