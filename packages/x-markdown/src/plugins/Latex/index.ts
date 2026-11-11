import katex, { type KatexOptions } from 'katex';
import type { TokenizerAndRendererExtension } from 'marked';

import 'katex/dist/katex.min.css';

const inlineDollarRule = /^(\${1,2})((?:\\.|[^\\$]){1,10000}?)\1/;
const inlineRuleNonStandard =
  /^(?:\\\(([\s\S]{1,10000}?)\\\)|\\\[((?:\\.|[^\\]){1,10000}?)\\\])/;
const blockRule =
  /^(\${1,2})\n([\s\S]{1,10000}?)\n\1(?:\s*(?:\n|$))|^\\\[((?:\\.|[^\\]){1,10000}?)\\\]/;

export type LatexOption = {
  katexOptions?: KatexOptions;
  replaceAlignStart?: boolean;
};

type Token = {
  text: string;
  displayMode: boolean;
  isBlock?: boolean;
};

type Render = (token: Token) => string;

type ILevel = 'inline' | 'block';

// fix katex not support align*: https://github.com/KaTeX/KaTeX/issues/1007
function replaceAlign(text: string) {
  return text ? text.replace(/\{align\*\}/g, '{aligned}') : text;
}

// Follow Pandoc's single-dollar delimiter rules to avoid parsing currency as math.
function isValidInlineDollarMatch(match: RegExpMatchArray, src: string) {
  const [, delimiter, text] = match;
  if (delimiter === '$$') return true;

  return !/^\s|\s$/.test(text) && !/^\d/.test(src.slice(match[0].length));
}

function createRenderer(options: KatexOptions, newlineAfter: boolean) {
  return (token: Token) =>
    katex.renderToString(token.text, {
      ...options,
      displayMode: token.displayMode,
    }) + (newlineAfter ? '\n' : '');
}

function inlineKatex(renderer: Render, replaceAlignStart: boolean) {
  return {
    name: 'inlineKatex',
    level: 'inline' as ILevel,
    start(src: string) {
      const dollarIndex = src.indexOf('$');
      const parenIndex = src.indexOf('\\(');
      const bracketIndex = src.indexOf('\\[');

      const indices = [dollarIndex, parenIndex, bracketIndex].filter(
        (idx) => idx !== -1,
      );
      return indices.length > 0 ? Math.min(...indices) : undefined;
    },
    tokenizer(src: string) {
      const dollarMatch = src.match(inlineDollarRule);
      if (dollarMatch && !isValidInlineDollarMatch(dollarMatch, src)) return;

      const nonStandardMatch = src.match(inlineRuleNonStandard);
      const match = dollarMatch || nonStandardMatch;
      if (!match) return;

      const rawText =
        dollarMatch?.[2] ||
        nonStandardMatch?.[1] ||
        nonStandardMatch?.[2] ||
        '';
      const text = replaceAlignStart
        ? replaceAlign(rawText.trim())
        : rawText.trim();

      const isBracketSyntax = nonStandardMatch?.[2] !== undefined;
      const hasNewline = rawText.includes('\n');

      return {
        type: 'inlineKatex',
        raw: match[0],
        text,
        displayMode: true,
        isBlock: isBracketSyntax && hasNewline,
      };
    },
    renderer: (token: Token) => {
      const html = renderer(token);
      if (token.isBlock) {
        return `<span class="block-katex">${html}</span>`;
      }
      return `<span class="inline-katex">${html}</span>`;
    },
  };
}

function blockKatex(renderer: Render, replaceAlignStart: boolean) {
  return {
    name: 'blockKatex',
    level: 'block' as ILevel,
    tokenizer(src: string) {
      const match = src.match(blockRule);
      if (match) {
        let text = replaceAlign(match[2] || match[3].trim());
        if (replaceAlignStart) {
          text = replaceAlign(text);
        }
        return {
          type: 'blockKatex',
          raw: match[0],
          text,
          displayMode: true,
        };
      }
    },
    renderer,
  };
}

/**
 * Latex plugin for rendering math expressions via KaTeX.
 *
 * Usage:
 * ```ts
 * import { XMarkdown, Latex } from '@ant-design-x-vue/x-markdown';
 * <XMarkdown :config="{ extensions: Latex() }" />
 * ```
 */
const Latex = (options?: LatexOption): TokenizerAndRendererExtension[] => {
  const { replaceAlignStart = true, katexOptions: customKatexOptions } =
    options || {};

  const katexOptions: KatexOptions = {
    output: 'html' as const,
    throwOnError: false,
    ...(customKatexOptions || {}),
  };

  const inlineRenderer = createRenderer(katexOptions, true);
  const blockRenderer = createRenderer(katexOptions, true);
  return [
    inlineKatex(inlineRenderer, replaceAlignStart),
    blockKatex(blockRenderer, replaceAlignStart),
  ];
};

/**
 * @deprecated prefer `Latex()` to match @ant-design/x-markdown API.
 */
export const createLatexPlugin = Latex;

export default Latex;
