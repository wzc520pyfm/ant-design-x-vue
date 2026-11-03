import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import AnimationText from '../AnimationText.vue';

describe('AnimationText', () => {
  it('should render text without requiring raf', () => {
    const wrapper = mount(AnimationText, { props: { text: 'test' } });
    expect(wrapper.text()).toBe('test');
    expect(wrapper.find('.x-markdown-animation-text').exists()).toBe(true);
  });

  it('should apply custom animation config', () => {
    const wrapper = mount(AnimationText, {
      props: {
        text: 'test',
        animationConfig: { fadeDuration: 300, easing: 'ease-in' },
      },
    });
    const style = wrapper.find('.x-markdown-animation-text').attributes('style');
    expect(style).toContain('300ms');
    expect(style).toContain('ease-in');
  });

  it('should append a new chunk when text grows as a prefix extension', async () => {
    const wrapper = mount(AnimationText, {
      props: {
        text: 'Hello',
        animationConfig: { fadeDuration: 100, easing: 'ease-in' },
      },
    });
    expect(wrapper.findAll('.x-markdown-animation-text')).toHaveLength(1);

    await wrapper.setProps({ text: 'Hello World' });
    const chunks = wrapper.findAll('.x-markdown-animation-text');
    expect(chunks.length).toBe(2);
    // Prefer textContent: VTU `.text()` trims each root node, which drops the
    // leading space that AnimationText correctly keeps in the second chunk.
    expect(chunks[0].element.textContent).toBe('Hello');
    expect(chunks[1].element.textContent).toBe(' World');
    const setupChunks = (wrapper.vm as any).$.setupState.chunks as string[];
    expect(setupChunks).toEqual(['Hello', ' World']);
  });

  it('should reset chunks when text is replaced entirely', async () => {
    const wrapper = mount(AnimationText, { props: { text: 'Hello' } });
    await wrapper.setProps({ text: 'Goodbye' });
    const chunks = wrapper.findAll('.x-markdown-animation-text');
    expect(chunks).toHaveLength(1);
    expect(chunks[0].text()).toBe('Goodbye');
  });

  it('accepts content alias prop', () => {
    const wrapper = mount(AnimationText, { props: { content: 'alias' } });
    expect(wrapper.text()).toBe('alias');
  });
});
