import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { h } from 'vue';
import Prompts from '../index';

const mockData = [
  {
    key: '1',
    label: 'Label 1',
    description: 'Description 1',
    icon: h('span', 'Icon 1'),
    disabled: false,
  },
  {
    key: '2',
    label: 'Label 2',
    description: 'Description 2',
    icon: h('span', 'Icon 2'),
    disabled: true,
  },
];

const nestedData = [
  {
    key: 'parent',
    label: 'Parent Label',
    description: 'Parent Description',
    children: [
      {
        key: 'child1',
        label: 'Child 1',
        description: 'Child Description 1',
      },
      {
        key: 'child2',
        label: 'Child 2',
        description: 'Child Description 2',
        disabled: true,
      },
    ],
  },
];

describe('Prompts keyboard a11y', () => {
  it('exposes clickable items as native buttons when onItemClick is set', () => {
    const onItemClick = vi.fn();
    const wrapper = mount(Prompts, {
      props: { items: mockData, onItemClick },
    });
    const buttons = wrapper.findAll('button.ant-prompts-item');
    expect(buttons).toHaveLength(2);
    expect((buttons[0].element as HTMLButtonElement).type).toBe('button');
    expect((buttons[1].element as HTMLButtonElement).disabled).toBe(true);
    wrapper.unmount();
  });

  it('does not render buttons without an onItemClick callback', () => {
    const wrapper = mount(Prompts, { props: { items: mockData } });
    expect(wrapper.findAll('button')).toHaveLength(0);
    expect(wrapper.findAll('div.ant-prompts-item')).toHaveLength(2);
    wrapper.unmount();
  });

  it('fires onItemClick from a button click (Enter/Space activate natively)', async () => {
    const onItemClick = vi.fn();
    const wrapper = mount(Prompts, {
      props: { items: mockData, onItemClick },
    });
    await wrapper.get('button.ant-prompts-item').trigger('click');
    expect(onItemClick).toHaveBeenCalledWith({ data: mockData[0] });
    wrapper.unmount();
  });

  it('does not fire onItemClick for disabled buttons', async () => {
    const onItemClick = vi.fn();
    const wrapper = mount(Prompts, {
      props: { items: mockData, onItemClick },
    });
    const disabled = wrapper.findAll('button.ant-prompts-item')[1];
    await disabled.trigger('click');
    await disabled.trigger('keydown', { key: 'Enter' });
    await disabled.trigger('keydown', { key: ' ' });
    expect(onItemClick).not.toHaveBeenCalled();
    wrapper.unmount();
  });

  it('does not expose nested parent items as buttons', async () => {
    const onItemClick = vi.fn();
    const wrapper = mount(Prompts, {
      props: { items: nestedData, onItemClick },
    });

    expect(wrapper.find('.ant-prompts-item-has-nest').element.tagName).toBe('DIV');
    const childButtons = wrapper.findAll('button.ant-prompts-item');
    expect(childButtons).toHaveLength(2);
    expect(childButtons[0].text()).toContain('Child 1');

    await wrapper.get('.ant-prompts-item-has-nest').trigger('click');
    expect(onItemClick).not.toHaveBeenCalled();

    await childButtons[0].trigger('click');
    expect(onItemClick).toHaveBeenCalledWith({ data: nestedData[0].children![0] });
    wrapper.unmount();
  });
});
