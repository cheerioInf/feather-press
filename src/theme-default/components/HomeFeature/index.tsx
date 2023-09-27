// theme-default/components/HomeFeature/index.tsx

import { Feature } from 'shared/types';
import useWindowType from '../../logic/useWindowType';

export function HomeFeature(props: { features: Feature[] }) {
  const isIpad = useWindowType() === 'ipad';
  const isMobile = useWindowType() === 'mobile';

  return (
    <div
      className={
        isIpad ? 'p-l-40 p-r-40' : isMobile ? 'p-l-15 p-r-15' : 'p-l-60 p-r-60'
      }
    >
      {props.features.map((feature, index) => {
        const { icon, title, details } = feature;
        return (
          <div key={index}>
            <div
              className="flex text-2xl m-b-5 border-l items-center p-b-5 p-t-5"
              style={{
                borderBottom: 'solid 0.1rem var(--feather-c-theme-1)'
              }}
            >
              <div className="p-r-5 p-l-5">{icon}</div>
              <div>{title}</div>
            </div>
            <div className="text-xl p-b-20">{details}</div>
          </div>
        );
      })}
    </div>
  );
}
