import type { DefaultTheme } from 'vitepress'

function link(text: string, href: string, activeMatch?: string): DefaultTheme.NavItemWithLink {
  return { text, link: href, activeMatch }
}

function plain(text: string, href: string): DefaultTheme.SidebarItem {
  return { text, link: href }
}

export const nav: DefaultTheme.NavItem[] = [
  link('Design', '/design/introduce', '/design/'),
  link('Development', '/development/introduce', '/development/'),
  link('Components', '/component/overview', '/component/'),
  link('X Markdown', '/x-markdown/introduce', '/x-markdown/'),
  link('X SDK', '/x-sdk/introduce', '/x-sdk/'),
  link('X Card', '/x-card/introduce', '/x-card/'),
  link('X Skill', '/x-skill/introduce', '/x-skill/'),
  link('Playground', '/playground/ultramodern', '/playground/'),
]

const componentSidebar: DefaultTheme.SidebarItem[] = [
  plain('Introduction', '/component/introduce'),
  plain('Overview', '/component/overview'),
  {
    text: 'General',
    items: [
      plain('Bubble', '/component/bubble'),
      plain('Conversations', '/component/conversations'),
      plain('Notification', '/component/notification'),
    ],
  },
  {
    text: 'Wake',
    items: [
      plain('Welcome', '/component/welcome'),
      plain('Prompts', '/component/prompts'),
    ],
  },
  {
    text: 'Express',
    items: [
      plain('Attachments', '/component/attachments'),
      plain('Sender', '/component/sender'),
      plain('Suggestion', '/component/suggestion'),
    ],
  },
  {
    text: 'Confirm',
    items: [
      plain('Think', '/component/think'),
      plain('ThoughtChain', '/component/thought-chain'),
      plain('Sources', '/component/sources'),
    ],
  },
  {
    text: 'Feedback',
    items: [
      plain('Actions', '/component/actions'),
      plain('FileCard', '/component/file-card'),
      plain('CodeHighlighter', '/component/code-highlighter'),
      plain('Mermaid', '/component/mermaid'),
      plain('Folder', '/component/folder'),
    ],
  },
  {
    text: 'Other',
    items: [
      plain('XProvider', '/component/x-provider'),
    ],
  },
]

const designSidebar: DefaultTheme.SidebarItem[] = [
  plain('RICH design paradigm', '/design/introduce'),
  {
    text: '🎭 Role design',
    items: [
      plain('Introduction', '/design/role-design'),
      plain('Authentic and consistent', '/design/authentic-consistent'),
      plain('Smooth and natural', '/design/smooth-natural'),
      plain('Human touch', '/design/human-touch'),
    ],
  },
  {
    text: '❤️ Intention design',
    items: [
      plain('Introduction', '/design/intention-introduce'),
      plain('Define intention types', '/design/define-intention-type'),
      plain('Provide intention expectations', '/design/provide-intention-expectation'),
      plain('Guide intention expression', '/design/guide-intention-expression'),
    ],
  },
  {
    text: '💭 Conversation design',
    items: [
      plain('Introduction', '/design/conversation-design'),
      plain('Start', '/design/start'),
      plain('Follow-up', '/design/follow-up'),
      plain('Hint', '/design/hint'),
      plain('Confirm', '/design/confirm'),
      plain('Error', '/design/error'),
      plain('End', '/design/end'),
    ],
  },
  {
    text: '💻 Hybrid UI design',
    items: [
      plain('Introduction', '/design/hybrid-ui-design'),
      plain('Wake · AI mark', '/design/wake-up-ai-icon'),
      plain('Wake · Welcome message', '/design/wake-up-welcome-message'),
      plain('Express · User input', '/design/expression-user-input'),
      plain('Express · User send', '/design/expression-user-send'),
      plain('Confirm · Generation process', '/design/confirm-generation-process'),
      plain('Feedback · Apply results', '/design/feedback-result-application'),
      plain('Feedback · Display results', '/design/feedback-result-display'),
    ],
  },
]

