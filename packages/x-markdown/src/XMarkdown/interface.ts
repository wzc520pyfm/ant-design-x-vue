import type { Component } from 'vue';
import type { VNode } from 'vue';

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
 * Marked parse options (align with @ant-design/x-markdown config)
 */
export type MarkedConfig = Record<string, any>;

export interface XMarkdownProps {
  /**
   * Markdown content to render
   */
  content?: string;

  /**
   * Whether content is being streamed (custom components receive streamStatus)
   */
  streaming?: boolean;

  /**
   * Map HTML/custom tag names to Vue components (e.g. h1, pre, code, mermaid, think)
   */
  components?: Record<string, Component>;

  /**
   * Plugins to extend functionality (transform content before parse)
   */
  plugins?: any[];

  /**
   * Marked parse configuration
   */
  config?: MarkedConfig;

  /**
   * Class name for the root element
   */
  className?: string;
}
