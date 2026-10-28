import { unit } from '../../_util/cssinjs';
import type { GenerateStyle } from '../../theme/cssinjs-utils';
import type { SenderToken } from '.';

const genSenderSwitchStyle: GenerateStyle<SenderToken> = (token) => {
  const { componentCls, antCls } = token;

  const switchCls = `${componentCls}-switch`;

  return {
    [switchCls]: {
      display: 'inline-flex',
      flex: 'none',
      verticalAlign: 'middle',
      // ant-design-vue Button is inline-block. A block child such as
      // "Deep Think: on" then shrinks and wraps. Keep the label on one line.
      [`${antCls}-btn`]: {
        display: 'inline-flex',
        alignItems: 'center',
        flex: 'none',
        width: 'max-content',
        height: token.controlHeight,
        lineHeight: unit(token.controlHeight),
        paddingBlock: 0,
        whiteSpace: 'nowrap',
        verticalAlign: 'middle',
        // A block child ("Deep Think: on") otherwise drops ~17px under the
        // icon, outside the 32px button border. Agent/Files stay put because
        // they are plain text.
        [`> span, > div`]: {
          display: 'inline-flex',
          alignItems: 'center',
          whiteSpace: 'nowrap',
          lineHeight: 'inherit',
          height: 'auto',
        },
      },
      [`${antCls}-btn:not(:disabled):not(${antCls}-btn-disabled):hover`]: {
        background: token.switchUncheckedHoverBg,
        borderColor: token.colorBorder,
        color: token.colorText,
      },

      '&-checked': {
        [`${antCls}-btn:not(:disabled):not(${antCls}-btn-disabled):hover`]: {
          background: token.switchCheckedHoverBg,
          borderColor: token.colorPrimary,
          color: token.colorPrimaryText,
        },
        [`${switchCls}-content`]: {
          background: token.switchCheckedBg,
        },
      },
      // ============================== RTL ==============================
      [`&${componentCls}-rtl`]: {
        direction: 'rtl',
      },
    },
  };
};

export default genSenderSwitchStyle;
