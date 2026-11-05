import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { Bubble } from 'ant-design-x-vue';

describe('Bubble variant and loading styles', () => {
  it('injects filled, round, and loading-dot rules', () => {
    const filled = mount(Bubble, {
      props: { content: 'filled - round', variant: 'filled', shape: 'round' },
    });
    expect(filled.html()).toContain('ant-bubble-content-filled');
    expect(filled.html()).toContain('ant-bubble-content-round');

    const loading = mount(Bubble, {
      props: { content: 'hello', loading: true },
    });
    expect(loading.html()).toContain('ant-bubble-dot-item');

    const css = Array.from(document.querySelectorAll('style'))
      .map((node) => node.textContent || '')
      .join('\n');
    expect(css).toMatch(/ant-bubble-content-filled\{[^}]*background/);
    expect(css).toMatch(/ant-bubble-content-round\{[^}]*border-radius/);
    expect(css).toMatch(/ant-bubble-dot-item\{[^}]*width:4px/);

    filled.unmount();
    loading.unmount();
  });
});
