import { e } from 'unocss';
import { SwitchAppearance } from '../SwitchAppearance';
import { MenuItem } from './MenuItem';
import styles from './index.module.scss';
import { usePageData } from '@runtime';

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
            hover="opacity-60"
            className="w-full h-full text-1rem font-semibold flex items-center"
          >
            {title}
          </a>
        </div>
        <div flex="~">
          {/* 普通菜单 */}
          <div flex="~">
            {nav.map((item) => (
              <MenuItem item={item} key={item.text} />
            ))}
          </div>
          {/* 深色模式 */}
          <div before="menu-item-before" flex="~">
            <SwitchAppearance />
          </div>
          {/* 外部链接 */}
          <div
            className={styles.socialLinkIcon}
            before="menu-item-before"
            ml="2"
          >
            <a target="blank" href={githubLink} className="flex items-center">
              <div className="i-carbon-logo-github w-6 h-6 fill-current"></div>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
