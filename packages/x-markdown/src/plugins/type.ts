import type { Component } from 'vue';

export interface XMarkdownPlugin {
  /**
   * Plugin name
   */
  name: string;
  
  /**
   * Custom component to render specific code blocks or elements
   */
  component?: Component;
  
  /**
   * Languages this plugin handles (for code blocks)
   */
  languages?: string[];
  
  /**
   * Transform function for processing content
   */
  transform?: (content: string) => string;
}
