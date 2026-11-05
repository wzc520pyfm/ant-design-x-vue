import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { describe, expect, it } from 'vitest';
import FileCard from '../index';

describe('FileCard.List keys', () => {
  it('keeps DOM nodes when items reorder under a stable key', async () => {
    const wrapper = mount(FileCard.List, {
      props: {
        items: [
          { name: 'alpha.txt', key: 'k1' },
          { name: 'beta.txt', key: 'k2' },
        ],
      },
    });

    const itemClass = '.ant-file-card-list-item';
    const before = wrapper.findAll(itemClass).map((node) => node.element);
    expect(before).toHaveLength(2);
    expect(before[0].textContent).toContain('alpha.txt');

    await wrapper.setProps({
      items: [
        { name: 'beta.txt', key: 'k2' },
        { name: 'alpha.txt', key: 'k1' },
      ],
    });
    await nextTick();

    const after = wrapper.findAll(itemClass).map((node) => node.element);
    expect(after[0].textContent).toContain('beta.txt');
    expect(after[0]).toBe(before[1]);
    expect(after[1]).toBe(before[0]);
  });
});
