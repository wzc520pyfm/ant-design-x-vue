import { mount, type VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, nextTick, ref } from 'vue';
import { Bubble } from 'ant-design-x-vue';

const text = 'Ant Design X - Better UI toolkit for your AI Chat WebApp.';
const text2 = 'Ant Design X - Build your AI Chat WebApp with an easier way.';

function bubbleText(wrapper: VueWrapper) {
  return wrapper.find('.ant-bubble-content').text();
}

describe('Bubble typing and fade-in animation', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('reveals string content one step at a time instead of painting the full string', async () => {
    const frames: Array<{ id: number; cb: FrameRequestCallback }> = [];
    let seq = 0;
    let now = 1000;
    vi.spyOn(performance, 'now').mockImplementation(() => now);
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      const id = ++seq;
      frames.push({ id, cb });
      return id;
    });
    vi.stubGlobal('cancelAnimationFrame', (id: number) => {
      const index = frames.findIndex((frame) => frame.id === id);
      if (index >= 0) frames.splice(index, 1);
    });

    const wrapper = mount(Bubble, {
      props: {
        content: text,
        typing: { effect: 'fade-in', interval: 50, step: 3, keepPrefix: false },
      },
    });
    await nextTick();

    const firstPaint = bubbleText(wrapper);
    expect(firstPaint.length).toBeGreaterThan(0);
    expect(firstPaint.length).toBeLessThan(text.length);
    expect(firstPaint).toBe(text.slice(0, 3));
    expect(wrapper.find('.ant-bubble-fade-in').exists()).toBe(true);
    expect(wrapper.findAll('.fade-in').length).toBeGreaterThan(0);
    expect(wrapper.find('.fade-in').text()).toBe(text.slice(0, 3));

    now += 50;
    const pending = frames.splice(0, frames.length);
    pending.forEach((frame) => frame.cb(now));
    await nextTick();

    const secondPaint = bubbleText(wrapper);
    expect(secondPaint).toBe(text.slice(0, 6));
    expect(secondPaint.length).toBeGreaterThan(firstPaint.length);

    wrapper.unmount();
  });

  it('keeps streaming when new content extends the text already on screen', async () => {
    const frames: Array<{ id: number; cb: FrameRequestCallback }> = [];
    let seq = 0;
    let now = 1000;
    vi.spyOn(performance, 'now').mockImplementation(() => now);
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      const id = ++seq;
      frames.push({ id, cb });
      return id;
    });
    vi.stubGlobal('cancelAnimationFrame', (id: number) => {
      const index = frames.findIndex((frame) => frame.id === id);
      if (index >= 0) frames.splice(index, 1);
    });

    const wrapper = mount(Bubble, {
      props: {
        content: 'Hello',
        streaming: true,
        typing: { effect: 'typing', interval: 50, step: 3, keepPrefix: true },
      },
    });
    await nextTick();
    expect(bubbleText(wrapper)).toBe('Hel');

    await wrapper.setProps({ content: 'Hello world' });
    await nextTick();
    // An append must not wipe the characters already revealed.
    expect(bubbleText(wrapper).startsWith('Hel')).toBe(true);
    expect(bubbleText(wrapper).length).toBeLessThan('Hello world'.length);

    now += 50;
    frames.splice(0, frames.length).forEach((frame) => frame.cb(now));
    await nextTick();
    expect(bubbleText(wrapper).startsWith('Hello')).toBe(true);

    wrapper.unmount();
  });

  it('restarts the animation when the effect switches or the same content is loaded again', async () => {
    const frames: Array<{ id: number; cb: FrameRequestCallback }> = [];
    let seq = 0;
    let now = 1000;
    vi.spyOn(performance, 'now').mockImplementation(() => now);
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      const id = ++seq;
      frames.push({ id, cb });
      return id;
    });
    vi.stubGlobal('cancelAnimationFrame', (id: number) => {
      const index = frames.findIndex((frame) => frame.id === id);
      if (index >= 0) frames.splice(index, 1);
    });

    const content = ref(text);
    const effect = ref<'fade-in' | 'typing'>('fade-in');
    const replay = ref(0);
    const Host = defineComponent({
      components: { Bubble },
      setup() {
        return () => (
          <Bubble
            key={replay.value}
            content={content.value}
            typing={{ effect: effect.value, interval: 50, step: 3, keepPrefix: false }}
          />
        );
      },
    });

    const wrapper = mount(Host);
    await nextTick();
    expect(bubbleText(wrapper)).toBe(text.slice(0, 3));

    // Finish the animation.
    for (let i = 0; i < text.length; i += 1) {
      now += 50;
      const pending = frames.splice(0, frames.length);
      if (!pending.length) break;
      pending.forEach((frame) => frame.cb(now));
    }
    await nextTick();
    expect(bubbleText(wrapper)).toBe(text);

    effect.value = 'typing';
    await nextTick();
    const restarted = bubbleText(wrapper);
    expect(restarted.length).toBeGreaterThan(0);
    expect(restarted.length).toBeLessThan(text.length);
    expect(wrapper.find('.ant-bubble-typing').exists()).toBe(true);

    // Drain again, then reload the same string the way the docs buttons do.
    for (let i = 0; i < text.length; i += 1) {
      now += 50;
      const pending = frames.splice(0, frames.length);
      if (!pending.length) break;
      pending.forEach((frame) => frame.cb(now));
    }
    await nextTick();
    expect(bubbleText(wrapper)).toBe(text);

    content.value = text2;
    await nextTick();
    expect(bubbleText(wrapper).startsWith(text2.slice(0, 3))).toBe(true);
    expect(bubbleText(wrapper).length).toBeLessThan(text2.length);

    replay.value += 1;
    content.value = text;
    await nextTick();
    expect(bubbleText(wrapper)).toBe(text.slice(0, 3));

    wrapper.unmount();
  });

  it('injects fade-in and typing cursor rules that match the animated nodes', () => {
    const wrapper = mount(Bubble, {
      props: {
        content: 'Hello',
        typing: { effect: 'fade-in', interval: 50, step: 1 },
      },
    });

    const css = Array.from(document.querySelectorAll('style'))
      .map((node) => node.textContent || '')
      .join('\n');

    // Hash lives on the bubble root. The animated node is a descendant, so the
    // selector must not glue the hash class onto `.ant-bubble-fade-in`.
    expect(css).toMatch(/\.ant-bubble\s+\.ant-bubble-fade-in\s+\.fade-in\{[^}]*animation-fill-mode:both/);
    expect(css).toMatch(/\.ant-bubble\s+\.ant-bubble-typing::after/);
    expect(css).toMatch(/@keyframes\s+[^{]*fadeIn/);
    expect(css).toMatch(/opacity:\s*0/);
    expect(css).toMatch(/@keyframes\s+[^{]*cursorBlink/);

    wrapper.unmount();
  });
});
