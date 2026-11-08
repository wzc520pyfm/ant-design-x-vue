import type { CSSObject } from '../../_util/cssinjs';
import { unit } from '../../_util/cssinjs';
import type { GenerateStyle } from '../../theme/cssinjs-utils';
import type { ThoughtChainToken } from '.';

const genThoughtChainItemStyle: GenerateStyle<ThoughtChainToken> = (
  token: ThoughtChainToken,
): CSSObject => {
  const { componentCls, calc } = token;
  const itemCls = `${componentCls}-item`;
  return {
    [componentCls]: {
      [`& ${componentCls}-status`]: {
        color: 'inherit',
      },
      [`& ${componentCls}-status-error`]: {
        color: token.colorError,
      },
      [`& ${componentCls}-status-success`]: {
        color: token.colorSuccess,
      },
      [`& ${componentCls}-status-loading`]: {
        color: token.colorPrimary,
      },
    },
    [itemCls]: {
      display: 'inline-flex',
      // Stay a compact chip: sibling Flex (wrap) rows must wrap the whole chip
      // instead of compressing it, which would push a long URL description
      // under the title.
      flexShrink: 0,
      gap: unit(calc(token.marginXXS).add(1).equal()),
      whiteSpace: 'normal',
      wordBreak: 'break-word',
      fontSize: token.fontSize,
      color: token.colorText,
      paddingBlock: unit(calc(token.paddingXXS).add(1).equal()),
      paddingInline: token.paddingSM,
      boxSizing: 'border-box',
      lineHeight: token.lineHeight,
      borderRadius: token.itemBorderRadius,
      alignItems: 'baseline',
      [`&${itemCls}-rtl`]: {
        direction: 'rtl',
      },
      [`&${itemCls}-disabled`]: {
        cursor: 'not-allowed',
        opacity: 0.45,
      },
      [`&${itemCls}-disabled:not(${itemCls}-error)`]: {
        color: token.colorTextDisabled,
        [`& ${itemCls}-description`]: {
          color: token.colorTextDescription,
        },
        [`& ${componentCls}-status-success`]: {
          color: token.colorTextDisabled,
        },
        [`& ${componentCls}-status-loading`]: {
          color: token.colorTextDisabled,
        },
      },
      [`&${itemCls}-solid`]: {
        background: token.itemSolidBg,
        [`&${itemCls}-disabled`]: {
          background: token.colorBgContainerDisabled,
        },
        [`&${itemCls}-click:hover`]: {
          background: token.itemSolidHoverBg,
          [`&${itemCls}-error:hover`]: {
            color: token.colorError,
            background: token.colorErrorBgHover,
          },
        },
        [`&${itemCls}-error:not(${itemCls}-disabled)`]: {
          color: token.colorError,
          background: token.colorErrorBg,
        },
        [`&${itemCls}-error:where(${itemCls}-disabled)`]: {
          background: token.colorErrorBg,
        },
      },
      [`&${itemCls}-outlined`]: {
        paddingBlock: token.paddingXXS,
        backgroundColor: token.itemOutlinedBg,
        border: `${unit(token.lineWidth)} ${token.lineType} ${token.colorBorder}`,

        [`&${itemCls}-click:hover`]: {
          background: token.itemOutlinedHoverBg,
          [`&${itemCls}-error:hover`]: {
            color: token.colorError,
            background: token.colorErrorBgHover,
          },
        },
        [`&${itemCls}-error:not(${itemCls}-disabled)`]: {
          color: token.colorError,
          border: `${unit(token.lineWidth)} ${token.lineType} ${token.colorErrorBorder}`,
          background: token.colorErrorBg,
        },
        [`&${itemCls}-error:where(${itemCls}-disabled)`]: {
          border: `${unit(token.lineWidth)} ${token.lineType} ${token.colorErrorBorder}`,
          background: token.colorErrorBg,
        },
      },
      [`&${itemCls}-text`]: {
        [`&${itemCls}-click:hover`]: {
          background: token.itemSolidHoverBg,
          [`&${itemCls}-error:hover`]: {
            color: token.colorError,
            background: token.colorErrorBgHover,
          },
        },
        [`&${itemCls}-error`]: {
          [`&:not(${itemCls}-disabled)`]: {
            color: token.colorErrorText,
          },
          [`&:where(${itemCls}-disabled)`]: {
            color: token.colorTextDisabled,
          },
        },
      },
      [`&${itemCls}-click`]: {
        transition: `all ${token.motionDurationMid} ${token.motionEaseInOut}`,
      },
      [`&${itemCls}-click:not(${itemCls}-disabled)`]: {
        cursor: 'pointer',
      },
      [`& ${itemCls}-title`]: {
        display: 'inline-block',
        whiteSpace: 'nowrap',
      },
      [`& ${itemCls}-title-with-description`]: {
        marginInlineEnd: token.marginXS,
      },
      [`& ${itemCls}-description`]: {
        color: token.colorTextDescription,
        display: 'inline-block',
        whiteSpace: 'break-spaces',
      },
      [`& ${componentCls}-motion-blink`]: {
        [`& ${itemCls}-description`]: {
          color: token.itemMotionDescription,
        },
      },
    },
  };
};

export default genThoughtChainItemStyle;
