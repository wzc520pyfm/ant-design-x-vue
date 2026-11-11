import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import Conversations from '../index';
import * as isMobile from '../../_util/is-mobile';

const items = [{ key: 'demo1', label: 'Conversation one' }];
const menu = { items: [{ key: 'delete', label: 'Delete' }] };

describe('Conversations mobile menu icon', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    isMobile.resetIsMobileCache();
  });

  it('always shows the menu icon on mobile', async () => {
    vi.spyOn(isMobile, 'getIsMobile').mockReturnValue(true);
    const wrapper = mount(Conversations, { props: { items, menu } });
    await nextTick();
    expect(wrapper.find('.ant-conversations-menu-icon-mobile').exists()).toBe(true);
    wrapper.unmount();
  });

  it('keeps the hover-only menu icon on desktop', async () => {
    vi.spyOn(isMobile, 'getIsMobile').mockReturnValue(false);
    const wrapper = mount(Conversations, { props: { items, menu } });
    await nextTick();
    expect(wrapper.find('.ant-conversations-menu-icon').exists()).toBe(true);
    expect(wrapper.find('.ant-conversations-menu-icon-mobile').exists()).toBe(false);
    wrapper.unmount();
  });
});
