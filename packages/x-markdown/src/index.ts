export { default as version } from './version';
export { pluginMeta, type PluginMeta } from './plugins/version';
export { default, default as XMarkdown } from './XMarkdown';
export { default as AnimationText } from './XMarkdown/AnimationText.vue';
export {
  useStreaming,
  useTypewriter,
  StreamingProcessor,
  processStreamingMarkdown,
  DEFAULT_MIN_SECTION_CHARS,
  alignToGrapheme,
  alignToClusterFallback,
} from './XMarkdown/hooks';
export { Parser, parseMarkdown, htmlToVNode } from './XMarkdown/core';
export type { HtmlToVNodeOptions } from './XMarkdown/core';
export { resolveStreaming, resolveTailContent, DEFAULT_TAIL_CONTENT } from './XMarkdown/utils';
export { StreamCacheTokenType } from './XMarkdown/interface';
export type {
  AnimationConfig,
  ComponentProps,
  DefaultStyleTag,
  ComponentStreamStatus,
  DOMNode,
  MarkedConfig,
  StreamStatus,
  StreamingOption,
  TailConfig,
  Token,
  Tokens,
  TypewriterConfig,
  TypewriterOption,
  XMarkdownProps,
} from './XMarkdown/interface';
export type {
  StreamCache,
  StreamingConfig,
  StreamingResult,
  UseStreamingOptions,
  UseStreamingReturn,
  UseTypewriterOptions,
} from './XMarkdown/hooks';

// Plugins (also available via `@ant-design-x-vue/x-markdown/plugins/*` subpaths)
export { default as Latex } from './plugins/Latex';
export { default as HighlightCode } from './plugins/HighlightCode';
export { default as Mermaid } from './plugins/Mermaid';
