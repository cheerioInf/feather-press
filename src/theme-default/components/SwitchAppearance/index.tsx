import styles from './index.module.scss';
import { toggle } from '../../logic/toggleAppearance';
import { PropsWithIsland } from '../../../shared/types/index';
import useWindowType from '../../logic/useWindowType';
import { updateAppearance } from '../../logic/toggleAppearance';

interface SwitchProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function Switch(props: SwitchProps) {
  return (
    <div className="flex items-center">
      <button
        className={`${styles.switch} ${props.className}`}
        id={props.id ?? ''}
        type="button"
        role="switch"
        {...(props.onClick ? { onClick: props.onClick } : {})}
      >
        <span className={styles.check}>
          <span className={styles.icon}>{props.children}</span>
        </span>
      </button>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function SwitchAppearance(props: PropsWithIsland) {
  useWindowType();
  // ssr 跳过
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    updateAppearance();
    // 多标签页状态同步
    window.addEventListener('storage', updateAppearance);
  }

  return (
    <Switch onClick={toggle}>
      <div className={styles.sun}>
        <div className="i-carbon-sun" w="full" h="full"></div>
      </div>
      <div className={styles.moon}>
        <div className="i-carbon-moon" w="full" h="full"></div>
      </div>
    </Switch>
  );
}
