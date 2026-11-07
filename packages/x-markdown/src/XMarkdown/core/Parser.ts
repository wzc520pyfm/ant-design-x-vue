import { Marked, type MarkedExtension, type Token as MarkedToken, type Tokens } from 'marked';
import type { Component } from 'vue';
import type { Token, Tokens as XTokens } from '../interface';

type ParserOptions = {
  markedConfig?: MarkedExtension;
  paragraphTag?: string;
  openLinksInNewTab?: boolean;
  components?: Record<string, Component | string | unknown>;
  protectCustomTagNewlines?: boolean;
  disableCustomTagBlockMarkdown?: boolean;
  escapeRawHtml?: boolean;
};

type ParseOptions = {
  injectTail?: boolean;
};

/** Symbol to mark tokens for tail injection (avoids property name conflicts). */
const TAIL_MARKER = Symbol('tailMarker');

type MarkableToken = MarkedToken & { [TAIL_MARKER]?: boolean };

// Sentinel characters (Unicode Private Use Area) wrapping placeholders for
// protected newlines inside custom tags. Using PUA characters instead of `__`
// avoids the placeholder being interpreted as markdown syntax (e.g. `__bold__`).
const PLACEHOLDER_PREFIX = '\uE000X_MD_NL_';
const PLACEHOLDER_SUFFIX = '\uE001';
const PLACEHOLDER_REGEX = /\uE000X_MD_NL_\d+\uE001/g;

