import { computed } from 'vue';
import { theme } from 'ant-design-vue';

export function isDarkColor(color: string | undefined): boolean {
  if (!color) return false;
  const text = color.trim();
  const hex = text.match(/^#([0-9a-f]{6})$/i);
  let r = 255;
  let g = 255;
  let b = 255;
  if (hex) {
    const n = hex[1];
    r = Number.parseInt(n.slice(0, 2), 16);
    g = Number.parseInt(n.slice(2, 4), 16);
    b = Number.parseInt(n.slice(4, 6), 16);
  } else {
    const rgb = text.match(/rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/i);
    if (!rgb) return false;
    r = Number(rgb[1]);
    g = Number(rgb[2]);
    b = Number(rgb[3]);
  }
  return (r * 299 + g * 587 + b * 114) / 1000 < 140;
}

/**
 * Playground layout tokens aligned with React `@ant-design/x` docs.
 * React embeds these demos in a compact iframe (800 / 1200); Vue docs host
 * them inline, so height should match that iframe and the shell should not
 * add a second card border (`.example` already frames the showcase).
 */
export function usePlaygroundShell(
  height: string,
  mainPadding = '12px',
  options?: { sideWidth?: string },
) {
  const { token } = theme.useToken();
  const sideWidth = options?.sideWidth ?? '280px';
  const markdownClass = computed(() =>
    isDarkColor(token.value.colorBgContainer) ? 'x-markdown-dark' : 'x-markdown-light',
  );
  const shellStyle = computed(() => ({
    width: '100%',
    height,
    overflow: 'hidden',
    background: token.value.colorBgContainer,
    color: token.value.colorText,
    display: 'flex',
  }));
  const sideStyle = computed(() => {
    const layout = token.value.colorBgLayout || '#f5f5f5';
    // React: `${token.colorBgLayout}80` (hex + alpha). Fall back for rgb tokens.
    const sideBg = /^#([0-9a-f]{6})$/i.test(layout.trim())
      ? `${layout.trim()}80`
      : layout;
    return {
      width: sideWidth,
      height: '100%',
      padding: '0 12px',
      boxSizing: 'border-box' as const,
      background: sideBg,
      color: token.value.colorText,
      minWidth: '0',
      display: 'flex',
      flexDirection: 'column' as const,
    };
  });
  const mainStyle = computed(() => ({
    flex: '1',
    minWidth: '0',
    height: '100%',
    padding: mainPadding,
    boxSizing: 'border-box' as const,
  }));
  const logoStyle = computed(() => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '0 24px',
    boxSizing: 'border-box' as const,
    gap: '8px',
    margin: '24px 0',
  }));
  return { markdownClass, shellStyle, sideStyle, mainStyle, logoStyle, token };
}
