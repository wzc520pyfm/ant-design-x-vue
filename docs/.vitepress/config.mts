import { defineConfig } from 'vitepress'
import VueMacros from 'unplugin-vue-macros/vite'
import path from 'node:path';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  vite: {
    resolve: {
      alias: {
        '@ant-design-x-vue': path.resolve(__dirname, '../../src'),
      },
    },
    plugins: [
      VueMacros({
        plugins: {
          vueJsx: vueJsx(),
        },
        // 覆盖插件选项
      }),
    ],
  },
  title: "Ant Design X Vue",
  description: "Ant Design X For Vue",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: 'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original',

    nav: [
      { text: '组件', link: '/component/overview' }
    ],

    sidebar: [
      {
        text: '总览',
        link: '/component/overview'
      },
      {
        text: '通用',
        items: [
          { text: 'Bubble 对话气泡框', link: '/component/bubble' }
        ]
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})