import { NavItemWithLink } from 'shared/types';
import styles from './index.module.scss';

export function MenuItem({
  item,
  mobile
}: {
  item: NavItemWithLink;
  mobile: boolean;
}) {
  return (
    <div>
      {mobile ? (
        <div>
          <div className="text-xl font-medium mx-8 flex items-center w-full">
            <a href={item.link} className={styles.linkMobile}>
              <span>{item.text}</span>
            </a>
          </div>
        </div>
      ) : (
        <div className="text-base font-medium mx-3 flex items-center">
          <a href={item.link} className={styles.link}>
            <span>{item.text}</span>
          </a>
        </div>
      )}
    </div>
  );
}