export const other = {
  escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,
  escapeTest: /[&<>"'/]/,
  notSpaceStart: /^\S*/,
  endingNewline: /\n$/,
  escapeReplace: /[&<>"'/]/g,
  escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,
  completeFencedCode: /^ {0,3}(`{3,}|~{3,})([\s\S]*?)\n {0,3}\1[ \n\t]*$/,
};

const escapeReplacements: { [index: string]: string } = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
};
const getEscapeReplacement = (ch: string) => escapeReplacements[ch];

export function escapeHtml(html: string, encode?: boolean) {
  if (encode) {
    if (other.escapeTest.test(html)) {
      return html.replace(other.escapeReplace, getEscapeReplacement);
    }
  } else {
    if (other.escapeTestNoEncode.test(html)) {
      return html.replace(other.escapeReplaceNoEncode, getEscapeReplacement);
    }
  }

  return html;
}

/**
 * Parser class aligned with React @ant-design/x-markdown.
 * Wraps a `Marked` instance and supports:
 * - `markedConfig`: user-supplied marked extension (e.g. Latex)
 * - `paragraphTag`: swap <p> for a custom tag
 * - `openLinksInNewTab`: force target="_blank" on anchors
 * - custom code renderer emitting `data-block` + `data-state` for streaming
 * - `escapeRawHtml` / `protectCustomTagNewlines` / `disableCustomTagBlockMarkdown`
 */
export class Parser {
  options: ParserOptions;
  markdownInstance: Marked;
  private injectTail = false;

  constructor(options: ParserOptions = {}) {
    const { markedConfig = {} } = options;
    this.options = options;
    this.markdownInstance = new Marked();

    this.configureLinkRenderer();
    this.configureParagraphRenderer();
    this.configureCodeRenderer();
    this.configureHtmlEscapeRenderer();
    this.configureTailInjection();
    // user config at last
    this.markdownInstance.use(markedConfig as MarkedExtension);
  }

  private configureHtmlEscapeRenderer() {
    if (!this.options.escapeRawHtml) return;

    const renderer = {
      html(this: any, token: Tokens.HTML | Tokens.Tag) {
        const { raw = '', text = '' } = token;
        return escapeHtml(raw || text, true);
      },
    };
    this.markdownInstance.use({ renderer });
  }

  private configureLinkRenderer() {
    if (!this.options.openLinksInNewTab) return;

    const renderer = {
      link(this: any, { href, title, tokens }: Tokens.Link) {
        const text = this.parser.parseInline(tokens);
        const titleAttr = title ? ` title="${title}"` : '';
        return `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer">${text}</a>`;
      },
    };
    this.markdownInstance.use({ renderer });
  }

  private configureParagraphRenderer() {
    const { paragraphTag } = this.options;
    if (!paragraphTag) return;

    const renderer = {
      paragraph(this: any, { tokens }: Tokens.Paragraph) {
        return `<${paragraphTag}>${this.parser.parseInline(tokens)}</${paragraphTag}>\n`;
      },
    };
    this.markdownInstance.use({ renderer });
  }

  private configureCodeRenderer() {
    const renderer = {
      code({ text, raw, lang, escaped, codeBlockStyle }: Tokens.Code): string {
        const langString = (lang || '').match(other.notSpaceStart)?.[0];
        const code = `${text.replace(other.endingNewline, '')}\n`;
        const isIndentedCode = codeBlockStyle === 'indented';
        const streamStatus =
          isIndentedCode || other.completeFencedCode.test(raw) ? 'done' : 'loading';
        const escapedCode = escaped ? code : escapeHtml(code, true);

        const classAttr = langString ? ` class="language-${escapeHtml(langString)}"` : '';

        return `<pre><code data-block="true" data-state="${streamStatus}"${classAttr}>${escapedCode}</code></pre>\n`;
      },
    };
    this.markdownInstance.use({ renderer });
  }

  private configureTailInjection() {
    const parser = this;
    this.markdownInstance.use({
      hooks: {
        processAllTokens(tokens) {
          if (!parser.injectTail) return tokens;

          const lastTextToken = parser.findLastTextToken(tokens as MarkedToken[]);
          if (lastTextToken) {
            (lastTextToken as MarkableToken)[TAIL_MARKER] = true;
          }
          return tokens;
        },
      },
      renderer: {
        text(this: any, token: Tokens.Text | Tokens.Escape) {
          const text =
            'tokens' in token && token.tokens
              ? this.parser.parseInline(token.tokens)
              : 'text' in token
                ? token.text
                : '';

          if ((token as MarkableToken)[TAIL_MARKER]) {
            return `${text}<xmd-tail></xmd-tail>`;
          }
          return text;
        },
      },
    });
  }

  private protectCustomTags(
    content: string,
    disableBlockMarkdown: boolean,
  ): {
    protected: string;
    placeholders: Map<string, string>;
  } {
    const placeholders = new Map<string, string>();
    const customTagNames = Object.keys(this.options.components || {});

    if (customTagNames.length === 0) {
      return { protected: content, placeholders };
    }

    let placeholderIndex = 0;
    const protectNewlines = (value: string) =>
      value.replace(/\n/g, () => {
        const ph = `${PLACEHOLDER_PREFIX}${placeholderIndex++}${PLACEHOLDER_SUFFIX}`;
        placeholders.set(ph, '\n');
        return ph;
      });
    const tagNamePattern = customTagNames
      .map((name) => name.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('|');

    const openTagRegex = new RegExp(`<(${tagNamePattern})(?:\\s[^>]*)?>`, 'gi');
    const closeTagRegex = new RegExp(`</(${tagNamePattern})>`, 'gi');

    const positions: Array<{
      index: number;
      type: 'open' | 'close';
      tagName: string;
      match: string;
    }> = [];

    let match = openTagRegex.exec(content);
    while (match !== null) {
      positions.push({
        index: match.index,
        type: 'open',
        tagName: match[1].toLowerCase(),
        match: match[0],
      });
      match = openTagRegex.exec(content);
    }

    closeTagRegex.lastIndex = 0;
    match = closeTagRegex.exec(content);
    while (match !== null) {
      positions.push({
        index: match.index,
        type: 'close',
        tagName: match[1].toLowerCase(),
        match: match[0],
      });
      match = closeTagRegex.exec(content);
    }

    positions.sort((a, b) => a.index - b.index);

    const stack: Array<{ tagName: string; start: number; openTag: string }> = [];
    const result: string[] = [];
    let lastIndex = 0;

    for (const pos of positions) {
      if (pos.type === 'open') {
        // Self-closing tags don't have inner content
        if (!pos.match.endsWith('/>')) {
          stack.push({ tagName: pos.tagName, start: pos.index, openTag: pos.match });
        }
      } else if (
        pos.type === 'close' &&
        stack.length > 0 &&
        stack[stack.length - 1].tagName === pos.tagName
      ) {
        const open = stack.pop()!;
        if (stack.length === 0) {
          const startPos = open.start;
          const endPos = pos.index + pos.match.length;
          const openTag = open.openTag;
          const closeTag = pos.match;
          const innerContent = content.slice(startPos + openTag.length, pos.index);

          if (lastIndex < startPos) {
            result.push(content.slice(lastIndex, startPos));
          }

          if (disableBlockMarkdown && innerContent.includes('\n')) {
            // Neutralize block-level markdown boundaries inside custom tags
            // while still allowing inline markdown to be parsed later.
            const protectedInner = protectNewlines(innerContent);
            result.push(openTag + protectedInner + closeTag);
          } else if (innerContent.includes('\n\n')) {
            // Preserve the original behavior of only protecting blank-line
            // paragraph breaks so existing block markdown inside custom tags
            // keeps rendering unless the stronger flag is enabled.
            const protectedInner = innerContent.replace(/\n{2,}/g, (newlines) =>
              protectNewlines(newlines),
            );
            result.push(openTag + protectedInner + closeTag);
          } else {
            result.push(openTag + innerContent + closeTag);
          }

          lastIndex = endPos;
        }
      }
    }

    if (lastIndex < content.length) {
      result.push(content.slice(lastIndex));
    }

    return { protected: result.join(''), placeholders };
  }

  private restorePlaceholders(content: string, placeholders: Map<string, string>): string {
    if (placeholders.size === 0) {
      return content;
    }
    return content.replace(PLACEHOLDER_REGEX, (match) => placeholders.get(match) ?? match);
  }

  private findLastTextToken(tokens: MarkedToken[]): MarkedToken | null {
    for (let i = tokens.length - 1; i >= 0; i--) {
      const token = tokens[i];
      if (!token) continue;
      if (token.type === 'text') return token;
      if ('tokens' in token && Array.isArray((token as any).tokens)) {
        const nested = this.findLastTextToken((token as any).tokens);
        if (nested) return nested;
      }
      if ('items' in token && Array.isArray((token as any).items)) {
        for (let j = (token as any).items.length - 1; j >= 0; j--) {
          const item = (token as any).items[j];
          if (item?.tokens) {
            const nested = this.findLastTextToken(item.tokens);
            if (nested) return nested;
          }
        }
      }
    }
    return null;
  }

  /**
   * Parse markdown content to HTML string.
   * Pass `{ injectTail: true }` to append `<xmd-tail></xmd-tail>` after the last text token.
   */
  parse(content: string, parseOptions?: ParseOptions): string {
    this.injectTail = parseOptions?.injectTail ?? false;
    try {
      if (this.options.protectCustomTagNewlines || this.options.disableCustomTagBlockMarkdown) {
        const { protected: protectedContent, placeholders } = this.protectCustomTags(
          content,
          !!this.options.disableCustomTagBlockMarkdown,
        );
        const parsed = this.markdownInstance.parse(protectedContent) as string;
        return this.restorePlaceholders(parsed, placeholders);
      }
      return this.markdownInstance.parse(content) as string;
    } finally {
      this.injectTail = false;
    }
  }

  /**
   * Parse markdown content to tokens (used for streaming incremental buffer).
   */
  lex(content: string): XTokens {
    return this.markdownInstance.lexer(content) as XTokens;
  }
}

/**
 * Convenience helper used by callers that do not need the full Parser pipeline.
 */
export function parseMarkdown(markdown: string, config?: MarkedExtension): string {
  return new Parser({ markedConfig: config }).parse(markdown);
}

export default Parser;

export type { Token, XTokens as Tokens };
