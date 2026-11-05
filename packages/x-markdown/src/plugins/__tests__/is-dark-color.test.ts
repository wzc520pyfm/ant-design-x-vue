import { describe, expect, it } from 'vitest';
import { isDarkColor } from '../is-dark-color';

describe('isDarkColor', () => {
  it('treats Ant Design light and dark surfaces differently', () => {
    expect(isDarkColor('#ffffff')).toBe(false);
    expect(isDarkColor('#fafafa')).toBe(false);
    expect(isDarkColor('#141414')).toBe(true);
    expect(isDarkColor('#000000')).toBe(true);
    expect(isDarkColor('rgb(20, 20, 20)')).toBe(true);
    expect(isDarkColor('rgb(255, 255, 255)')).toBe(false);
  });
});
