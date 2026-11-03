import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { Actions } from 'ant-design-x-vue';
import { Pagination } from 'ant-design-vue';
import { h } from 'vue';

describe('Actions variant style', () => {
  it('keeps variant chrome tight and pager chevrons at controlHeightSM like React', () => {
    const wrapper = mount(Actions, {
      props: {
        variant: 'outlined',
        items: [
          {
            key: 'pagination',
            actionRender: () => h(Pagination, { simple: true, total: 5, pageSize: 1 }),
          },
          { key: 'retry', label: 'Retry' },
        ],
      },
      attachTo: document.body,
    });

    const css = Array.from(document.querySelectorAll('style'))
      .map(node => node.textContent || '')
      .join('\n');

    expect(css).toMatch(/\.ant-actions \.ant-actions-list\{[^}]*display:inline-flex/);
    expect(css).toMatch(/\.ant-actions \.ant-actions-list\{[^}]*width:fit-content/);
    expect(css).toMatch(/\.ant-actions \.ant-actions-variant-outlined\{[^}]*border:/);
    expect(css).toMatch(/\.ant-actions \.ant-actions-variant-filled\{[^}]*background-color:/);
    expect(css).toMatch(/\.ant-actions-item \.ant-actions-icon\{[^}]*display:inline-flex/);
    // React: only narrow the chevron; do not inflate the row to controlHeight (32px).
    expect(css).toMatch(
      /ant-pagination-simple[\s\S]*?ant-pagination-item-link\{[^}]*width:\s*24px/,
    );
    expect(css).not.toMatch(
      /\.ant-actions[\s\S]*?ant-pagination-simple\{[^}]*height:\s*32px/,
    );
    expect(css).toMatch(/ant-pagination-simple\{[^}]*display:inline-flex/);
    expect(css).toMatch(/ant-pagination-simple\{[^}]*margin:0/);
    expect(wrapper.find('.ant-actions-variant-outlined').exists()).toBe(true);

    const list = wrapper.find('.ant-actions-list').element as HTMLElement;
    expect(getComputedStyle(list).display).toBe('inline-flex');
    expect(getComputedStyle(list).width).not.toBe('100%');

    wrapper.unmount();
  });
});
