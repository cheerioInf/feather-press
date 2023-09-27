import { defineConfig } from '../dist/index.mjs';

export default defineConfig({
  title: 'FeatherPress',
  themeConfig: {
    nav: [
      { text: '主页', link: '/' },
      { text: '指南', link: '/guide/' }
    ],
    githubLink: 'https://github.com/cheerioInf/feather-press',
    // 新增 sidebar 的内容
    sidebar: {
      '/guide/': [
        {
          text: '教程',
          items: [
            {
              text: '介绍',
              link: '/guide/'
            },
            {
              text: '快速上手',
              link: '/guide/a'
            }
          ]
        }
      ]
    }
  }
});
