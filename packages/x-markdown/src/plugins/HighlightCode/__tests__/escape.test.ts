import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import HighlightCode from '../HighlightCode.vue';

describe('HighlightCode escaping', () => {
  it('escapes raw children before highlighting resolves', async () => {
    const payload = '<img src=x onerror="alert(1)">';
    const wrapper = mount(HighlightCode, {
      props: { lang: 'not-a-registered-language', children: payload },
    });

    const code = wrapper.find('code');
    expect(code.exists()).toBe(true);
    expect(code.element.querySelector('img')).toBeNull();
    expect(code.element.innerHTML).not.toContain('<img');
    expect(code.text()).toContain(payload);

    await nextTick();
    await nextTick();
    expect(code.element.querySelector('img')).toBeNull();
    wrapper.unmount();
  });

  it('normalizes array children instead of throwing', async () => {
    const wrapper = mount(HighlightCode, {
      props: {
        lang: 'javascript',
        children: ['const answer = 42;\n'] as unknown as string,
      },
    });

    await nextTick();
    expect(wrapper.find('code').text()).toContain('const answer = 42;');
    wrapper.unmount();
  });
});
