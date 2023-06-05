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
              text: '快速上手',
              link: '/guide/a'
            },
            {
              text: '如何安装',
              link: '/guide/b'
            },
            {
              text: '注意事项',
              link: '/guide/c'
            }
          ]
        }
      ]
    }
  }
});
