import { defineConfig } from 'vitepress'
import VueMacros from 'unplugin-vue-macros/vite'
import path from 'node:path';
import { fileURLToPath, URL } from 'node:url'
import { mdPlugin } from './config/plugins'
import { nav, sidebar } from './config/nav'
import { nav as navEn, sidebar as sidebarEn } from './config/en'
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
          find: /^@ant-design-x-vue\/x-card$/,
          replacement: path.resolve(__dirname, '../../packages/x-card/src/index.ts')
        },
        // Exact package entry only. Deep imports such as
        // `@antv/gpt-vis/dist/esm/vis/line` stay on the published files.
        // The barrel pulls in G6 and exhausts the Netlify docs heap.
        {
          find: /^@antv\/gpt-vis$/,
          replacement: path.resolve(__dirname, '../shared/gpt-vis-line.ts')
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
  // Old `*-v2` slugs stay reachable on this 2.x site. 1.x lives on another origin.
  rewrites: legacyRewriteMap(),
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      themeConfig: {
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
        langMenuLabel: '切换语言',
      },
    },
    en: {
      label: 'English',
      lang: 'en-US',
      themeConfig: {
        nav: navEn,
        sidebar: sidebarEn,
        outline: {
          label: 'On this page',
          level: [2, 3],
        },
        docFooter: {
          prev: 'Previous page',
          next: 'Next page',
        },
        darkModeSwitchLabel: 'Theme',
        lightModeSwitchTitle: 'Switch to light theme',
        darkModeSwitchTitle: 'Switch to dark theme',
        sidebarMenuLabel: 'Menu',
        returnToTopLabel: 'Return to top',
        langMenuLabel: 'Change language',
      },
    },
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: 'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original',
    siteTitle: 'Ant Design X <span class="brand-vue">Vue</span>',
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
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
          en: {
            translations: {
              button: {
                buttonText: 'Search',
                buttonAriaLabel: 'Search docs',
              },
              modal: {
                displayDetails: 'Display detailed list',
                resetButtonTitle: 'Reset search',
                backButtonTitle: 'Close search',
                noResultsText: 'No results found',
                footer: {
                  selectText: 'to select',
                  navigateText: 'to navigate',
                  closeText: 'to close',
                },
              },
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
