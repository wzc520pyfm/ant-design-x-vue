import { CopyOutlined, RedoOutlined } from '@ant-design/icons-vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { h } from 'vue';
import { Actions, Bubble } from 'ant-design-x-vue';

describe('Bubble footer placement', () => {
  it('keeps pre-wrap on the text and shows icons for every inner footer', () => {
    const actionItems = [
      { key: 'retry', label: 'Retry', icon: h(RedoOutlined) },
      { key: 'copy', label: 'Copy', icon: h(CopyOutlined) },
    ];
    const footer = () => h(Actions, { items: actionItems });
    const wrapper = mount({
      setup() {
        return () =>
          h('div', [
            h(Bubble, {
              content: 'inner footer',
              placement: 'end',
              footerPlacement: 'inner-end',
              footer,
            }),
            h(Bubble, {
              content: 'inner footer and align left',
              placement: 'end',
              footerPlacement: 'inner-start',
              footer,
            }),
            h(Bubble, {
              content: 'outer footer',
              footer,
            }),
          ]);
      },
    });

    const bubbles = wrapper.findAll('.ant-bubble');
    expect(bubbles).toHaveLength(3);

    for (const bubble of bubbles.slice(0, 2)) {
      const content = bubble.find('.ant-bubble-content');
      expect(content.classes()).not.toContain('ant-bubble-content-string');
      expect(bubble.find('.ant-bubble-content-with-footer').classes()).toContain(
        'ant-bubble-content-string',
      );
      expect(bubble.find('.ant-bubble-footer').findAll('svg')).toHaveLength(2);
    }

    const outer = bubbles[2];
    expect(outer.find('.ant-bubble-content').classes()).toContain('ant-bubble-content-string');
    expect(outer.find('.ant-bubble-content-with-footer').exists()).toBe(false);
    expect(outer.find('.ant-bubble-footer').findAll('svg')).toHaveLength(2);

    const css = Array.from(document.querySelectorAll('style'))
      .map((node) => node.textContent || '')
      .join('\n');
    expect(css).toMatch(/\.ant-bubble-footer\{[^}]*white-space:normal/);
    expect(css).toMatch(/\.ant-bubble-footer \.anticon svg\{[^}]*display:inline-block/);

    wrapper.unmount();
  });
});
