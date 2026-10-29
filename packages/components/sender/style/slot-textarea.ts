import { unit } from '../../_util/cssinjs';
import type { GenerateStyle } from '../../theme/cssinjs-utils';
import type { SenderToken } from '.';

const genSlotTextAreaStyle: GenerateStyle<SenderToken> = (token) => {
  const { componentCls, antCls, calc } = token;
  const slotCls = `${componentCls}-slot`;
  const antInputCls = `${antCls}-input`;

  const antDropdownCls = `${antCls}-dropdown-trigger`;
  const slotInputCls = `${componentCls}-slot-input`;
  const slotSelectCls = `${componentCls}-slot-select`;
  const slotTagCls = `${componentCls}-slot-tag`;

  // Nest under componentCls so CSS-in-JS generates descendant selectors
  // instead of compound selectors. The slot span elements are created
  // dynamically via document.createElement and don't carry the hash class,
  // so they can only be matched as descendants of the hash-scoped root.
  return {
    [componentCls]: {
      [`${componentCls}-input-slot`]: {
        outline: 'none',
        cursor: 'text',
        whiteSpace: 'pre-wrap',
        width: '100%',
        caretColor: token.colorPrimary,
        fontSize: token.fontSize,
        lineHeight: token.lineHeight,
        '&:empty::before': {
          content: 'attr(data-placeholder)',
          color: token.colorTextPlaceholder,
        },
      },
      // React 2.0 @ant-design/x slot-textarea: horizontal margin is marginXXS,
      // and marginBlock is marginXXS / 2. Inline margins do not collapse, so
      // two wrapped slot rows keep a full marginXXS between the chips.
      // vertical-align stays bottom so that gap sits under the line box
      // instead of being eaten by a fixed 24px height.
      [slotCls]: {
        display: 'inline-flex',
        margin: `0 ${unit(token.marginXXS)}`,
        verticalAlign: 'bottom',
        alignItems: 'center',
        marginBlock: unit(calc(token.marginXXS).div(2).equal()),
        minHeight: token.controlHeightSM,
        wordBreak: 'break-all',
      },

      [`${antInputCls}${slotInputCls}`]: {
        height: '100%',
        boxSizing: 'border-box',
        background: token.colorBgSlot,
        border: `1px solid ${token.colorBorderSlot}`,
        outline: 'none',
        color: token.colorTextSlot,
        borderRadius: token.borderRadius,
        paddingInline: token.paddingXXS,
        paddingBlock: 0,
        fontSize: 'inherit',
        lineHeight: 'inherit',
        position: 'relative',
        '&::placeholder': {
          color: token.colorTextSlotPlaceholder,
          fontSize: 'inherit',
          lineHeight: 'inherit',
        },
        '&:hover, &:focus': {
          borderColor: token.colorBorderSlotHover,
        },
      },
      [`${slotSelectCls}`]: {
        fontSize: token.fontSize,
        lineHeight: token.lineHeight,
        paddingInline: token.paddingXXS,
        paddingBlock: 0,
        transition: `border-color  ${token.motionDurationMid}`,
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        cursor: 'pointer',
        background: token.colorBgSlot,
        height: '100%',
        boxSizing: 'border-box',
        borderRadius: token.borderRadius,
        color: token.colorTextSlot,
        border: `1px solid ${token.colorBorderSlot}`,
        '&.placeholder': {
          color: token.colorTextSlotPlaceholder,
        },
        [`&${antDropdownCls}-open`]: {
          borderColor: token.colorBorderSlotHover,
        },
      },
      [`${slotSelectCls}-value`]: {
        flex: 1,
        fontSize: token.fontSize,
        lineHeight: token.lineHeight,
        '&:empty::before': {
          content: 'attr(data-placeholder)',
        },
      },
      [`${slotSelectCls}-arrow`]: {
        marginInlineStart: token.marginXXS,
        fontSize: token.fontSize,
        lineHeight: token.lineHeight,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      [`${slotSelectCls}-dropdown ${antDropdownCls}`]: {
        position: 'absolute',
        insetInlineStart: 0,
        top: '100%',
        display: 'inline-flex',
        background: token.colorBgElevated,
        borderRadius: token.borderRadiusLG,
        boxShadow: token.boxShadowSecondary,
        margin: `${token.marginXS} 0 0 0`,
        padding: `${token.paddingXXS}`,
        listStyle: 'none',
        zIndex: 1050,
        fontSize: token.fontSize,
        lineHeight: token.lineHeight,
        width: 'max-content',
      },
      [`${slotSelectCls}-dropdown li`]: {
        minWidth: 'fit-content',
        padding: `${unit(token.paddingXXS)} ${unit(token.controlPaddingHorizontal)}`,
        cursor: 'pointer',
        userSelect: 'none',
        fontSize: token.fontSize,
        lineHeight: token.lineHeight,
        transition: `background ${token.motionDurationMid}`,
        color: token.colorText,
        position: 'relative',
      },
      [`${slotSelectCls}-dropdown li.active, ${slotSelectCls}-dropdown li:hover`]: {
        background: token.controlItemBgHover,
        color: token.colorText,
      },
      [`${slotTagCls}`]: {
        background: token.colorBgSlot,
        border: `1px solid ${token.colorBorderSlot}`,
        outline: 'none',
        color: token.colorTextSlot,
        borderRadius: token.borderRadius,
        padding: `0 ${unit(token.paddingXXS)}`,
        fontSize: token.fontSize,
        lineHeight: token.lineHeight,
        height: '100%',
        boxSizing: 'border-box',
        display: 'inline-flex',
        alignItems: 'center',
        position: 'relative',
        cursor: 'default',
      },
    },
  };
};

export default genSlotTextAreaStyle;
