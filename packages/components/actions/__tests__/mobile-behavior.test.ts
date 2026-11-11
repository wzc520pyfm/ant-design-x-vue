import { CopyOutlined, MoreOutlined } from '@ant-design/icons-vue';
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { h, nextTick } from 'vue';
import Actions from '../index';
import * as isMobile from '../../_util/is-mobile';

describe('Actions mobile behavior', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    isMobile.resetIsMobileCache();
  });

  it('skips item Tooltip on mobile', async () => {
    vi.spyOn(isMobile, 'getIsMobile').mockReturnValue(true);
    const wrapper = mount(Actions, {
      props: {
        items: [{ key: 'copy', label: 'Copy', icon: h(CopyOutlined) }],
      },
    });
    await nextTick();
    expect(wrapper.findComponent({ name: 'ATooltip' }).exists()).toBe(false);
    expect(wrapper.findAll('svg').length).toBeGreaterThan(0);
    wrapper.unmount();
  });

  it('renders item Tooltip on desktop', async () => {
    vi.spyOn(isMobile, 'getIsMobile').mockReturnValue(false);
    const wrapper = mount(Actions, {
      props: {
        items: [{ key: 'copy', label: 'Copy', icon: h(CopyOutlined) }],
      },
    });
    await nextTick();
    expect(wrapper.findComponent({ name: 'ATooltip' }).exists()).toBe(true);
    wrapper.unmount();
  });

  it('uses click to open sub-menu on mobile and hover on desktop', async () => {
    const items = [
      {
        key: 'more',
        label: 'More',
        icon: h(MoreOutlined),
        subItems: [{ key: 'a', label: 'A' }],
      },
    ];

    vi.spyOn(isMobile, 'getIsMobile').mockReturnValue(true);
    const mobile = mount(Actions, { props: { items } });
    await nextTick();
    expect(mobile.findComponent({ name: 'ADropdown' }).props('trigger')).toEqual(['click']);
    mobile.unmount();
    vi.restoreAllMocks();
    isMobile.resetIsMobileCache();

    vi.spyOn(isMobile, 'getIsMobile').mockReturnValue(false);
    const desktop = mount(Actions, { props: { items } });
    await nextTick();
    expect(desktop.findComponent({ name: 'ADropdown' }).props('trigger')).toEqual(['hover']);
    desktop.unmount();
  });

  it('skips Feedback Tooltip on mobile', async () => {
    vi.spyOn(isMobile, 'getIsMobile').mockReturnValue(true);
    const wrapper = mount(Actions.Feedback);
    await nextTick();
    expect(wrapper.findComponent({ name: 'ATooltip' }).exists()).toBe(false);
    expect(wrapper.find('.ant-actions-feedback-item-like').exists()).toBe(true);
    wrapper.unmount();
  });

  it('renders Feedback Tooltip on desktop', async () => {
    vi.spyOn(isMobile, 'getIsMobile').mockReturnValue(false);
    const wrapper = mount(Actions.Feedback);
    await nextTick();
    expect(wrapper.findAllComponents({ name: 'ATooltip' }).length).toBe(2);
    wrapper.unmount();
  });
});
