import type { Component } from 'vue';

export type StreamStatus = 'idle' | 'streaming' | 'complete' | 'error';

export interface Token {
  type: string;
  raw: string;
  text?: string;
  tokens?: Token[];
  [key: string]: any;
}

export type Tokens = Token[];

export interface ComponentProps {
  [key: string]: any;
}

export interface XMarkdownProps {
  /**
   * Markdown content to render
   */
  content?: string;
  
  /**
   * Whether content is being streamed
   */
  streaming?: boolean;
  
  /**
   * Custom components for rendering specific elements
   */
  components?: Record<string, Component>;
  
  /**
   * Plugins to extend functionality
   */
  plugins?: any[];
  
  /**
   * Class name for the root element
   */
  className?: string;
}
