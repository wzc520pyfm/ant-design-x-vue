import { Marked, type MarkedExtension, type Tokens } from 'marked';
import type { Token, Tokens as XTokens } from '../interface';

type ParserOptions = {
  markedConfig?: MarkedExtension;
  paragraphTag?: string;
  openLinksInNewTab?: boolean;
};

export const other = {
  escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,
  escapeTest: /[&<>"']/,
  notSpaceStart: /^\S*/,
  endingNewline: /\n$/,
  escapeReplace: /[&<>"']/g,
  escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,
  completeFencedCode: /^ {0,3}(`{3,}|~{3,})([\s\S]*?)\n {0,3}\1[ \n\t]*$/,
};

const escapeReplacements: { [index: string]: string } = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
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
 */
export class Parser {
  options: ParserOptions;
  markdownInstance: Marked;

  constructor(options: ParserOptions = {}) {
    const { markedConfig = {} } = options;
    this.options = options;
    this.markdownInstance = new Marked();

    this.configureLinkRenderer();
    this.configureParagraphRenderer();
    this.configureCodeRenderer();
    // user config at last
    this.markdownInstance.use(markedConfig as MarkedExtension);
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

  /**
   * Parse markdown content to HTML string.
   */
  parse(content: string): string {
    return this.markdownInstance.parse(content) as string;
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
