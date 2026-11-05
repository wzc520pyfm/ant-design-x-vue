import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { FastColor } from '@ant-design/fast-color';
import { Sender } from 'ant-design-x-vue';

describe('slot placeholder color', () => {
  it('keeps React\'s 25% primary alpha for the placeholder token', () => {
    expect(new FastColor('#1677ff').setA(0.25).toRgbString()).toBe('rgba(22,119,255,0.25)');
  });

  it('paints empty slot placeholders with the 25% primary tint', () => {
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

    // React parity: colorTextSlotPlaceholder = colorPrimary @ 25% alpha,
    // used by the slot input, slot select and slot-content ::after rules.
    expect(css).toContain('rgba(22,119,255,0.25)');
    // The old dark-mode contrast-boosted mix must not come back.
    expect(css).not.toContain('rgb(57,127,225)');
    wrapper.unmount();
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

    expect(css).toMatch(/\.ant-sender-slot\{[^}]*vertical-align:bottom/);
    expect(css).toMatch(/\.ant-sender-slot\{[^}]*min-height:24px/);
    expect(css).toMatch(/\.ant-sender-slot\{[^}]*(margin-block:2px|margin-top:2px)/);
    expect(css).not.toMatch(/\.ant-sender-slot\{[^}]*vertical-align:middle/);
    expect(css).toMatch(/\.ant-sender-switch \.ant-btn\{[^}]*white-space:nowrap/);
    wrapper.unmount();
  });
});
