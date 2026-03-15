import { type CSSObject, unit } from '../../_util/cssinjs';
import { mergeToken } from '../../_util/cssinjs-utils';
import { FastColor } from '@ant-design/fast-color';
import { genCollapseMotion } from '../../style';
import { blink } from '../../style/motion/blink';
import type { FullToken, GenerateStyle, GetDefaultToken } from '../../theme/cssinjs-utils';
import { genStyleHooks } from '../../theme/genStyleUtils';
import genThoughtChainItemStyle from './item';
import { genTransitionCollapseStyle } from '../../transition-collapse';

export interface ComponentToken {
  itemSolidBg: string;
  itemSolidHoverBg: string;
  itemOutlinedBg: string;
  itemOutlinedHoverBg: string;
  itemBorderRadius: number;
  iconSize: number;
  itemMotionDescription: string;
  colorTextBlinkDefault: string;
  colorTextBlink: string;
}

export interface ThoughtChainToken extends FullToken<'ThoughtChain'> {}

const genThoughtChainStyle: GenerateStyle<ThoughtChainToken, CSSObject> = (token): CSSObject => {
  const { componentCls, calc } = token;
  return {
    [componentCls]: {
      [`&${componentCls}-box`]: {
        display: 'flex',
        flexDirection: 'column',
        [`& ${componentCls}-node:last-of-type`]: {
          [`> ${componentCls}-node-icon`]: {
            '&:after': {
              display: 'none',
            },
          },
        },
      },
      [`& ${componentCls}-node`]: {
        position: 'relative',
        display: 'flex',
        alignItems: 'baseline',
        gap: token.marginSM,
      },
      [`& ${componentCls}-node-header`]: {
        display: 'flex',
        flexDirection: 'column',
      },
      [`& ${componentCls}-node-title`]: {
        fontWeight: 500,
        display: 'flex',
        gap: token.marginXS,
      },
      [`& ${componentCls}-node-collapsible`]: {
        paddingInlineEnd: token.padding,
        cursor: 'pointer',
      },
      [`& ${componentCls}-node-footer`]: {
        marginBottom: token.margin,
      },
      [`& ${componentCls}-node-content`]: {
        marginBottom: token.margin,
      },
      [`& ${componentCls}-node-collapse-icon`]: {
        '& svg': {
          transition: `transform ${token.motionDurationMid} ${token.motionEaseInOut}`,
        },
      },
      [`& ${componentCls}-node-description`]: {
        color: token.colorTextDescription,
        fontSize: token.fontSize,
        lineHeight: token.lineHeight,
        marginBlockEnd: token.margin,
      },
      [`& ${componentCls}-node-icon`]: {
        lineHeight: 1,
        fontSize: token.iconSize,
        '&:after': {
          content: '""',
          position: 'absolute',
          height: `calc(100% - ${unit(calc(token.iconSize).mul(token.lineHeight).equal())})`,
          borderInlineStart: `${unit(token.lineWidth)} solid ${token.colorFillContent}`,
          insetInlineStart: unit(calc(token.iconSize).sub(1).div(2).equal()),
          top: unit(calc(token.iconSize).mul(token.lineHeight).equal()),
        },
      },
      [`& ${componentCls}-node-icon-dashed`]: {
        '&:after': {
          borderInlineStart: `${unit(token.lineWidth)} dashed ${token.colorFillContent}`,
        },
      },
      [`& ${componentCls}-node-icon-dotted`]: {
        '&:after': {
          borderInlineStart: `${unit(token.lineWidth)} dotted ${token.colorFillContent}`,
        },
      },
      [`& ${componentCls}-node-index-icon`]: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: 1,
        color: token.colorTextSecondary,
        fontSize: token.fontSizeSM,
        width: token.iconSize,
        height: token.iconSize,
        backgroundColor: token.colorFillContent,
        borderRadius: unit(calc(token.iconSize).div(2).equal()),
      },
      [`& ${componentCls}-motion-blink`]: {
        backgroundClip: 'text',
        color: token.colorTextBlinkDefault,
        WebkitBackgroundClip: 'text',
        backgroundImage: `linear-gradient(90deg,transparent,${token.colorTextBlink},transparent)`,
        animationDuration: '1s',
        animationIterationCount: 'infinite',
        animationTimingFunction: 'linear',
        animationFillMode: 'forwards',
        backgroundSize: '50%',
        backgroundRepeat: 'no-repeat',
        animationName: blink,
      },
      [`&${componentCls}-rtl`]: {
        direction: 'rtl',
        [`& ${componentCls}-node-icon`]: {
          '&:after': {
            insetInlineStart: 'unset',
            insetInlineEnd: unit(calc(token.iconSize).sub(1).div(2).equal()),
          },
        },
      },
    },
  };
};

export const prepareComponentToken: GetDefaultToken<'ThoughtChain'> = (token) => {
  const itemMotionDescription = new FastColor(token.colorTextDescription).setA(0.25).toHexString();
  const colorTextBlinkDefault = token.colorTextDescription;
  const colorTextBlink = token.colorTextBase;
  return {
    itemMotionDescription,
    colorTextBlinkDefault,
    colorTextBlink,
    itemSolidBg: token.colorFillTertiary,
    itemSolidHoverBg: token.colorBgTextHover,
    itemOutlinedBg: token.colorBgContainer,
    itemOutlinedHoverBg: token.colorBgTextHover,
    itemBorderRadius: token.borderRadius,
    iconSize: token.fontSize,
  };
};

export default genStyleHooks<'ThoughtChain'>(
  'ThoughtChain',
  (token) => {
    const compToken = mergeToken<ThoughtChainToken>(token, {});
    return [
      genThoughtChainStyle(compToken),
      genThoughtChainItemStyle(compToken),
      blink,
      genCollapseMotion(compToken),
      genTransitionCollapseStyle(compToken),
    ];
  },
  prepareComponentToken,
);
