// theme-default/components/HomeHero/index.tsx
import { Hero } from 'shared/types';
import { Button } from '../Button/index';
import isMobile from '../../logic/isMobile';
export function HomeHero(props: { hero: Hero }) {
  const { hero } = props;
  return (
    <div m="auto" p="t-20 x-20 b-16">
      <div
        flex="~"
        className={`max-w-1152px ${isMobile() ? 'flex-col' : ''}`}
        m="auto"
      >
        {isMobile() && hero.image && (
          <div flex="center" m="auto" className="w-50">
            <img src={hero.image.src} alt={hero.image.alt} />
          </div>
        )}
        <div
          text={isMobile() ? 'center' : 'left'}
          flex="~ col"
          className="max-w-592px"
        >
          <h1 font="bold" text="7xl" className="max-w-576px">
            <span className="text-[var(--feather-c-theme-1)]">{hero.name}</span>
          </h1>
          <p
            text={isMobile() ? '2xl' : '4xl'}
            font="bold"
            className="max-w-576px"
          >
            {hero.text}
          </p>
          <p
            p="t-3"
            text={isMobile() ? '1xl' : '2xl'}
            font="medium"
            className="whitespace-pre-wrap max-w-576px text-[var(--feather-c-text-3)]"
          >
            {hero.tagline}
          </p>
          <div flex="~ wrap" justify={isMobile() ? 'center' : 'start'} p="t-8">
            {hero.actions.map((action) => (
              <div key={action.link} p="1">
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
          <div w="max-96" h="max-96" flex="center" m="auto">
            <img src={hero.image.src} alt={hero.image.alt} />
          </div>
        )}
      </div>
    </div>
  );
}
