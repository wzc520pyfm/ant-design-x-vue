import type { CSSProperties } from 'vue';
import { theme } from 'ant-design-vue';
import type { SenderProps } from '../interface';

const useInputHeight = (styles: CSSProperties, autoSize: SenderProps['autoSize']) => {
  const { token } = theme.useToken();
  const lineHeight = parseFloat(`${styles.lineHeight || token.value.lineHeight}`);
  const fontSize = parseFloat(`${styles.fontSize || token.value.fontSize}`);
  if (autoSize === false || !autoSize) {
    return {};
  }
  if (autoSize === true) {
    return {
      height: 'auto',
    };
  }

  return {
    minHeight: autoSize.minRows ? `${lineHeight * fontSize * autoSize.minRows}px` : 'auto',
    maxHeight: autoSize.maxRows ? `${lineHeight * fontSize * autoSize.maxRows}px` : 'auto',
    overflowY: 'auto' as CSSProperties['overflowY'],
  };
};

export default useInputHeight;
