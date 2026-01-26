import type { GenerateStyle } from '../../theme/cssinjs-utils';
import type { BubbleToken } from '.';

export const genDividerBubbleStyle: GenerateStyle<BubbleToken> = (token) => {
  const { componentCls } = token;
  return {
    [componentCls]: {
      '&-divider': {
        width: '100%',
        justifyContent: 'center',

        [`& ${componentCls}-body`]: {
          width: '100%',
        },
      },
    },
  };
};
