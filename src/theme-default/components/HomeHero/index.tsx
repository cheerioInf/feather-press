// theme-default/components/HomeHero/index.tsx
import { Hero } from 'shared/types';
import { Button } from '../Button';
import useWindowType from '../../logic/useWindowType';

export function HomeHero(props: { hero: Hero }) {
  const { hero } = props;
  const windowType = useWindowType();

  return (
    <div m="auto">
      <div
        flex="~"
        className={`${windowType === 'mobile' ? 'flex-col' : ''} p-30 ${
          // 如果屏幕宽度大于 1000px，设置左右边距为 p-l-60 p-r-60
          windowType === 'ipad'
            ? 'p-l-40 p-r-40'
            : windowType === 'pc'
            ? 'p-l-60 p-r-60'
            : 'p-l-15 p-r-15'
        } flex justify-between`}
        m="auto"
      >
        {windowType === 'mobile' && hero.image && (
          <div flex="center" m="auto" className="w-50">
            <img src={hero.image.src} alt={hero.image.alt} />
          </div>
        )}
        <div text={windowType === 'mobile' ? 'center' : 'left'} flex="~ col">
          <h1 font="bold" text="6xl">
            <span className="text-[var(--feather-c-theme-1)]">{hero.name}</span>
          </h1>
          <p text={windowType === 'mobile' ? '2xl' : '3xl'} font="bold">
            {hero.text}
          </p>
          <p
            p="t-3"
            text={windowType === 'mobile' ? '1xl' : '2xl'}
            font="medium"
            className="whitespace-pre-wrap text-[var(--feather-c-text-3)]"
          >
            {hero.tagline}
          </p>
          <div
            flex="~ wrap"
            justify={windowType === 'mobile' ? 'center' : 'start'}
            p="t-5"
          >
            {hero.actions.map((action) => (
              <div key={action.link} p="5">
                <Button
                  type="a"
                  text={action.text}
                  href={action.link}
                  theme={action.theme}
                />
              </div>
            ))}
          </div>
        </div>
        {windowType !== 'mobile' && hero.image && (
          <img
            style={{
              width: '15rem',
              height: 'auto',
              objectFit: 'contain'
            }}
            src={hero.image.src}
            alt={hero.image.alt}
          />
        )}
      </div>
    </div>
  );
}
