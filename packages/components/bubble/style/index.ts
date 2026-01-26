import { Keyframes, unit } from '../../_util/cssinjs';
import { mergeToken } from '../../_util/cssinjs-utils';
import type { FullToken, GenerateStyle, GetDefaultToken } from '../../theme/cssinjs-utils';
import { genStyleHooks } from '../../theme/genStyleUtils';
import { genShapeStyle, genVariantStyle } from './content';
import { genDividerBubbleStyle } from './divider';
import genBubbleListStyle from './list';
import { genSlotStyle } from './slot';
import { genSystemBubbleStyle } from './system';

const loadingMove = new Keyframes('loadingMove', {
  '0%': {
    transform: 'translateY(0)',
  },
  '10%': {
    transform: 'translateY(4px)',
  },
  '20%': {
    transform: 'translateY(0)',
  },
  '30%': {
    transform: 'translateY(-4px)',
  },
  '40%': {
    transform: 'translateY(0)',
  },
});

const cursorBlink = new Keyframes('cursorBlink', {
  '0%': {
    opacity: 1,
  },
  '50%': {
    opacity: 0,
  },
  '100%': {
    opacity: 1,
  },
});

const fadeIn = new Keyframes('fadeIn', {
  '0%': {
    opacity: 0,
  },
  '100%': {
    opacity: 1,
  },
});

export interface ComponentToken {
  /**
   * @desc 打字动画内容
   * @descEN Typing animation content
   */
  typingContent: string;
  /**
   * @desc 打字动画持续时间
   * @descEN Typing animation duration
   */
  typingAnimationDuration: string;
  /**
   * @desc 打字动画名称
   * @descEN Typing animation name
   */
  typingAnimationName: string;
}

export interface BubbleToken extends FullToken<'Bubble'> {}

const genBubbleStyle: GenerateStyle<BubbleToken> = (token) => {
  const {
    componentCls,
    fontSize,
    lineHeight,
    paddingSM,
    colorText,
    calc,
  } = token;

  return [
    {
      [componentCls]: {
        display: 'flex',
        columnGap: paddingSM,

        [`&${componentCls}-rtl`]: {
          direction: 'rtl',
        },
        [`&${componentCls}-loading`]: {
          alignItems: 'center',
        },

        [`& ${componentCls}-body`]: {
          display: 'flex',
          flexDirection: 'column',
        },

        // ============================ Avatar =============================
        [`& ${componentCls}-avatar`]: {
          display: 'inline-flex',
          justifyContent: 'center',
          alignSelf: 'flex-start',
        },

        // =========================== Content =============================
        [`& ${componentCls}-content`]: {
          position: 'relative',
          boxSizing: 'border-box',
          minWidth: 0,
          maxWidth: '100%',
          minHeight: calc(paddingSM).mul(2).add(calc(lineHeight).mul(fontSize)).equal(),
          paddingInline: `${unit(token.padding)}`,
          paddingBlock: `${unit(paddingSM)}`,
          color: colorText,
          fontSize: token.fontSize,
          lineHeight: token.lineHeight,
          wordBreak: 'break-word',
          '&-string': {
            whiteSpace: 'pre-wrap',
          },
        },

        // Typing animation
        '&-typing:last-child::after': {
          content: '"|"',
          fontWeight: 900,
          userSelect: 'none',
          opacity: 1,
          marginInlineStart: '0.1em',
          animationName: cursorBlink,
          animationDuration: '0.8s',
          animationIterationCount: 'infinite',
          animationTimingFunction: 'linear',
        },

        // Fade-in animation
        '&-fade-in .fade-in': {
          display: 'inline',
          animationName: fadeIn,
          animationDuration: '1s',
          animationTimingFunction: 'linear',
        },

        [`& ${componentCls}-dot`]: {
          position: 'relative',
          height: token.controlHeight,
          display: 'flex',
          alignItems: 'center',
          columnGap: token.marginXS,
          padding: `0 ${unit(token.paddingXXS)}`,
          alignSelf: 'center',
          '&-item': {
            backgroundColor: token.colorPrimary,
            borderRadius: '100%',
            width: 4,
            height: 4,
            animationName: loadingMove,
            animationDuration: '2s',
            animationIterationCount: 'infinite',
            animationTimingFunction: 'linear',
            '&:nth-child(1)': {
              animationDelay: '0s',
            },
            '&:nth-child(2)': {
              animationDelay: '0.2s',
            },
            '&:nth-child(3)': {
              animationDelay: '0.4s',
            },
          },
        },

        // ======================== placement ============================
        '&-start': {
          flexDirection: 'row',

          [`& ${componentCls}-header`]: {
            flexDirection: 'row',
          },
        },

        '&-end': {
          flexDirection: 'row-reverse',
          justifySelf: 'flex-end',

          [`& ${componentCls}-header`]: {
            flexDirection: 'row-reverse',
          },

          [`& ${componentCls}-editing-opts`]: {
            flexDirection: 'row-reverse',
          },
        },
      },
    },
    cursorBlink,
  ];
};

export const prepareComponentToken: GetDefaultToken<'Bubble'> = () => ({
  typingContent: '|',
  typingAnimationName: 'cursorBlink',
  typingAnimationDuration: '0.8s',
});

export default genStyleHooks<'Bubble'>(
  'Bubble',
  (token: BubbleToken) => {
    const bubbleToken = mergeToken<BubbleToken>(token, {});
    return [
      // 位置越靠后，样式优先级越高
      genBubbleStyle(bubbleToken),
      genVariantStyle(bubbleToken),
      genShapeStyle(bubbleToken),
      genSlotStyle(bubbleToken),
      genBubbleListStyle(bubbleToken),
      genSystemBubbleStyle(bubbleToken),
      genDividerBubbleStyle(bubbleToken),
    ];
  },
  prepareComponentToken,
);
