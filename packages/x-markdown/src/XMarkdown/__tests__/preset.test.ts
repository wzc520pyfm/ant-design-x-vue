import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { createApp, defineComponent, h, nextTick, ref } from 'vue';
import XMarkdown from '../XMarkdown.vue';
import { useStreaming } from '../hooks/useStreaming';
import { arePropsEqualIgnoringDomNode } from '../utils/memo';
import { resolveStreaming, STREAMING_OFF, STREAMING_ON } from '../utils/streaming';

describe('resolveStreaming boolean preset', () => {
  it('expands true/false to the frozen 2.10 preset', () => {
    expect(resolveStreaming(true)).toBe(STREAMING_ON);
    expect(resolveStreaming(false)).toBe(STREAMING_OFF);
    expect(STREAMING_ON).toMatchObject({
      hasNextChunk: true,
      incremental: true,
      incompleteMarkdown: 'complete',
      typewriter: true,
    });
    expect(STREAMING_OFF.hasNextChunk).toBe(false);
    expect(STREAMING_ON.tail).toBeUndefined();
  });

  it('leaves object form untouched', () => {
    const option = { hasNextChunk: true as const };
    expect(resolveStreaming(option)).toBe(option);
    expect(resolveStreaming(undefined)).toBeUndefined();
  });
});

describe('streaming boolean preset on XMarkdown', () => {
  it('streaming={true} completes open emphasis and does not show a tail by default', () => {
    const wrapper = mount(XMarkdown, {
      props: { content: 'a **b', streaming: true },
    });
    expect(wrapper.find('strong').exists()).toBe(true);
    expect(wrapper.find('strong').text()).toContain('b');
    expect(wrapper.find('.xmd-tail').exists()).toBe(false);
  });

  it('streaming object with tail: true shows the default cursor', () => {
    const wrapper = mount(XMarkdown, {
      props: {
        content: 'a **b',
        streaming: { hasNextChunk: true, incompleteMarkdown: 'complete', tail: true },
      },
    });
    expect(wrapper.find('.xmd-tail').exists()).toBe(true);
    expect(wrapper.find('.xmd-tail').text()).toBe('▋');
  });

  it('streaming={false} renders like no streaming (final content at once)', () => {
    const withFalse = mount(XMarkdown, {
      props: { content: 'a **b', streaming: false },
    });
    const plain = mount(XMarkdown, {
      props: { content: 'a **b' },
    });
    expect(withFalse.html()).toBe(plain.html());
    expect(withFalse.find('.xmd-tail').exists()).toBe(false);
  });

  it('object form without incompleteMarkdown keeps placeholder mode', () => {
    const wrapper = mount(XMarkdown, {
      props: { content: 'a **b', streaming: { hasNextChunk: true } },
    });
    // Placeholder mode: open emphasis is held back (no <strong>).
    expect(wrapper.find('strong').exists()).toBe(false);
  });
});

describe('arePropsEqualIgnoringDomNode', () => {
  it('shallow-compares every prop except domNode', () => {
    const previous = {
      children: 'const value = 1;',
      lang: 'ts',
      streamStatus: 'loading',
      domNode: { type: 'element', name: 'code' },
    };
    const next = {
      ...previous,
      domNode: { type: 'element', name: 'code' },
    };

    expect(arePropsEqualIgnoringDomNode(previous, next)).toBe(true);
    expect(
      arePropsEqualIgnoringDomNode(previous, { ...next, children: 'changed' }),
    ).toBe(false);
    expect(
      arePropsEqualIgnoringDomNode(previous, { ...next, streamStatus: 'done' }),
    ).toBe(false);
    expect(arePropsEqualIgnoringDomNode(previous, { ...next, extra: 1 })).toBe(
      false,
    );

    const withoutLang = { ...previous, lang: undefined };
    expect(
      arePropsEqualIgnoringDomNode(withoutLang, { ...next, other: 'js' }),
    ).toBe(false);
  });
});

describe('incompleteMarkdown: complete via useStreaming', () => {
  const apps: Array<ReturnType<typeof createApp>> = [];

  function mountStreaming(input: string, config: Record<string, unknown>) {
    const content = ref(input);
    const streamingOption = ref(config as any);
    let api!: ReturnType<typeof useStreaming>;
    const Comp = defineComponent({
      setup() {
        api = useStreaming({ content: content as any, streamingOption });
        return () => h('div', api.displayedContent.value);
      },
    });
    const app = createApp(Comp);
    app.mount(document.createElement('div'));
    apps.push(app);
    return api;
  }

  it('closes open emphasis as finished text', async () => {
    const api = mountStreaming('see **bold', {
      hasNextChunk: true,
      incompleteMarkdown: 'complete',
    });
    await nextTick();
    expect(api.displayedContent.value).toBe('see **bold**');
  });

  it('shows link text before the URL finishes', async () => {
    const api = mountStreaming('[docs](https://', {
      hasNextChunk: true,
      incompleteMarkdown: 'complete',
    });
    await nextTick();
    expect(api.displayedContent.value).toBe('docs');
  });

  it('explicit incompleteMarkdownComponentMap still wins over complete', async () => {
    const api = mountStreaming('[docs](https://', {
      hasNextChunk: true,
      incompleteMarkdown: 'complete',
      incompleteMarkdownComponentMap: { link: 'link-loading' },
    });
    await nextTick();
    expect(api.displayedContent.value).toContain('link-loading');
  });

  it('boolean streaming:true is accepted by useStreaming', async () => {
    const content = ref('see **bold');
    const streaming = ref(true);
    let api!: ReturnType<typeof useStreaming>;
    const Comp = defineComponent({
      setup() {
        api = useStreaming({ content: content as any, streaming });
        return () => h('div', api.displayedContent.value);
      },
    });
    const app = createApp(Comp);
    app.mount(document.createElement('div'));
    apps.push(app);
    await nextTick();
    expect(api.displayedContent.value).toBe('see **bold**');
  });
});

describe('incremental sections', () => {
  it('splits at ATX headings when incremental is on', async () => {
    const section = (i: number) =>
      `## Section ${i}\n\n${'Lorem ipsum dolor sit amet. '.repeat(8)}\n\n`;
    const doc = section(0) + section(1) + section(2);
    const content = ref(doc);
    const streamingOption = ref({
      hasNextChunk: true,
      incremental: true,
    });
    let api!: ReturnType<typeof useStreaming>;
    const Comp = defineComponent({
      setup() {
        api = useStreaming({ content: content as any, streamingOption });
        return () => h('div');
      },
    });
    const app = createApp(Comp);
    app.mount(document.createElement('div'));
    await nextTick();
    expect(api.sections.value).not.toBeNull();
    expect((api.sections.value || []).length).toBeGreaterThan(1);
    expect((api.sections.value || []).join('')).toBe(api.displayedContent.value);
    app.unmount();
  });
});
