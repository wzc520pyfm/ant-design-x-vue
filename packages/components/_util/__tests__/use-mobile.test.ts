import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h } from 'vue';
import useMobile from '../hooks/use-mobile';
import * as isMobile from '../is-mobile';

describe('useMobile', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    isMobile.resetIsMobileCache();
  });

  function mountHook() {
    const Comp = defineComponent({
      setup() {
        const mobile = useMobile();
        return () => h('div', { 'data-mobile': String(mobile.value) });
      },
    });
    return mount(Comp);
  }

  it('should return true after mount when on a mobile device', async () => {
    vi.spyOn(isMobile, 'getIsMobile').mockReturnValue(true);
    const wrapper = mountHook();
    await wrapper.vm.$nextTick();
    expect(wrapper.attributes('data-mobile')).toBe('true');
    wrapper.unmount();
  });

  it('should return false after mount when on a desktop device', async () => {
    vi.spyOn(isMobile, 'getIsMobile').mockReturnValue(false);
    const wrapper = mountHook();
    await wrapper.vm.$nextTick();
    expect(wrapper.attributes('data-mobile')).toBe('false');
    wrapper.unmount();
  });

  it('should call getIsMobile on mount', async () => {
    const spy = vi.spyOn(isMobile, 'getIsMobile').mockReturnValue(false);
    const wrapper = mountHook();
    await wrapper.vm.$nextTick();
    expect(spy).toHaveBeenCalled();
    wrapper.unmount();
  });
});
