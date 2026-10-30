import { CopyOutlined, ZoomInOutlined } from '@ant-design/icons-vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { h } from 'vue';
import { Actions } from 'ant-design-x-vue';

describe('Actions icon', () => {
  it('renders vnode, factory, and icon component as svg', () => {
    const wrapper = mount(Actions, {
      props: {
        items: [
          { key: 'vnode', label: 'Copy', icon: h(CopyOutlined) },
          { key: 'factory', label: 'Zoom', icon: () => h(ZoomInOutlined) },
          { key: 'component', label: 'Zoom component', icon: ZoomInOutlined },
        ],
      },
    });

    const html = wrapper.html();
    expect(html).not.toMatch(/\(\)\s*=>/);
    expect(html).not.toContain('function');
    expect(wrapper.findAll('svg').length).toBe(3);
    wrapper.unmount();
  });

  it('mounts one shared icon vnode in every Actions list', () => {
    const icon = h(CopyOutlined);
    const items = [{ key: 'copy', label: 'Copy', icon }];
    const wrapper = mount({
      setup() {
        return () => h('div', [h(Actions, { items }), h(Actions, { items })]);
      },
    });

    const lists = wrapper.findAll('.ant-actions');
    expect(lists).toHaveLength(2);
    for (const list of lists) {
      expect(list.findAll('svg')).toHaveLength(1);
    }
    wrapper.unmount();
  });
});
