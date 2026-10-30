import type { GenerateStyle } from '../../theme/cssinjs-utils';
import type { BubbleToken } from '.';

export const genSlotStyle: GenerateStyle<BubbleToken> = (token) => {
  const { componentCls, fontSize, lineHeight, paddingXXS, margin, colorText, fontSizeLG, calc } =
    token;
  return {
    [componentCls]: {
      // ======================== Header & Footer ========================
      [`& ${componentCls}-header`]: {
        display: 'flex',
        marginBottom: paddingXXS,
        fontSize: fontSize,
        lineHeight: lineHeight,
        color: colorText,
      },

      [`& ${componentCls}-footer`]: {
        display: 'flex',
        alignItems: 'center',
        marginBlockStart: margin,
        fontSize: fontSize,
        lineHeight: lineHeight,
        color: colorText,
        // String content sets white-space:pre-wrap. An inner footer is inside
        // that box, so preserved newlines stack the toolbar into a thin column
        // and the icons disappear. The footer is a flex row, not preformatted text.
        whiteSpace: 'normal',

        '&-start': {
          flexDirection: 'row',
        },

        '&-end': {
          flexDirection: 'row-reverse',
        },

        // Docs reset `svg { display:block }`. Inside a shrinking footer that
        // beats `.anticon svg { display:inline-block }` and collapses the glyph.
        '.anticon': {
          flexShrink: 0,
        },
        '.anticon svg': {
          display: 'inline-block',
          width: '1em',
          height: '1em',
          maxWidth: 'none',
          flexShrink: 0,
        },
      },

      // ======================== Sider ========================
      '&-avatar': {
        minWidth: calc(fontSizeLG).mul(2).equal(),
      },

      '&-extra': {},
    },
  };
};
