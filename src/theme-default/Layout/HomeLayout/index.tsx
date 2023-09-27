import { usePageData } from '@runtime';
import { HomeHero } from '../../components/HomeHero/index';
import { HomeFeature } from '../../components/HomeFeature/index';

export function HomeLayout() {
  const { frontMatter } = usePageData();

  return (
    <div>
      <HomeHero hero={frontMatter.hero} />
      <HomeFeature features={frontMatter.features} />
    </div>
  );
}
