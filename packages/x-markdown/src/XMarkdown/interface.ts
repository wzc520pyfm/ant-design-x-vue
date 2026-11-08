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
  /**
   * Unit of the fade-in. `chunk` fades each newly arrived piece; `sentence`
   * merges into the current sentence until a delimiter. Prefer `sentence`
   * together with `typewriter`.
   * @default 'chunk'
   */
  splitBy?: 'chunk' | 'sentence';
  /**
   * Sentence delimiters when `splitBy` is `sentence`.
   * @default ['。', '！', '？', '.', '!', '?', '\n']
   */
  delimiters?: string[];
  /**
   * Max characters one fade-in unit holds when `splitBy` is `sentence`.
   * @default 120
   */
  maxSentenceChars?: number;
}

/**
 * Typewriter pacing config (align with @ant-design/x-markdown 2.10).
 */
export interface TypewriterConfig {
  /**
   * Reveal unit. `char` reveals character by character; `sentence` reveals up
   * to the next delimiter (delimiters inside fenced/inline code do not count;
   * a newline always does).
   * @default 'char'
   */
  unit?: 'char' | 'sentence';
  /**
   * Sentence delimiters.
   * @default ['。', '！', '？', '.', '!', '?', '\n']
   */
  delimiters?: string[];
  /**
   * Minimum reveal speed in characters per second.
   * @default 24
   */
  minCps?: number;
  /**
   * Maximum reveal speed in characters per second.
   * @default 3000
   */
  maxCps?: number;
  /**
   * With `unit: 'char'`, pause after revealing a delimiter (ms).
   * @default 0
   */
  pauseMs?: number;
  /**
   * With `unit: 'sentence'`, longest run since the previous delimiter held
   * back before falling back to character reveal.
   * @default 120
   */
  maxSentenceChars?: number;
}

/** @deprecated Alias kept for callers that import TypewriterOption */
export type TypewriterOption = TypewriterConfig;

export enum StreamCacheTokenType {
  Text = 'text',
  Link = 'link',
  Image = 'image',
  Html = 'html',
  Emphasis = 'emphasis',
  List = 'list',
  Table = 'table',
  InlineCode = 'inline-code',
}

export interface TailConfig {
  /**
   * Tail content to display.
   * @default '▋'
   */
  content?: string;
  /**
   * Custom tail component; takes precedence over `content`.
   */
  component?: Component;
}

export interface StreamingOption {
  /**
   * When false, flushes all cached content and completes rendering.
   * @default false
   */
  hasNextChunk?: boolean;
  /**
   * Split the document into sections at headings while streaming so only the
   * last growing section is re-parsed/rendered per chunk. Pass an object to
   * tune `minSectionChars` / `keepSectionsOnEnd`.
   * @default false
   */
  incremental?: boolean | { minSectionChars?: number; keepSectionsOnEnd?: boolean };
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
   * Enable tail cursor. `true` uses default `▋`; object customizes content/component.
   * @default false
   */
  tail?: boolean | TailConfig;
  /**
   * Mapping of incomplete Markdown tokens to custom loading component names.
   */
  incompleteMarkdownComponentMap?: Partial<
    Record<
      Exclude<(typeof StreamCacheTokenType)[keyof typeof StreamCacheTokenType], 'text'>,
      string
    >
  >;
  /**
   * How unfinished Markdown syntax is shown.
   * - `placeholder`: hold back or show incompleteMarkdownComponentMap placeholder
   * - `complete`: show half-written emphasis / inline code / link text / list items as finished text
   * @default 'placeholder'
   */
  incompleteMarkdown?: 'placeholder' | 'complete';
  /**
   * Typewriter effect: reveal newly arrived content at a steady pace.
   * @default false
   */
  typewriter?: boolean | TypewriterConfig;
}

export type DefaultStyleTag =
  | 'p'
  | 'ul'
  | 'ol'
  | 'li'
  | 'pre'
  | 'code'
  | 'table'
  | 'th'
  | 'td'
  | 'img'
  | 'hr';

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
   * Streaming configuration. A boolean enables the 2.10 preset:
   * `true` → `hasNextChunk: true` + `incremental` + `incompleteMarkdown: 'complete'` + `typewriter`;
   * `false` → stream ended / final render. Pass an object for per-option control.
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

  /**
   * Extra props passed to custom components in `components` by tag name.
   * Keeps component references stable and avoids remounts from inline wrappers.
   */
  componentsProps?: {
    [tagName: string]: Record<string, unknown>;
  };

  /**
   * Protect blank-line paragraph breaks inside custom tags.
   * @default false
   */
  protectCustomTagNewlines?: boolean;

  /**
   * Disable block-level Markdown parsing inside custom tags (lists, headings,
   * blockquotes). Inline Markdown still works.
   * @default false
   */
  disableCustomTagBlockMarkdown?: boolean;

  /**
   * Escape raw HTML in Markdown as plain text (do not parse as real HTML).
   * @default false
   */
  escapeRawHtml?: boolean;

  /**
   * Enable the debug performance overlay.
   * @default false
   */
  debug?: boolean;

  /**
   * Disable built-in default styles for tags. Pass `true` to disable all, or
   * an array to disable specific tags (e.g. `['ul', 'ol', 'li']`).
   * @default false
   */
  disableDefaultStyles?: boolean | DefaultStyleTag[];
}
