import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { Prompts } from 'ant-design-x-vue';

describe('Prompts text wrapping', () => {
  it('wraps cards on word boundaries instead of splitting glyphs', () => {
    const wrapper = mount(Prompts, {
      props: {
        items: [
          {
            key: '1',
            label: 'Ignite Your Creativity',
            description: 'Got any sparks for a new project?',
          },
        ],
      },
    });

    const css = Array.from(document.querySelectorAll('style'))
      .map((node) => node.textContent || '')
      .join('\n');

    expect(css).toMatch(/ant-prompts-list\{[^}]*flex-wrap:wrap/);
    expect(css).toMatch(/ant-prompts-label[^}]*word-break:normal/);
    expect(css).toMatch(/ant-prompts-label[^}]*overflow-wrap:break-word/);
    expect(css).not.toMatch(/overflow-wrap:anywhere/);
    expect(css).not.toMatch(/word-break:break-word/);
    expect(css).not.toMatch(/word-break:break-all/);

    wrapper.unmount();
  });
});
