import type { DefaultTheme } from 'vitepress'

const react = 'https://x.ant.design'

function link(text: string, href: string, activeMatch?: string): DefaultTheme.NavItemWithLink {
  return { text, link: href, activeMatch }
}

function plain(text: string, href: string): DefaultTheme.SidebarItem {
  return { text, link: href }
}

/** Matches `@ant-design/x@2.0.0` `Header/Navigation.tsx` defaultItems. */
export const nav: DefaultTheme.NavItem[] = [
  link('设计', '/design/introduce', '/design/'),
  link('研发', '/development/introduce', '/development/'),
  link('组件', '/component/overview', '/component/'),
  link('X Markdown', '/x-markdown/introduce', '/x-markdown/'),
  link('X SDK', '/x-sdk/introduce', '/x-sdk/'),
  link('演示', '/playground/ultramodern', '/playground/'),
]

const componentSidebar: DefaultTheme.SidebarItem[] = [
  plain('介绍', '/component/introduce'),
  plain('总览', '/component/overview'),
  {
    text: '通用',
    items: [
      plain('Bubble 对话气泡', '/component/bubble'),
      plain('Conversations 管理对话', '/component/conversations'),
      plain('Notification 系统通知', '/component/notification'),
    ],
  },
  {
    text: '唤醒',
    items: [
      plain('Welcome 欢迎', '/component/welcome'),
      plain('Prompts 提示集', '/component/prompts'),
    ],
  },
  {
    text: '表达',
    items: [
      plain('Attachments 输入附件', '/component/attachments'),
      plain('Sender 输入框', '/component/sender'),
      plain('Suggestion 快捷指令', '/component/suggestion'),
    ],
  },
  {
    text: '确认',
    items: [
      plain('Think 思考过程', '/component/think'),
      plain('ThoughtChain 思维链', '/component/thought-chain'),
      plain('Sources 来源引用', '/component/sources'),
    ],
  },
  {
    text: '反馈',
    items: [
      plain('Actions 操作列表', '/component/actions'),
      plain('FileCard 文件卡片', '/component/file-card'),
    ],
  },
  {
    text: '其他',
    items: [
      plain('XProvider 全局化配置', '/component/x-provider'),
    ],
  },
]

const designSidebar: DefaultTheme.SidebarItem[] = [
  plain('RICH 设计范式简介', '/design/introduce'),
  {
    text: '🎭 Role 角色设计',
    items: [
      plain('介绍', '/design/role-design'),
      plain('真实一致', '/design/authentic-consistent'),
      plain('流畅自然', '/design/smooth-natural'),
      plain('有人情味', '/design/human-touch'),
    ],
  },
  {
    text: '❤️ Intention 意图设计',
    items: [
      plain('介绍', '/design/intention-introduce'),
      plain('明确意图类型', '/design/define-intention-type'),
      plain('提供意图预期', '/design/provide-intention-expectation'),
      plain('引导意图表达', '/design/guide-intention-expression'),
    ],
  },
  {
    text: '💭 Conversation 会话设计',
    items: [
      plain('介绍', '/design/conversation-design'),
      plain('开始', '/design/start'),
      plain('追问', '/design/follow-up'),
      plain('提示', '/design/hint'),
      plain('确认', '/design/confirm'),
      plain('错误', '/design/error'),
      plain('结束', '/design/end'),
    ],
  },
  {
    text: '💻 Hybrid UI 混合界面设计',
    items: [
      plain('介绍', '/design/hybrid-ui-design'),
      plain('唤醒｜AI 标识', '/design/wake-up-ai-icon'),
      plain('唤醒｜欢迎提示', '/design/wake-up-welcome-message'),
      plain('表达｜用户输入', '/design/expression-user-input'),
      plain('表达｜用户发送', '/design/expression-user-send'),
      plain('确认｜生成过程', '/design/confirm-generation-process'),
      plain('反馈｜结果应用', '/design/feedback-result-application'),
      plain('反馈｜结果展示', '/design/feedback-result-display'),
    ],
  },
]

const developmentSidebar: DefaultTheme.SidebarItem[] = [
  plain('Ant Design X', '/development/introduce'),
  {
    text: '模型接入',
    items: [
      plain('OpenAI', '/development/model-openai'),
      plain('通义千问', '/development/model-qwen'),
    ],
  },
  {
    text: '智能体接入',
    items: [
      plain('百宝箱', '/development/agent-tbox'),
    ],
  },
  {
    text: '如何使用',
    items: [
      plain('在 Vite 中使用', '/development/use-with-vite'),
      plain('在 Nuxt 中使用', '/development/use-with-nuxt'),
    ],
  },
  {
    text: '进阶使用',
    items: [
      plain('样式兼容', '/development/compatible-style'),
      plain('通用属性', '/development/common-props'),
    ],
  },
  {
    text: '迁移',
    items: [
      plain('从 v1 到 v2', '/development/migration-v2'),
    ],
  },
  {
    text: '其他',
    items: [
      plain('FAQ', '/development/faq'),
      plain('2.0 核对清单', '/development/release-checklist'),
    ],
  },
]

const markdownSidebar: DefaultTheme.SidebarItem[] = [
  plain('介绍', '/x-markdown/introduce'),
  plain('代码示例', '/x-markdown/examples'),
  plain('在线体验', '/x-markdown/playground'),
  plain('主题', '/x-markdown/themes'),
  plain('流式渲染', '/x-markdown/streaming'),
  {
    text: '组件',
    items: [
      plain('总览', '/x-markdown/components'),
      plain('对话 Think · Sources', '/x-markdown/chat-enhancement'),
      plain('Mermaid', '/x-markdown/data-display'),
      plain('高亮 Code', '/x-markdown/rich-text'),
    ],
  },
  {
    text: '插件集',
    items: [
      plain('总览', '/x-markdown/plugins'),
      plain('公式', '/x-markdown/plugin-latex'),
      plain('自定义插件', '/x-markdown/custom-plugin'),
    ],
  },
]

const sdkSidebar: DefaultTheme.SidebarItem[] = [
  plain('介绍', '/x-sdk/introduce'),
  {
    text: '数据流',
    items: [
      plain('总览', '/x-sdk/data-flow'),
      plain('useXChat 会话数据', '/x-sdk/use-x-chat'),
      plain('useXConversations 会话管理', '/x-sdk/use-x-conversations'),
    ],
  },
  {
    text: '数据提供',
    items: [
      plain('Chat Provider 数据提供', '/x-sdk/chat-provider'),
      plain('OpenAIChatProvider', '/x-sdk/chat-provider-openai'),
      plain('DeepSeekChatProvider', '/x-sdk/chat-provider-deepseek'),
      plain('Custom Chat Provider 自定义', '/x-sdk/chat-provider-custom'),
    ],
  },
  {
    text: '工具',
    items: [
      plain('XRequest 请求', '/x-sdk/x-request'),
      plain('XStream 流', '/x-sdk/x-stream'),
    ],
  },
]

const playgroundSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: '样板间',
    items: [
      plain('现代感', '/playground/ultramodern'),
      plain('独立式', '/playground/independent'),
      plain('助手式', '/playground/copilot'),
      plain('百宝箱', '/playground/agent-tbox'),
    ],
  },
]

export const sidebar: DefaultTheme.Sidebar = {
  '/design/': designSidebar,
  '/development/': developmentSidebar,
  '/component/': componentSidebar,
  '/x-markdown/': markdownSidebar,
  '/x-sdk/': sdkSidebar,
  '/playground/': playgroundSidebar,
}

export const reactDoc = react
