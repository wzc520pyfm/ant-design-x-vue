import { marked } from 'marked';
import type { Token, Tokens } from '../interface';
import type { MarkedConfig } from '../interface';

/**
 * Parse markdown string to tokens
 */
export class Parser {
  parse(markdown: string): Tokens {
    return marked.lexer(markdown) as Tokens;
  }
}

/**
 * Parse markdown string to HTML (align with @ant-design/x-markdown config)
 */
export function parseMarkdown(markdown: string, config?: MarkedConfig): string {
  const opts = { async: false, ...config };
  return marked.parse(markdown, opts) as string;
}

export default Parser;