const developmentSidebar: DefaultTheme.SidebarItem[] = [
  plain('Ant Design X', '/development/introduce'),
  {
    text: 'Model integration',
    items: [
      plain('OpenAI', '/development/model-openai'),
      plain('Qwen', '/development/model-qwen'),
    ],
  },
  {
    text: 'Agent integration',
    items: [
      plain('Tbox', '/development/agent-tbox'),
    ],
  },
  {
    text: 'How to use',
    items: [
      plain('Use with Vite', '/development/use-with-vite'),
      plain('Use with Nuxt', '/development/use-with-nuxt'),
    ],
  },
  {
    text: 'Advanced',
    items: [
      plain('Compatible style', '/development/compatible-style'),
      plain('Common props', '/development/common-props'),
    ],
  },
  {
    text: 'Migration',
    items: [
      plain('From v1 to v2', '/development/migration-v2'),
    ],
  },
  {
    text: 'Other',
    items: [
      plain('FAQ', '/development/faq'),
      plain('2.10 checklist', '/development/release-checklist'),
    ],
  },
]

const markdownSidebar: DefaultTheme.SidebarItem[] = [
  plain('Introduction', '/x-markdown/introduce'),
  plain('Examples', '/x-markdown/examples'),
  plain('Playground', '/x-markdown/playground'),
  plain('Themes', '/x-markdown/themes'),
  plain('Streaming', '/x-markdown/streaming'),
  {
    text: 'Components',
    items: [
      plain('Overview', '/x-markdown/components'),
      plain('Chat Think · Sources · ThoughtChain', '/x-markdown/chat-enhancement'),
      plain('Mermaid · GPT-VIS', '/x-markdown/data-display'),
      plain('Highlight Code', '/x-markdown/rich-text'),
    ],
  },
  {
    text: 'Plugins',
    items: [
      plain('Overview', '/x-markdown/plugins'),
      plain('LaTeX', '/x-markdown/plugin-latex'),
      plain('Custom plugin', '/x-markdown/custom-plugin'),
      plain('Theme and locale', '/x-markdown/plugin-theme-locale'),
    ],
  },
]

const sdkSidebar: DefaultTheme.SidebarItem[] = [
  plain('Introduction', '/x-sdk/introduce'),
  {
    text: 'Data flow',
    items: [
      plain('Overview', '/x-sdk/data-flow'),
      plain('useXChat', '/x-sdk/use-x-chat'),
      plain('useXConversations', '/x-sdk/use-x-conversations'),
    ],
  },
  {
    text: 'Providers',
    items: [
      plain('Chat Provider', '/x-sdk/chat-provider'),
      plain('OpenAIChatProvider', '/x-sdk/chat-provider-openai'),
      plain('DeepSeekChatProvider', '/x-sdk/chat-provider-deepseek'),
      plain('Custom Chat Provider', '/x-sdk/chat-provider-custom'),
    ],
  },
  {
    text: 'Utilities',
    items: [
      plain('XRequest', '/x-sdk/x-request'),
      plain('XStream', '/x-sdk/x-stream'),
    ],
  },
]

const playgroundSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: 'Playground',
    items: [
      plain('Ultramodern', '/playground/ultramodern'),
      plain('Independent', '/playground/independent'),
      plain('Copilot', '/playground/copilot'),
      plain('Tbox', '/playground/agent-tbox'),
    ],
  },
]

const cardSidebar: DefaultTheme.SidebarItem[] = [
  plain('Introduction', '/x-card/introduce'),
  plain('A2UI v0.8', '/x-card/a2ui-v-0-8'),
  plain('A2UI v0.9', '/x-card/a2ui-v-0-9'),
]

const skillSidebar: DefaultTheme.SidebarItem[] = [
  plain('Introduction', '/x-skill/introduce'),
  plain('Prompt Templates', '/x-skill/prompt'),
  plain('Skills List', '/x-skill/skills'),
]

export const sidebar: DefaultTheme.Sidebar = {
  '/en/design/': { base: '/en', items: designSidebar },
  '/en/development/': { base: '/en', items: developmentSidebar },
  '/en/component/': { base: '/en', items: componentSidebar },
  '/en/x-markdown/': { base: '/en', items: markdownSidebar },
  '/en/x-sdk/': { base: '/en', items: sdkSidebar },
  '/en/x-card/': { base: '/en', items: cardSidebar },
  '/en/x-skill/': { base: '/en', items: skillSidebar },
  '/en/playground/': { base: '/en', items: playgroundSidebar },
}
