export { default as version } from './version';
export { default, default as XMarkdown } from './XMarkdown';
export { default as AnimationText } from './XMarkdown/AnimationText.vue';
export { useStreaming } from './XMarkdown/hooks';
export { parseMarkdown, htmlToVNode } from './XMarkdown/core';
export type { HtmlToVNodeOptions } from './XMarkdown/core';
export type {
  ComponentProps,
  ComponentStreamStatus,
  DOMNode,
  MarkedConfig,
  StreamStatus,
  Token,
  Tokens,
  XMarkdownProps,
} from './XMarkdown/interface';
