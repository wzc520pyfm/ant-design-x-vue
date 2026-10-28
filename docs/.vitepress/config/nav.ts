import type { DefaultTheme } from 'vitepress'

const more: DefaultTheme.NavItem = {
  text: '更多',
  items: [
    { text: 'Ant Design X of React', link: 'https://x.ant.design/index-cn' },
    { text: 'Ant Design Vue', link: 'https://www.antdv.com/components/overview-cn' },
  ],
}

export const nav: DefaultTheme.NavItem[] = [
  { text: '研发', link: '/development/introduce' },
  { text: '组件', link: '/component/overview' },
  { text: '演示', link: '/playground/independent' },
  more,
]

const v2ComponentSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: '总览',
    link: '/component/overview',
  },
  {
    text: '通用',
    items: [
      { text: 'Bubble 对话气泡框', link: '/component/bubble' },
      { text: 'Conversations 管理对话', link: '/component/conversations' },
      { text: 'Notification 系统通知', link: '/component/notification' },
    ],
  },
  {
    text: '唤醒',
    items: [
      { text: 'Welcome 欢迎', link: '/component/welcome' },
      { text: 'Prompts 提示集', link: '/component/prompts' },
    ],
  },
  {
    text: '表达',
    items: [
      { text: 'Sender 输入框', link: '/component/sender' },
      { text: 'Suggestion 快捷指令', link: '/component/suggestion' },
      { text: 'FileCard 文件卡片', link: '/component/file-card' },
    ],
  },
  {
    text: '确认',
    items: [
      { text: 'Think 思考过程', link: '/component/think' },
      { text: 'ThoughtChain 思维链', link: '/component/thought-chain' },
      { text: 'Sources 引用来源', link: '/component/sources' },
    ],
  },
  {
    text: '工具',
    items: [
      { text: 'SDK 数据流', link: '/component/sdk' },
      { text: 'SDK 介绍', link: '/component/x-sdk-introduce' },
      { text: 'Chat Provider', link: '/component/x-sdk-chat-provider' },
      { text: 'useXChat 会话数据', link: '/component/x-sdk-use-x-chat' },
      { text: 'useXConversations 会话列表', link: '/component/x-sdk-use-x-conversations' },
      { text: 'XRequest 请求', link: '/component/x-sdk-x-request' },
      { text: 'XStream 流', link: '/component/x-sdk-x-stream' },
      { text: 'XMarkdown 富文本', link: '/component/x-markdown' },
      { text: 'XMarkdown 插件', link: '/component/x-markdown-plugins' },
      { text: 'XMarkdown 主题', link: '/component/x-markdown-themes' },
      { text: 'XMarkdown 流式语法', link: '/component/x-markdown-streaming' },
      { text: 'XProvider 全局化配置', link: '/component/x-provider' },
    ],
  },
]

const developmentSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: 'Ant Design X of Vue',
    link: '/development/introduce',
  },
  {
    text: '样式兼容',
    link: '/development/compatible-style',
  },
  {
    text: '从 v1 到 v2',
    link: '/development/migration-v2',
  },
  {
    text: '设计范式',
    link: '/development/spec',
  },
  {
    text: '2.0 核对清单',
    link: '/development/release-checklist',
  },
]

const playgroundSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: '样板间',
    items: [
      { text: '独立式', link: '/playground/independent' },
      { text: '助手式', link: '/playground/copilot' },
      { text: '现代感', link: '/playground/ultramodern' },
      { text: '百宝箱', link: '/playground/agent-tbox' },
    ],
  },
]

export const sidebar: DefaultTheme.Sidebar = {
  '/development/': developmentSidebar,
  '/component/': v2ComponentSidebar,
  '/playground/': playgroundSidebar,
}
