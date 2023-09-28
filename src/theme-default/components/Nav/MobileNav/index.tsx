import { useEffect, useState } from 'react';
import { SwitchAppearance } from '../../SwitchAppearance';
import { MenuItem } from '../MenuItem';
import styles from '../index.module.scss';

export function MobileNav({
  nav,
  githubLink,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  __island
}: {
  nav: any[];
  githubLink: string;
  __island?: boolean;
}) {
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
              <a target="blank" href={githubLink} className="flex items-center">
                <div className="i-carbon-logo-github w-10 h-10 fill-current"></div>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
