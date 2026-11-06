import { mergeToken } from '../../_util/cssinjs-utils';
import type { FullToken, GenerateStyle, GetDefaultToken } from '../../theme/cssinjs-utils';
import { genStyleHooks } from '../../theme/genStyleUtils';

export interface ComponentToken {
  /**
   * @desc 目录背景色
   * @descEN Background color of directory
   */
  colorBgDirectory: string;
}

export interface FolderToken extends FullToken<'Folder'> {}

const genFolderStyle: GenerateStyle<FolderToken> = (token) => {
  const { componentCls, antCls, padding, paddingXS } = token;

  return {
    [componentCls]: {
      height: '100%',
      width: '100%',
      background: token.colorBgDirectory,
      [`${antCls}-tree-node-content-wrapper`]: {
        display: 'flex',
        paddingInline: 0,
      },
      [`${antCls}-tree-node-content-wrapper-open,${antCls}-tree-node-content-wrapper-close`]: {
        display: 'flex',
      },
      [`${antCls}-tree-node-content-wrapper-normal`]: {
        display: 'flex',
      },
      [`${antCls}-tree-list`]: {
        paddingInline: padding,
        paddingBlock: paddingXS,
      },
      [`${antCls}-tree-switcher`]: {
        width: '10px',
        '&:before': {
          width: '10px',
          height: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
        },
      },
      [`${componentCls}-container`]: {
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        minHeight: 0,
      },
      [`${componentCls}-directory-tree`]: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        flex: 'none',
        minWidth: 0,
        overflow: 'hidden',
      },
      [`${componentCls}-directory-tree-title`]: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
      },
      [`${componentCls}-directory-tree-content`]: {
        width: '100%',
        background: 'transparent',
        height: '100%',
        borderRadius: 'unset',
        display: 'flex',
        overflow: 'auto',
      },
      [`${componentCls}-directory-tree-body`]: {
        height: '100%',
        minHeight: 0,
        flex: 1,
        overflow: 'auto',
      },
      [`&${componentCls}-rtl`]: {
        direction: 'rtl',
      },
    },
  };
};

const genFilePreviewStyle: GenerateStyle<FolderToken> = (token) => {
  const { componentCls, padding, paddingXS, marginLG, calc } = token;

  return {
    [componentCls]: {
      [`${componentCls}-preview`]: {
        width: '100%',
        background: token.colorBgContainer,
        flex: 1,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        overflow: 'hidden',
      },
      [`${componentCls}-preview-title`]: {
        background: token.colorBgContainer,
        paddingInline: padding,
        paddingBlock: paddingXS,
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
      },
      [`${componentCls}-preview-content`]: {
        overflow: 'auto',
        flex: 1,
        background: token.colorBgContainer,
        paddingInline: padding,
        paddingBlock: paddingXS,
      },
      [`${componentCls}-preview-code`]: {
        margin: 0,
        padding: 0,
        background: 'transparent',
        fontFamily:
          "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace",
        fontSize: token.fontSizeSM,
        lineHeight: token.lineHeight,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      },
      [`${componentCls}-preview-loading-container`]: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBlockStart: calc(marginLG).mul(3).equal(),
      },
      [`${componentCls}-preview-empty-container`]: {
        marginBlockStart: calc(marginLG).mul(3).equal(),
      },
      [`${componentCls}-directory-tree-item-title`]: {
        display: 'flex',
        whiteSpace: 'nowrap',
        paddingInlineEnd: padding,
      },
    },
  };
};

export const prepareComponentToken: GetDefaultToken<'Folder'> = (token) => ({
  colorBgDirectory: token.colorFillTertiary,
});

export default genStyleHooks<'Folder'>(
  'Folder',
  (token) => {
    const compToken = mergeToken<FolderToken>(token, {});
    return [genFolderStyle(compToken), genFilePreviewStyle(compToken)];
  },
  prepareComponentToken,
);
