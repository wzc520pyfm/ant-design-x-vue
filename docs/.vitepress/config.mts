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
    nav,
    sidebar,
    outline: [2, 3],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/wzc520pyfm/ant-design-x-vue' }
    ]
  }
})
