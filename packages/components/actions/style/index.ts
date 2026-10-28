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
        color: token.colorText,
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
        // DOM class is `${componentCls}-icon`, not `${componentCls}-item-icon`.
        [`${componentCls}-icon`]: {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: token.fontSize,
          color: 'inherit',
          lineHeight: 0,
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
      // Simple pager: Vue aligns the previous chevron to the top of a 24px
      // box, so it sits ~8px above the 1/5 pill and the next chevron.
      // React keeps prev, pill, and next on one 32px row.
      [`${antCls}-pagination${antCls}-pagination-simple`]: {
        display: 'inline-flex',
        alignItems: 'center',
        height: token.controlHeight,
        lineHeight: unit(token.controlHeight),
        verticalAlign: 'middle',
        [`${antCls}-pagination-prev, ${antCls}-pagination-next, ${antCls}-pagination-simple-pager`]: {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: token.controlHeight,
          minHeight: token.controlHeight,
          lineHeight: unit(token.controlHeight),
          verticalAlign: 'middle',
          marginBlock: 0,
        },
        // Nest under prev/next so this beats the simple pager's
        // `.ant-pagination-simple .ant-pagination-prev .ant-pagination-item-link`
        // (same class count, often injected later at 24px).
        [`${antCls}-pagination-prev, ${antCls}-pagination-next`]: {
          [`${antCls}-pagination-item-link`]: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: token.controlHeight,
            height: token.controlHeight,
            lineHeight: unit(token.controlHeight),
            verticalAlign: 'middle',
          },
        },
        [`${antCls}-pagination-simple-pager`]: {
          height: token.controlHeight,
          lineHeight: unit(token.controlHeight),
          input: {
            height: token.controlHeight,
            lineHeight: unit(token.controlHeight),
            verticalAlign: 'middle',
            marginBlock: 0,
          },
        },
      },
      [`&${componentCls}-rtl`]: {
        direction: 'rtl',
      },
      // Variant classes sit on the inner list. The cssinjs hash is only on
      // the root, so these have to be descendants, not `&-variant-*`.
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
          [`${componentCls}-icon`]: {
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
