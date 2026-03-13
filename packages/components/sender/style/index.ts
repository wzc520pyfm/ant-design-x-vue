import { unit } from '../../_util/cssinjs';
import { mergeToken } from '../../_util/cssinjs-utils';
import { FastColor } from '@ant-design/fast-color';
import type {
  FullToken,
  GenerateStyle,
  GetDefaultToken,
} from '../../theme/cssinjs-utils';
import { genStyleHooks } from '../../theme/genStyleUtils';
import genSenderHeaderStyle from './header';
import genSenderSwitchStyle from './switch';
import genSlotTextAreaStyle from './slot-textarea';

export interface ComponentToken {
  colorBgSlot: string;
  colorTextSlot: string;
  colorTextSlotPlaceholder: string;
  colorBorderSlot: string;
  colorBorderSlotHover: string;
  switchCheckedBg: string;
  switchCheckedHoverBg: string;
  switchUncheckedHoverBg: string;
  colorBorderInput: string;
}

export interface SenderToken extends FullToken<'Sender'> {
  SenderContentMaxWidth: number | string;
}

const genSenderStyle: GenerateStyle<SenderToken> = (token) => {
  const { componentCls, paddingSM, paddingXS, paddingXXS, lineWidth, calc } = token;

  return {
    [`${componentCls}:not(${componentCls}-switch):not(${componentCls}-header)`]: {
      position: 'relative',
      width: '100%',
      boxSizing: 'border-box',
      boxShadow: `${token.boxShadowTertiary}`,
      borderRadius: {
        _skip_check_: true,
        value: calc(token.borderRadius).mul(2).equal(),
      },

      borderColor: token.colorBorderInput,
      borderWidth: lineWidth,
      borderStyle: 'solid',

      '&-disabled': {
        background: token.colorBgContainerDisabled,
      },
      // ============================== RTL ==============================
      [`&${componentCls}-rtl`]: {
        direction: 'rtl',
      },

      // ============================ Content ============================
      [`${componentCls}-content`]: {
        display: 'flex',
        gap: paddingXS,
        width: '100%',
        paddingBlock: paddingSM,
        paddingInlineStart: paddingSM,
        paddingInlineEnd: paddingSM,
        boxSizing: 'border-box',
        alignItems: 'flex-end',
      },
      // ============================ Prefix =============================
      [`${componentCls}-prefix`]: {
        flex: 'none',
      },

      // ============================= Input =============================
      [`${componentCls}-input`]: {
        padding: 0,
        borderRadius: 0,
        flex: 'auto',
        alignSelf: 'center',
        minHeight: 'auto',
        caretColor: token.colorPrimary,
      },

      // ============================ Actions ============================
      [`${componentCls}-actions-list`]: {
        flex: 'none',
        display: 'flex',

        '&-presets': {
          gap: token.paddingXS,
        },
      },

      [`${componentCls}-actions-btn`]: {
        '&-disabled': {
          background: token.colorPrimary,
          opacity: 0.45,
          color: token.colorTextLightSolid,
        },

        '&-loading-button': {
          padding: 0,
          border: 0,
        },

        '&-loading-icon': {
          height: token.controlHeight,
          width: token.controlHeight,
          verticalAlign: 'top',
        },
        '&-recording-icon': {
          height: '1.2em',
          width: '1.2em',
          verticalAlign: 'top',
        },
      },

      // ============================ Footer =============================
      [`${componentCls}-footer`]: {
        paddingInlineStart: paddingSM,
        paddingInlineEnd: paddingSM,
        paddingBlockEnd: paddingSM,
        paddingBlockStart: paddingXXS,
        boxSizing: 'border-box',
      },
    },
  };
};

export const prepareComponentToken: GetDefaultToken<'Sender'> = (token) => {
  const { colorPrimary, colorFillTertiary } = token;

  const colorBgSlot = new FastColor(colorPrimary).setA(0.06).toRgbString();
  const colorTextSlot = colorPrimary;
  const colorTextSlotPlaceholder = new FastColor(colorPrimary).setA(0.25).toRgbString();
  const colorBorderSlotHover = new FastColor(colorPrimary).setA(0.1).toRgbString();
  const colorBorderSlot = colorBgSlot;
  const switchCheckedBg = new FastColor(colorPrimary).setA(0.08).toRgbString();

  const switchUncheckedHoverBg = new FastColor(colorFillTertiary).setA(0.04).toRgbString();
  const switchCheckedHoverBg = new FastColor(colorPrimary).setA(0.1).toRgbString();
  const colorBorderInput = new FastColor(colorFillTertiary).setA(0.1).toRgbString();

  return {
    colorBgSlot,
    colorTextSlot,
    colorTextSlotPlaceholder,
    colorBorderSlotHover,
    colorBorderSlot,
    switchCheckedBg,
    switchCheckedHoverBg,
    switchUncheckedHoverBg,
    colorBorderInput,
  };
};

export default genStyleHooks<'Sender'>(
  'Sender',
  (token) => {
    const { paddingXS, calc } = token;
    const SenderToken = mergeToken<SenderToken>(token, {
      SenderContentMaxWidth: `calc(100% - ${unit(
        calc(paddingXS).add(32).equal(),
      )})`,
    });
    return [
      genSenderStyle(SenderToken),
      genSenderHeaderStyle(SenderToken),
      genSenderSwitchStyle(SenderToken),
      genSlotTextAreaStyle(SenderToken),
    ];
  },
  prepareComponentToken,
);
