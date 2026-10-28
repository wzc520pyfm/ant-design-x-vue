import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { Sender } from 'ant-design-x-vue';
import { slotPlaceholderColor } from '../style/slot-placeholder';

describe('slot placeholder color', () => {
  it('keeps the React 25% primary tint on a light container', () => {
    expect(slotPlaceholderColor('#1677ff', '#ffffff')).toBe('rgb(197,221,255)');
  });

  it('mixes the primary toward white on a dark container', () => {
    const dark = slotPlaceholderColor('#1668dc', '#141414');
    expect(dark).not.toBe('rgb(21,41,70)');
    expect(dark).not.toBe('rgb(22,91,190)');
    expect(dark).toBe('rgb(57,127,225)');
  });
});

describe('Sender slot and switch layout', () => {
  it('aligns slots to the text line and keeps switch labels on one line', () => {
    const wrapper = mount(Sender, {
      props: {
        slotConfig: [
          { type: 'text', value: 'Hello ' },
          { type: 'input', key: 'name', props: { placeholder: 'name' } },
        ],
      },
    });

    const css = Array.from(document.querySelectorAll('style'))
      .map(node => node.textContent || '')
      .join('\n');

    expect(css).toMatch(/\.ant-sender-slot\{[^}]*vertical-align:middle/);
    expect(css).not.toMatch(/\.ant-sender-slot\{[^}]*vertical-align:bottom/);
    expect(css).toMatch(/\.ant-sender-switch \.ant-btn\{[^}]*white-space:nowrap/);
    wrapper.unmount();
  });
});
