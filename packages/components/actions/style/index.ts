import { unit } from '../../_util/cssinjs';
import { mergeToken } from '../../_util/cssinjs-utils';
import type { FullToken, GenerateStyle, GetDefaultToken } from '../../theme/cssinjs-utils';
import { genStyleHooks } from '../../theme/genStyleUtils';
import { initFadeLeftMotion, initFadeMotion } from '../../style';
import genActionsAudioStyle from './audio';
import genActionsCopyStyle from './copy';
import genActionsFeedbackStyle from './feedback';

// biome-ignore lint/suspicious/noEmptyInterface: ComponentToken need to be empty by default
export interface ComponentToken {}

export interface ActionsToken extends FullToken<'Actions'> {}

const genActionsStyle: GenerateStyle<ActionsToken> = (token) => {
  const { componentCls, antCls, calc } = token;
  // NOTE:
  // The React 2.0 style file (`.cursor/x/packages/x/components/actions/style/index.ts`)
  // declares `${componentCls}-item` and `${componentCls}-list` as **top-level** selectors.
  // This works in React because the React docs run cssinjs in **CSS-Var mode**, where the
  // generated CSS has no `:where(.css-XXX)` hash scope (e.g. `.ant-actions-list { ... }`).
  // ant-design-vue 4.x does not yet expose a CSS-Var mode, so our cssinjs runs in JS mode
  // and produces `:where(.css-XXX).ant-actions-list { ... }` — meaning every targeted
  // element would need the hashId class. To keep the component templates aligned with
  // React (hashId only on the outer `.ant-actions` root), we instead nest the inner
  // selectors as descendants of `componentCls` so the hash is required only on the root
  // while inner elements like `${componentCls}-list` / `-item` are matched by descendant
  // selector. Visual output is identical to React.
  return {
    [componentCls]: {
      [`${componentCls}-item`]: {
        cursor: 'pointer',
        fontSize: token.fontSize,
        paddingInline: unit(calc(token.paddingXXS).add(1).equal()),
        paddingBlock: token.paddingXXS,
        borderRadius: token.borderRadiusSM,
        height: token.controlHeightSM,
        boxSizing: 'border-box',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: token.lineHeight,
        transition: `all ${token.motionDurationMid} ${token.motionEaseInOut}`,
        '&-icon': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: token.fontSize,
        },
        '&:hover': {
          background: token.colorBgTextHover,
        },
      },
      [`${componentCls}-list`]: {
        display: 'inline-flex',
        flexDirection: 'row',
        alignItems: 'center',
        color: token.colorText,
        gap: token.paddingXS,
      },
      [`& ${antCls}-pagination-item-link`]: {
        width: token.controlHeightSM,
      },
      [`&${componentCls}-rtl`]: {
        direction: 'rtl',
      },
      [`${componentCls}-variant-outlined`]: {
        paddingInline: unit(calc(token.paddingXXS).add(1).equal()),
        paddingBlock: token.paddingXXS,
        borderRadius: token.borderRadius,
        border: `${unit(token.lineWidth)} ${token.lineType} ${token.colorBorderSecondary}`,
      },
      [`${componentCls}-variant-filled`]: {
        paddingInline: unit(calc(token.paddingXXS).add(1).equal()),
        paddingBlock: token.paddingXXS,
        borderRadius: token.borderRadius,
        backgroundColor: token.colorBorderSecondary,

        [`${componentCls}-item`]: {
          paddingInline: unit(calc(token.paddingXXS).add(1).equal()),
          paddingBlock: token.paddingXXS,
          '&-icon': {
            fontSize: token.fontSize,
          },
          '&:hover': {
            color: token.colorTextSecondary,
            background: 'transparent',
          },
        },
      },
      [`${componentCls}-list-danger`]: {
        color: token.colorError,
      },
    },
  };
};

export const prepareComponentToken: GetDefaultToken<'Actions'> = () => ({});

export default genStyleHooks(
  'Actions',
  (token) => {
    const compToken = mergeToken<ActionsToken>(token, {});
    return [
      genActionsStyle(compToken),
      genActionsCopyStyle(compToken),
      genActionsFeedbackStyle(compToken),
      genActionsAudioStyle(compToken),
      initFadeLeftMotion(compToken),
      initFadeMotion(compToken),
    ];
  },
  prepareComponentToken,
);
