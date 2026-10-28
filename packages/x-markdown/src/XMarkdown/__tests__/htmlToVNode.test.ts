import { mount } from '@vue/test-utils';
import DOMPurify from 'dompurify';
import { describe, expect, it } from 'vitest';
import { defineComponent, h } from 'vue';
import {
  buildDomPurifyConfig,
  detectUnclosedTags,
  htmlToVNode,
} from '../core/htmlToVNode';
import XMarkdown from '../XMarkdown.vue';

const CaptureBlock = defineComponent({
  name: 'CaptureBlock',
  inheritAttrs: false,
  props: {
    streamStatus: { type: String, default: 'done' },
    block: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    checked: { type: Boolean, default: false },
    children: { type: null, default: undefined },
    domNode: { type: Object, default: undefined },
  },
  setup(props, { slots }) {
    return () =>
      h(
        'div',
        {
          class: 'cap',
          'data-status': props.streamStatus,
          'data-block': String(!!props.block),
          'data-disabled': String(!!props.disabled),
          'data-checked': String(!!props.checked),
        },
        slots.default?.(),
      );
  },
});

describe('htmlToVNode', () => {
  it('marks unclosed custom tags as loading and closed tags as done', () => {
    expect(
      detectUnclosedTags('<think>partial', { think: CaptureBlock }).has(
        'think',
      ),
    ).toBe(true);

    const open = htmlToVNode('<think>partial', {
      components: { think: CaptureBlock },
    });
    const closed = htmlToVNode('<think>ready</think>', {
      components: { think: CaptureBlock },
    });

    const openWrap = mount({ render: () => h('div', open) });
    const closedWrap = mount({ render: () => h('div', closed) });

    expect(openWrap.find('.cap').attributes('data-status')).toBe('loading');
    expect(closedWrap.find('.cap').attributes('data-status')).toBe('done');
    expect(closedWrap.text()).toContain('ready');
  });

  it('passes code block and stream status through to custom code components', () => {
    const nodes = htmlToVNode(
      '<code data-block="true" data-state="loading" class="language-js">const a = 1</code>',
      { components: { code: CaptureBlock } },
    );
    const wrapper = mount({ render: () => h('div', nodes) });
    const cap = wrapper.find('.cap');
    expect(cap.attributes('data-block')).toBe('true');
    expect(cap.attributes('data-status')).toBe('loading');
    expect(cap.text()).toContain('const a = 1');
  });

  it('coerces boolean attributes', () => {
    const nodes = htmlToVNode('<input disabled checked>', {
      components: { input: CaptureBlock },
    });
    const wrapper = mount({ render: () => h('div', nodes) });
    expect(wrapper.find('.cap').attributes('data-disabled')).toBe('true');
    expect(wrapper.find('.cap').attributes('data-checked')).toBe('true');
  });

  it('fades in text when enableAnimation is set', () => {
    const nodes = htmlToVNode('<p>Hello</p>', {
      streaming: {
        enableAnimation: true,
        animationConfig: { fadeDuration: 120 },
      },
    });
    const wrapper = mount({ render: () => h('div', nodes) });
    const animated = wrapper.find('.x-markdown-animation-text');
    expect(animated.text()).toBe('Hello');
    expect(animated.attributes('style')).toContain('x-markdown-fade-in 120ms');
  });

  it('keeps custom tags when sanitizing', () => {
    const kept = String(
      DOMPurify.sanitize(
        '<think>hello</think>',
        buildDomPurifyConfig({ think: CaptureBlock }),
      ),
    );
    expect(kept).toContain('<think>');
    expect(kept).toContain('hello');

    const dropped = String(DOMPurify.sanitize('<think>hello</think>'));
    expect(dropped).not.toContain('<think>');
  });
});

describe('XMarkdown custom components', () => {
  it('renders a custom tag that DOMPurify would otherwise drop', () => {
    const wrapper = mount(XMarkdown, {
      props: {
        content: '<think>kept</think>',
        components: { think: CaptureBlock },
      },
    });
    expect(wrapper.find('.cap').text()).toContain('kept');
    expect(wrapper.find('.cap').attributes('data-status')).toBe('done');
  });
});
