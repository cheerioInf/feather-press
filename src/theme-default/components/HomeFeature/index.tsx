// theme-default/components/HomeFeature/index.tsx

import { Feature } from 'shared/types';

export function HomeFeature(props: { features: Feature[] }) {
  return (
    <div className="max-w-1152px" m="auto" flex="~ wrap" justify="between">
      {props.features.map((feature) => {
        const { icon, title, details } = feature;
        return (
          <div key={title} p="r-4 b-4" w="1/3">
            <article
              className="border-[var(--feather-c-border)]"
              bg="bg-soft"
              border="~ solid rounded-xl"
              p="6"
              h="full"
            >
              <div
                border="rounded-md"
                className="bg-[var(--feather-c-bg-feature)] mb-5 w-12 h-12 text-3xl flex-center"
              >
                {icon}
              </div>
              <h2 font="bold">{title}</h2>
              <p
                text="sm text-2"
                font="medium"
                className="pt-2 leading-6 text-[var(--feather-c-text-3)]"
              >
                {details}
              </p>
            </article>
          </div>
        );
      })}
    </div>
  );
}
