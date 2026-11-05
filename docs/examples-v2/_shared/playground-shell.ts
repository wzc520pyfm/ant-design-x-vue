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

/** Sidebar and chat column follow the active Ant Design algorithm, not a light hex. */
export function usePlaygroundShell(height: string, mainPadding = '12px') {
  const { token } = theme.useToken();
  const markdownClass = computed(() =>
    isDarkColor(token.value.colorBgContainer) ? 'x-markdown-dark' : 'x-markdown-light',
  );
  const shellStyle = computed(() => ({
    height,
    border: `1px solid ${token.value.colorBorderSecondary}`,
    borderRadius: `${token.value.borderRadiusLG}px`,
    overflow: 'hidden',
    background: token.value.colorBgContainer,
    color: token.value.colorText,
  }));
  const sideStyle = computed(() => ({
    width: '240px',
    padding: '12px',
    background: token.value.colorBgLayout,
    color: token.value.colorText,
    minWidth: '0',
  }));
  const mainStyle = computed(() => ({
    flex: '1',
    minWidth: '0',
    padding: mainPadding,
  }));
  return { markdownClass, shellStyle, sideStyle, mainStyle };
}
