import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { Actions } from 'ant-design-x-vue';

describe('Actions variant style', () => {
  it('compounds outlined and filled modifiers on the root and centers the icon', () => {
    const wrapper = mount(Actions, {
      props: {
        variant: 'outlined',
        items: [{ key: 'retry', label: 'Retry' }],
      },
    });

    const css = Array.from(document.querySelectorAll('style'))
      .map(node => node.textContent || '')
      .join('\n');

    expect(css).toMatch(/\.ant-actions \.ant-actions-variant-outlined\{[^}]*border:/);
    expect(css).toMatch(/\.ant-actions \.ant-actions-variant-filled\{[^}]*background-color:/);
    expect(css).toMatch(/\.ant-actions-item \.ant-actions-icon\{[^}]*display:inline-flex/);
    expect(css).toMatch(/ant-pagination-simple\{[^}]*display:inline-flex/);
    expect(css).toMatch(/ant-pagination-prev,[\s\S]*vertical-align:middle/);
    expect(wrapper.find('.ant-actions-variant-outlined').exists()).toBe(true);
    wrapper.unmount();
  });
});
