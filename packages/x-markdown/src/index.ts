export { default as version } from './version';
export { pluginMeta, type PluginMeta } from './plugins/version';
export { default, default as XMarkdown } from './XMarkdown';
export { default as AnimationText } from './XMarkdown/AnimationText.vue';
export { useStreaming } from './XMarkdown/hooks';
export { Parser, parseMarkdown, htmlToVNode } from './XMarkdown/core';
export type { HtmlToVNodeOptions } from './XMarkdown/core';
export type {
  AnimationConfig,
  ComponentProps,
  ComponentStreamStatus,
  DOMNode,
  MarkedConfig,
  StreamCacheTokenType,
  StreamStatus,
  StreamingOption,
  Token,
  Tokens,
  XMarkdownProps,
} from './XMarkdown/interface';

// Plugins (also available via `@ant-design-x-vue/x-markdown/plugins/*` subpaths)
export { default as Latex } from './plugins/Latex';
export { default as HighlightCode } from './plugins/HighlightCode';
export { default as Mermaid } from './plugins/Mermaid';
