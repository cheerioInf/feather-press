// theme-default/components/HomeHero/index.tsx
import { Hero } from 'shared/types';
import { Button } from '../Button';

export function HomeHero(props: { hero: Hero }) {
  const { hero } = props;

  return (
    <div m="auto">
      <div
        flex="~"
        className="
          p-30
          flex-col
          lg:p-l-80 lg:p-r-80 lg:flex-row
          md:p-l-30 md:p-r-30 md:flex-row
         flex justify-between"
        m="auto"
      >
        {hero.image && (
          <div flex="center" m="auto" className="md:hidden w-50">
            <img src={hero.image.src} alt={hero.image.alt} />
          </div>
        )}
        <div className="text-center md:text-left" flex="~ col">
          <h1 font="bold" text="6xl">
            <span className="text-[var(--feather-c-theme-1)]">{hero.name}</span>
          </h1>
          <p className="text-2xl md:text-3xl" font="bold">
            {hero.text}
          </p>
          <p
            p="t-3"
            font="medium"
            className="text-xl md:text-2xl whitespace-pre-wrap text-[var(--feather-c-text-3)]"
          >
            {hero.tagline}
          </p>
          <div
            flex="~ wrap"
            className="justify-center md:justify-start"
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
        <img
          className="hidden md:block"
          style={{
            width: '15rem',
            height: 'auto',
            objectFit: 'contain'
          }}
          src={hero.image.src}
          alt={hero.image.alt}
        />
      </div>
    </div>
  );
}
