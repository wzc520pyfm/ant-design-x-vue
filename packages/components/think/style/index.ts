import { unit } from '../../_util/cssinjs';
import { mergeToken } from '../../_util/cssinjs-utils';
import { blink } from '../../style/motion/blink';
import { genCollapseMotion } from '../../style';
import type { FullToken, GenerateStyle, GetDefaultToken } from '../../theme/cssinjs-utils';
import { genStyleHooks } from '../../theme/genStyleUtils';
import { genTransitionCollapseStyle } from '../../transition-collapse';

export interface ComponentToken {
  /**
   * @desc 默认打字动画颜色
   * @descEN Default typing animation color
   */
  colorTextBlinkDefault: string;
  /**
   * @desc 打字动画颜色
   * @descEN Typing animation color
   */
  colorTextBlink: string;
}

export interface ThinkToken extends FullToken<'Think'> {}

const genThinkStyle: GenerateStyle<ThinkToken> = (token) => {
  const {
    componentCls,
    paddingXS,
    paddingSM,
    marginSM,
    colorTextSecondary,
    colorTextDescription,
    fontSize,
    fontSizeHeading5,
    fontSizeSM,
    lineHeight,
    colorBorder,
    lineWidth,
    calc,
  } = token;

  return {
    [componentCls]: {
      [`${componentCls}-status-wrapper`]: {
        width: 'fit-content',
        display: 'flex',
        flexDirection: 'row',
        gridGap: paddingXS,
        alignItems: 'center',
        fontSize: fontSize,
        color: colorTextSecondary,
        lineHeight: lineHeight,
        cursor: 'pointer',
      },

      [`${componentCls}-status-icon`]: {
        fontSize: fontSizeHeading5,
        display: 'flex',
      },
      [`${componentCls}-status-text`]: {
        lineHeight: token.lineHeight,
        fontSize: token.fontSize,
      },

      [`${componentCls}-status-down-icon`]: {
        fontSize: fontSizeSM,
        svg: {
          transition: `all ${token.motionDurationMid} ${token.motionEaseInOut}`,
        },
      },

      [`${componentCls}-content`]: {
        marginTop: marginSM,
        width: '100%',
        color: colorTextDescription,
        paddingInlineStart: paddingSM,
        borderInlineStart: `${unit(calc(lineWidth).mul(2).equal())} solid ${colorBorder}`,
      },

      [`${componentCls}-motion-blink`]: {
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
      },
    },
  };
};

export const prepareComponentToken: GetDefaultToken<'Think'> = (token) => {
  const { colorTextDescription, colorTextBase } = token;

  return {
    colorTextBlinkDefault: colorTextDescription,
    colorTextBlink: colorTextBase,
  };
};

export default genStyleHooks<'Think'>(
  'Think',
  (token) => {
    const ThinkToken = mergeToken<ThinkToken>(token, {});
    const { componentCls } = token;
    return [
      genThinkStyle(ThinkToken),
      blink,
      genCollapseMotion(ThinkToken),
      genTransitionCollapseStyle(ThinkToken),
    ];
  },
  prepareComponentToken,
);
