import type { XMarkdownPlugin } from '../type';

export interface HighlightCodeOptions {
  /**
   * Theme for code highlighting
   */
  theme?: 'light' | 'dark' | string;

  /**
   * Languages to support
   */
  languages?: string[];
}

/**
 * HighlightCode plugin for syntax highlighting in code blocks
 * TODO: Implement full functionality with react-syntax-highlighter equivalent
 */
export function createHighlightCodePlugin(
  options: HighlightCodeOptions = {}
): XMarkdownPlugin {
  return {
    name: 'highlight-code',
    languages: options.languages || ['javascript', 'typescript', 'python', 'css', 'html'],
    transform: (content: string) => {
      // TODO: Implement syntax highlighting
      return content;
    },
  };
}

export default createHighlightCodePlugin;
