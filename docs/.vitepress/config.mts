import { defineConfig } from 'vitepress'
import VueMacros from 'unplugin-vue-macros/vite'
import path from 'node:path';
import { fileURLToPath, URL } from 'node:url'
import { mdPlugin } from './config/plugins'
import { nav, sidebar } from './config/nav'
import { legacyRewriteMap } from './config/version-switch'
import vueJsx from '@vitejs/plugin-vue-jsx';
import { MarkdownTransform } from './plugins/markdown-transform';
import { prependDocsStyles } from './theme/docs-style';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  postRender(ctx) {
    return prependDocsStyles(ctx)
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          silenceDeprecations: ['legacy-js-api'],
        },
      },
    },
    resolve: {
      alias: [
        {
          find: /^ant-design-x-vue$/,
          replacement: path.resolve(__dirname, '../../packages/components')
        },
        {
          find: /^ant-design-x-vue\/(.*)/,
          replacement: path.resolve(__dirname, '../../packages/components/$1')
        },
        {
          find: /^@ant-design-x-vue\/components$/,
          replacement: path.resolve(__dirname, '../../packages/components')
        },
        {
          find: /^@ant-design-x-vue\/x-markdown$/,
          replacement: path.resolve(__dirname, '../../packages/x-markdown/src/index.ts')
        },
        {
          find: /^@ant-design-x-vue\/x-markdown\/themes\/(.*)/,
          replacement: path.resolve(__dirname, '../../packages/x-markdown/themes/$1')
        },
        {
          find: /^@ant-design-x-vue\/x-markdown\/plugins\/(.*)/,
          replacement: path.resolve(__dirname, '../../packages/x-markdown/src/plugins/$1/index.ts')
        },
        {
          find: /^@ant-design-x-vue\/x-sdk$/,
          replacement: path.resolve(__dirname, '../../packages/x-sdk/src/index.ts')
        },
        {
          find: /^.*\/VPHero\.vue$/,
          replacement: fileURLToPath(
            new URL('./vitepress/components/vp-hero.vue', import.meta.url)
          )
        }
      ]
    },
    ssr: {
      noExternal: ['ant-design-vue', '@ant-design/icons-vue'], // 避免打包为 CommonJS
    },
    build: {
      rollupOptions: {
        output: {
          globals: {
            'ant-design-vue': 'AntDesignVue',
          },
        },
      },
    },
    plugins: [
      VueMacros({
        plugins: {
          vueJsx: vueJsx(),
        },
        // 覆盖插件选项
      }),
      MarkdownTransform(),
    ],
  },
  markdown: {
    config: (md) => mdPlugin(md),
  },
  title: "Ant Design X Vue",
  description: "Ant Design X For Vue",
  head: [
    ['link', { rel: 'icon', href: '/images/x-logo.svg' }],
  ],
  appearance: 'dark',
  lang: 'zh-CN',
  // Old `*-v2` slugs stay reachable on this 2.x site. 1.x lives on another origin.
  rewrites: legacyRewriteMap(),
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: 'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original',
    siteTitle: 'Ant Design X <span class="brand-vue">Vue</span>',
    nav,
    sidebar,
    outline: {
      label: '本页目录',
      level: [2, 3],
    },
    docFooter: {
      prev: '上一篇',
      next: '下一篇',
    },
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色',
    darkModeSwitchTitle: '切换到深色',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '回到顶部',
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索',
            buttonAriaLabel: '搜索文档',
          },
          modal: {
            displayDetails: '显示详细列表',
            resetButtonTitle: '清除',
            backButtonTitle: '关闭',
            noResultsText: '没有找到结果',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭',
            },
          },
        },
      },
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/wzc520pyfm/ant-design-x-vue' }
    ]
  }
})
