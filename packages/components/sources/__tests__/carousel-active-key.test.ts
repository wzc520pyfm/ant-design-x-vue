import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import CarouselCard from '../components/CarouselCard.vue';

const items = [
  { key: 'a', title: 'A' },
  { key: 'b', title: 'B' },
];

describe('Sources CarouselCard', () => {
  it('keeps the slide in sync when controlled activeKey changes', async () => {
    const wrapper = mount(CarouselCard, {
      props: {
        prefixCls: 'ant-sources',
        items,
        activeKey: 'a',
      },
    });

    expect(wrapper.find('.ant-sources-carousel-page').text()).toBe('1/2');

    await wrapper.setProps({ activeKey: 'b' });

    expect(wrapper.find('.ant-sources-carousel-page').text()).toBe('2/2');
  });
});
