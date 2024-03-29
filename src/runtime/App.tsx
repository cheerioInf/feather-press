import { routes } from 'feather:routes';
import { matchRoutes } from 'react-router-dom';
import { PageData } from 'shared/types';
import { Layout } from '../theme-default';
import siteData from 'feather:site-data';

/*
 * 初始化页面数据
 * @param routePath 路由路径
 * @returns 页面数据
 */
export async function initPageData(routePath: string): Promise<PageData> {
  // 获取路由组件编译后的模块内容
  const matched = matchRoutes(routes, routePath);
  // console.log(routes);

  if (matched) {
    // 获取页面数据
    const moduleInfo = await matched[0].route.preload();

    return {
      pageType: moduleInfo.frontmatter?.pageType ?? 'doc',
      siteData,
      frontMatter: moduleInfo.frontmatter,
      pagePath: routePath,
      toc: moduleInfo.toc,
      title: moduleInfo.title
    };
  }

  return {
    pageType: '404',
    siteData,
    pagePath: routePath,
    frontMatter: {},
    title: '404'
  };
}

export function App() {
  return <Layout />;
}
