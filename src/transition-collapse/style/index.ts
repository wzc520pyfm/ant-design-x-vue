import type { FullToken, GenerateStyle } from '../../theme/cssinjs-utils';

// biome-ignore lint/suspicious/noEmptyInterface: ComponentToken need to be empty by default
export interface ComponentToken {}

export interface TransitionCollapseToken
  extends FullToken<'TransitionCollapse'> {}

export const genTransitionCollapseStyle: GenerateStyle<
  TransitionCollapseToken
> = (token) => {
  const { componentCls } = token;
  const transitionCollapseCls = `${componentCls}-transition-collapse`;
  return {
    [componentCls]: {
      [transitionCollapseCls]: {
        '&-enter-active': {
          transition: ['max-height', 'padding-top', 'padding-bottom']
            .map(
              (prop) =>
                `${prop} ${token.motionDurationSlow} ${token.motionEaseInOut}`,
            )
            .join(','),
        },

        '&-leave-active': {
          transition: ['max-height', 'padding-top', 'padding-bottom']
            .map(
              (prop) =>
                `${prop} ${token.motionDurationSlow} ${token.motionEaseInOut}`,
            )
            .join(','),
        },
      },
    },
  };
};
