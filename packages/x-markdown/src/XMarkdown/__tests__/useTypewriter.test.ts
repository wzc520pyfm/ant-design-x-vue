import { createApp, defineComponent, h, nextTick, ref } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { alignToGrapheme, useTypewriter } from '../hooks/useTypewriter';

describe('alignToGrapheme', () => {
  it('does not cut inside a surrogate pair', () => {
    const text = 'a😀b';
    // 😀 is two UTF-16 units at index 1..2
    expect(alignToGrapheme(text, 2)).toBeGreaterThanOrEqual(2);
    expect(text.slice(0, alignToGrapheme(text, 2))).not.toMatch(/\uD83D$/);
  });
});

describe('useTypewriter', () => {
  const apps: Array<ReturnType<typeof createApp>> = [];

  afterEach(() => {
    while (apps.length) apps.pop()?.unmount();
    vi.restoreAllMocks();
  });

  it('passes content through when disabled', async () => {
    const content = ref('hello');
    const typewriter = ref(false as boolean | object);
    const active = ref(true);
    let paced = ref('');
    const Comp = defineComponent({
      setup() {
        paced = useTypewriter({ content, typewriter, active });
        return () => h('div', paced.value);
      },
    });
    const app = createApp(Comp);
    app.mount(document.createElement('div'));
    apps.push(app);
    await nextTick();
    expect(paced.value).toBe('hello');
  });

  it('passes content through when not active even if typewriter is on', async () => {
    const content = ref('hello world');
    const typewriter = ref(true as boolean | object);
    const active = ref(false);
    let paced = ref('');
    const Comp = defineComponent({
      setup() {
        paced = useTypewriter({ content, typewriter, active });
        return () => h('div', paced.value);
      },
    });
    const app = createApp(Comp);
    app.mount(document.createElement('div'));
    apps.push(app);
    await nextTick();
    expect(paced.value).toBe('hello world');
  });
});
