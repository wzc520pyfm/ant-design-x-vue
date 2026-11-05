import { mergeToken } from '../../_util/cssinjs-utils';
import type { FullToken, GenerateStyle, GetDefaultToken } from '../../theme/cssinjs-utils';
import { genStyleHooks } from '../../theme/genStyleUtils';

export interface ComponentToken {
  /**
   * @desc 标题背景颜色
   * @descEN Title background color
   */
  colorBgTitle: string;
  /**
   * @desc 标题文本颜色
   * @descEN Title text color
   */
  colorTextTitle: string;
  /**
   * @desc 代码块边框颜色
   * @descEN Code block border color
   */
  colorBorderCode: string;
  /**
   * @desc 代码字体
   * @descEN Code font family (ant-design-vue AliasToken has no fontFamilyCode; mirror React seed)
   */
  fontFamilyCode: string;
}

export interface CodeHighlighterToken extends FullToken<'CodeHighlighter'> {}

const genCodeHighlighterStyle: GenerateStyle<CodeHighlighterToken> = (token) => {
  const { componentCls } = token;

  return {
    [componentCls]: {
      [`${componentCls}-header`]: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: token.colorText,
        background: token.colorFillContent,
        padding: token.paddingSM,
        borderStartStartRadius: token.borderRadius,
        borderStartEndRadius: token.borderRadius,
      },
      [`${componentCls}-header-title`]: {
        fontSize: token.fontSize,
        fontWeight: token.fontWeightStrong,
      },
      [`${componentCls}-code`]: {
        borderEndEndRadius: token.borderRadius,
        borderEndStartRadius: token.borderRadius,
        borderStartStartRadius: 0,
        borderStartEndRadius: 0,
        background: token.colorBgContainer,
        border: `1px solid ${token.colorBorderSecondary}`,
        borderTop: 'none',
        overflow: 'hidden',
        'pre,code': {
          whiteSpace: 'pre',
          fontSize: token.fontSize,
          fontFamily: token.fontFamilyCode,
          lineHeight: 2,
          borderRadius: 0,
          border: 'none',
        },
        "code[class*='language-'],pre[class*='language-']": {
          background: 'none',
        },
        // Prism one-light-ish token colors (scoped; no global Prism CSS needed)
        '& .token.comment, & .token.prolog, & .token.doctype, & .token.cdata': {
          color: '#a0a1a7',
        },
        '& .token.punctuation': {
          color: '#383a42',
        },
        '& .token.property, & .token.tag, & .token.boolean, & .token.number, & .token.constant, & .token.symbol, & .token.deleted': {
          color: '#986801',
        },
        '& .token.selector, & .token.attr-name, & .token.string, & .token.char, & .token.builtin, & .token.inserted': {
          color: '#50a14f',
        },
        '& .token.operator, & .token.entity, & .token.url, & .language-css .token.string, & .style .token.string': {
          color: '#0184bc',
        },
        '& .token.atrule, & .token.attr-value, & .token.keyword': {
          color: '#a626a4',
        },
        '& .token.function, & .token.class-name': {
          color: '#4078f2',
        },
        '& .token.regex, & .token.important, & .token.variable': {
          color: '#c18401',
        },
        pre: {
          minWidth: '100%',
          margin: 0,
          padding: token.paddingSM,
          overflow: 'auto',
          background: 'transparent',
        },
        code: {
          background: 'transparent',
          padding: 0,
        },
        [`${componentCls}-line-number`]: {
          display: 'inline-block',
          minWidth: '2.5em',
          marginInlineEnd: token.marginXS,
          textAlign: 'end',
          color: token.colorTextQuaternary,
          userSelect: 'none',
        },
      },
      [`&${componentCls}-rtl`]: {
        direction: 'rtl',
      },
    },
  };
};

export const prepareComponentToken: GetDefaultToken<'CodeHighlighter'> = (token) => ({
  colorBgTitle: token.colorFillContent,
  colorBorderCode: token.colorBorderSecondary,
  colorTextTitle: token.colorText,
  // ant-design-vue SeedToken lacks fontFamilyCode; keep React @ant-design/x seed parity
  fontFamilyCode: `'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace`,
});

export default genStyleHooks(
  'CodeHighlighter',
  (token) => {
    const codeHighlighterToken = mergeToken<CodeHighlighterToken>(token, {});
    return [genCodeHighlighterStyle(codeHighlighterToken)];
  },
  prepareComponentToken,
);
