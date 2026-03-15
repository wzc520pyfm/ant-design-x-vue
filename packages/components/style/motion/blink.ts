import type { CSSInterpolation } from '../../_util/cssinjs';
import { Keyframes } from '../../_util/cssinjs';
import type { TokenWithCommonCls } from '../../_util/cssinjs-utils';

export const blink = new Keyframes('antXBlink', {
  '0%': {
    backgroundPositionX: '-200%',
    backgroundPositionY: '100%',
  },
  '25%': {
    backgroundPositionX: '-100%',
    backgroundPositionY: '100%',
  },
  '50%': {
    backgroundPositionX: '-0%',
    backgroundPositionY: '100%',
  },
  '75%': {
    backgroundPositionX: '100%',
    backgroundPositionY: '100%',
  },
  '100%': {
    backgroundPositionX: '200%',
    backgroundPositionY: '100%',
  },
});

export const blinkMotion = (
  token: TokenWithCommonCls<{ colorTextBlinkDefault: string; colorTextBlink: string }>,
  motionName: string,
): CSSInterpolation => {
  const motionCls = motionName;
  return [
    blink,
    {
      [motionCls]: {
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
    },
  ];
};
