/** True when an Ant Design token color is a dark surface. */
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
