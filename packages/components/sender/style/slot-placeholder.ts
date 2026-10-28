import { FastColor } from '@ant-design/fast-color';

function contrast(foreground: FastColor, background: FastColor) {
  const channel = (value: number) => {
    const s = value / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  const luminance = (color: FastColor) =>
    0.2126 * channel(color.r) + 0.7152 * channel(color.g) + 0.0722 * channel(color.b);
  const lighter = Math.max(luminance(foreground), luminance(background));
  const darker = Math.min(luminance(foreground), luminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * React 2.0 paints slot placeholders as `colorPrimary` at 25% alpha.
 * That pale tint stays visible on white. On a dark sender it composites to
 * about rgb(25, 42, 71) on rgb(25, 30, 40) (contrast ~1.16). Mix the primary
 * toward white until the placeholder clears 4.5:1.
 */
export function slotPlaceholderColor(primary: string, background: string) {
  const bg = new FastColor(background);
  const tint = new FastColor(primary).setA(0.25).onBackground(bg);
  // Light pages keep React's pale 25% primary. That tint is only ~1.4:1 on
  // white, and mixing it toward white would make it even fainter.
  if (bg.getLuminance() >= 0.4 || contrast(tint, bg) >= 4.5)
    return tint.toRgbString();

  let painted = new FastColor(primary);
  for (let amount = 5; amount <= 80; amount += 5) {
    painted = new FastColor(primary).mix('#ffffff', amount);
    if (contrast(painted, bg) >= 4.5)
      break;
  }
  return painted.toRgbString();
}
