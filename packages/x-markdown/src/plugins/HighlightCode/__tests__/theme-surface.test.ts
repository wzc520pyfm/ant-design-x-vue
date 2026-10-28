import { ConfigProvider, theme } from 'ant-design-vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { h } from 'vue';
import HighlightCode from '../HighlightCode.vue';

describe('HighlightCode surface', () => {
  it('uses the dark container token instead of a hardcoded white card', () => {
    const wrapper = mount(ConfigProvider, {
      props: { theme: { algorithm: theme.darkAlgorithm } },
      slots: {
        default: () => h(HighlightCode, { lang: 'js', children: 'const answer = 42' }),
      },
    });
    const code = wrapper.find('[class*="highlightCode-code"]');
    expect(code.exists(), wrapper.html()).toBe(true);
    const background = code.attributes('style') || '';
    expect(background.toLowerCase()).not.toContain('#fff');
    expect(background).not.toContain('rgb(255, 255, 255)');
    expect(code.classes().some((name) => name.endsWith('highlightCode-code-dark'))).toBe(true);
    wrapper.unmount();
  });
});
