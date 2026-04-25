import type { Config as DOMPurifyConfig } from 'dompurify';
import type { MarkedExtension, Tokens as MarkedTokens } from 'marked';
import type { Component, CSSProperties, VNode } from 'vue';

/** Stream status for useStreaming hook */
export type StreamStatus = 'idle' | 'streaming' | 'complete' | 'error';

/**
 * Stream status passed to custom components (align with @ant-design/x-markdown)
 * - loading: content for this block is still being streamed
 * - done: block is complete
 */
export type ComponentStreamStatus = 'loading' | 'done';

export interface Token {
  type: string;
  raw: string;
  text?: string;
  tokens?: Token[];
  [key: string]: any;
}

export type Tokens = Token[];

/**
 * DOM node info from HTML parser (align with html-react-parser DOMNode)
 * Used when mapping HTML elements to custom Vue components
 */
export interface DOMNode {
  type: string;
  name?: string;
  attribs?: Record<string, string>;
  children?: DOMNode[];
  data?: string;
  [key: string]: any;
}

/**
 * Props passed to custom components in XMarkdown (align with React ComponentProps)
 */
export interface ComponentProps {
  /**
   * Parsed DOM node info (tag name, attributes, children structure)
   */
  domNode?: DOMNode;
  /**
   * 'loading' = block still streaming, 'done' = block complete
   */
  streamStatus?: ComponentStreamStatus;
  /**
   * Child content (VNodes or text)
   */
  children?: VNode[] | string;
  /**
   * Rest: HTML attributes (href, title, class, etc.) and custom data attributes
   */
  [key: string]: any;
}

/**
 * Marked parse configuration – accepts any marked extension (renderer, tokenizer,
 * extensions) or a combined object produced by plugin factories (e.g. `Latex()`).
 */
export type MarkedConfig = MarkedExtension | { extensions: MarkedTokens.Generic[] } | Record<string, any>;

export interface AnimationConfig {
  /**
   * The duration of the fade-in animation in milliseconds.
   * @default 200
   */
  fadeDuration?: number;
  /**
   * Easing function for the animation.
   * @default 'ease-in-out'
   */
  easing?: string;
}

export enum StreamCacheTokenType {
  Text = 'text',
  Link = 'link',
  Image = 'image',
  Html = 'html',
  Emphasis = 'emphasis',
  List = 'list',
  Table = 'table',
}

export interface StreamingOption {
  /**
   * When false, flushes all cached content and completes rendering.
   * @default false
   */
  hasNextChunk?: boolean;
  /**
   * Enables text fade-in animation for block elements (p, li, h1–h4).
   * @default false
   */
  enableAnimation?: boolean;
  /**
   * Configuration for text appearance animation effects.
   */
  animationConfig?: AnimationConfig;
  /**
   * Mapping configuration to convert incomplete Markdown formats to custom
   * loading components for unclosed links / images during streaming rendering.
   */
  incompleteMarkdownComponentMap?: Partial<
    Record<Exclude<StreamCacheTokenType, StreamCacheTokenType.Text>, string>
  >;
}

export interface XMarkdownProps {
  /**
   * Markdown content to render.
   */
  content?: string;

  /**
   * Alias for `content`.
   */
  children?: string;

  /**
   * Whether content is being streamed. Passes `'loading' | 'done'` to custom
   * components. Accepts a boolean or a StreamingOption object (aligned with
   * @ant-design/x-markdown).
   */
  streaming?: boolean | StreamingOption;

  /**
   * Map HTML/custom tag names to Vue components (e.g. h1, pre, code, mermaid, think).
   */
  components?: Record<string, Component>;

  /**
   * Plugins – legacy hook (transform) shape, still supported for back-compat.
   * Prefer `config` with marked extensions.
   */
  plugins?: any[];

  /**
   * Marked parse configuration / extension.
   */
  config?: MarkedConfig;

  /**
   * Root class name.
   */
  className?: string;

  /**
   * Alias of `className`, matching React's `rootClassName`.
   */
  rootClassName?: string;

  /**
   * Inline style for root container.
   */
  style?: CSSProperties;

  /**
   * CSS class prefix override.
   */
  prefixCls?: string;

  /**
   * Custom paragraph tag (e.g. 'div') to avoid invalid nesting.
   * @default 'p'
   */
  paragraphTag?: string;

  /**
   * Add target="_blank" + rel="noopener noreferrer" on anchors.
   * @default false
   */
  openLinksInNewTab?: boolean;

  /**
   * DOMPurify sanitize configuration.
   */
  dompurifyConfig?: DOMPurifyConfig;
}
