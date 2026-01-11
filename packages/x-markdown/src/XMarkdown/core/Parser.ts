import { marked } from 'marked';
import type { Token, Tokens } from '../interface';

/**
 * Parse markdown string to tokens
 */
export class Parser {
  parse(markdown: string): Tokens {
    return marked.lexer(markdown) as Tokens;
  }
}

/**
 * Parse markdown string to HTML
 */
export function parseMarkdown(markdown: string): string {
  return marked.parse(markdown, { async: false }) as string;
}

export default Parser;
