import { SwitchAppearance } from '../SwitchAppearance';
import { MenuItem } from './MenuItem';
import styles from './index.module.scss';
import { usePageData } from '@runtime';
import { MobileNav } from './MobileNav';

export function Nav() {
  const { siteData } = usePageData();
  const nav = siteData.themeConfig.nav || [];
  const title = siteData.title || 'Feather.js';
  const githubLink = siteData.themeConfig.githubLink || '#';

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
        <MobileNav nav={nav} githubLink={githubLink} __island />
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
              <div className="i-carbon-logo-github w-8 h-8 fill-current"></div>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
