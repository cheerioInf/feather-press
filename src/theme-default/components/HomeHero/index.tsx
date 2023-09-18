// theme-default/components/HomeHero/index.tsx
import { Hero } from 'shared/types';
import { Button } from '../Button/index';
import isMobile from '../../logic/isMobile';
export function HomeHero(props: { hero: Hero }) {
  const { hero } = props;
  return (
    <div m="auto">
      <div
        flex="~"
        className={`${isMobile() ? 'flex-col' : ''} p-30 ${
          // 如果屏幕宽度大于 1000px，设置左右边距为 p-l-60 p-r-60
          window.innerWidth > 1000 ? 'p-l-80 p-r-80' : ''
        } flex justify-between`}
        m="auto"
      >
        {isMobile() && hero.image && (
          <div flex="center" m="auto" className="w-50">
            <img src={hero.image.src} alt={hero.image.alt} />
          </div>
        )}
        <div text={isMobile() ? 'center' : 'left'} flex="~ col">
          <h1 font="bold" text="6xl">
            <span className="text-[var(--feather-c-theme-1)]">{hero.name}</span>
          </h1>
          <p text={isMobile() ? '2xl' : '3xl'} font="bold">
            {hero.text}
          </p>
          <p
            p="t-3"
            text={isMobile() ? '1xl' : '2xl'}
            font="medium"
            className="whitespace-pre-wrap text-[var(--feather-c-text-3)]"
          >
            {hero.tagline}
          </p>
          <div flex="~ wrap" justify={isMobile() ? 'center' : 'start'} p="t-5">
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
        {!isMobile() && hero.image && (
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
