import { SidebarGroup, SidebarItem } from 'shared/types';
import styles from './index.module.scss';
import { Link } from '../Link';

interface SidebarProps {
  sidebarData: SidebarGroup[];
  pathname: string;
}

export function Sidebar(props: SidebarProps) {
  const { sidebarData, pathname } = props;

  const renderGroupItem = (item: SidebarItem) => {
    const active = item.link === pathname;
    return (
      <div ml="3">
        <div
          className={`p-t-2 p-b-2 text-lg ${
            active
              ? 'text-[var(--feather-c-theme-1)]'
              : 'text-[var(--feather-c-text-3)]'
          }`}
        >
          <Link href={item.link}>{item.text}</Link>
        </div>
      </div>
    );
  };

  const renderGroup = (item: SidebarGroup) => {
    return (
      <section key={item.text} block="~">
        <div flex="~" justify="between" items="center" mb="2">
          <h2
            className="text-xl font-bold w-full m-r-5 p-1"
            style={{
              borderBottom: 'solid 0.1rem var(--feather-c-border)'
            }}
          >
            {item.text}
          </h2>
        </div>
        <div mb="1">
          {item.items?.map((item) => (
            <div key={item.link}>{renderGroupItem(item)}</div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <aside className={styles.sidebar}>
      <nav>{sidebarData.map(renderGroup)}</nav>
    </aside>
  );
}
