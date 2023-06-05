import { NavItemWithLink } from 'shared/types';
import styles from './index.module.scss';

export function MenuItem({ item }: { item: NavItemWithLink }) {
  return (
    <div className="text-sm font-medium mx-3 flex items-center">
      <a href={item.link} className={styles.link}>
        <span>{item.text}</span>
      </a>
    </div>
  );
}
