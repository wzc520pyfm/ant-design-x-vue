import { defineConfig } from 'vitepress'
import VueMacros from 'unplugin-vue-macros/vite'
import path from 'node:path';
import { fileURLToPath, URL } from 'node:url'
import { mdPlugin } from './config/plugins'
import vueJsx from '@vitejs/plugin-vue-jsx';
import { MarkdownTransform } from './plugins/markdown-transform';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  vite: {
    resolve: {
      alias: [
        {
          find: /^ant-design-x-vue$/,
          replacement: path.resolve(__dirname, '../../src')
        },
        {
          find: /^dayjs\/plugin\/quarterOfYear$/,
          replacement: 'dayjs/esm/plugin/quarterOfYear'
        },
        {
          find: /^dayjs\/plugin\/weekYear$/,
          replacement: 'dayjs/esm/plugin/weekYear'
        },
        {
          find: /^dayjs\/plugin\/weekOfYear$/,
          replacement: 'dayjs/esm/plugin/weekOfYear'
        },
        {
          find: /^dayjs\/plugin\/localeData$/,
          replacement: 'dayjs/esm/plugin/localeData'
        },
        {
          find: /^dayjs\/plugin\/weekday$/,
          replacement: 'dayjs/esm/plugin/weekday'
        },
        {
          find: /^dayjs\/plugin\/advancedFormat$/,
          replacement: 'dayjs/esm/plugin/advancedFormat'
        },
        {
          find: /^dayjs\/plugin\/customParseFormat$/,
          replacement: 'dayjs/esm/plugin/customParseFormat'
        },
        {
          find: /^dayjs$/,
          replacement: 'dayjs/esm'
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
  appearance: 'dark',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: 'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original',
    nav: [
      { text: '组件', link: '/component/overview' },
      { text: '演示', link: '/playground/independent' },
      {
        text: '更多',
        items: [
          { text: 'Ant Design X of React', link: 'https://x.ant.design/index-cn' },
          { text: 'Ant Design Vue', link: 'https://www.antdv.com/components/overview-cn' },
        ]
      }
    ],
    outline:[2,3],

    sidebar: {
      '/component/': [
        {
          text: '总览',
          link: '/component/overview'
        },
        {
          text: '通用',
          items: [
            { text: 'Bubble 对话气泡框', link: '/component/bubble' },
            { text: 'Conversations 管理对话', link: '/component/conversations' }
          ]
        },
        {
          text: '唤醒',
          items: [
            { text: 'Welcome 欢迎', link: '/component/welcome' },
            { text: 'Prompts 提示集', link: '/component/prompts' }
          ]
        },
        {
          text: '表达',
          items: [
            { text: 'Sender 输入框', link: '/component/sender' },
            { text: 'Attachments 输入附件', link: '/component/attachments' },
            { text: 'Suggestion 快捷指令', link: '/component/suggestion' }
          ]
        },
        {
          text: '确认',
          items: [
            { text: 'ThoughtChain 思维链', link: '/component/thought-chain' }
          ]
        },
        {
          text: '工具',
          items: [
            { text: 'useXAgent 模型调度', link: '/component/use-x-agent' },
            { text: 'useXChat 数据管理', link: '/component/use-x-chat' },
            { text: 'XStream 流', link: '/component/x-stream' },
            { text: 'XRequest 请求', link: '/component/x-request' },
            { text: 'XProvider 全局化配置', link: '/component/x-provider' }
          ]
        },
      ],
      '/playground/': [
        {
          text: '样板间',
          items: [
            { text: '独立式', link: '/playground/independent' }
          ]
        },
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/wzc520pyfm/ant-design-x-vue' }
    ]
  }
})
