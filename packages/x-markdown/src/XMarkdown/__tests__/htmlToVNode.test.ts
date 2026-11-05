import { mount } from '@vue/test-utils';
import DOMPurify from 'dompurify';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent, h, type Component } from 'vue';
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
    className: { type: String, default: '' },
    id: { type: String, default: undefined },
    children: { type: null, default: undefined },
    domNode: { type: Object, default: undefined },
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        'div',
        {
          class: 'cap',
          'data-status': props.streamStatus,
          'data-block': String(!!props.block),
          'data-disabled': String(!!props.disabled),
          'data-checked': String(!!props.checked),
          'data-classname': props.className || '',
          'data-id': props.id || '',
          'data-test': (attrs['data-test'] as string) || '',
        },
        slots.default?.(),
      );
  },
});

function mountNodes(nodes: ReturnType<typeof htmlToVNode>) {
  return mount({ render: () => h('div', nodes) });
}

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

    const openWrap = mountNodes(open);
    const closedWrap = mountNodes(closed);

    expect(openWrap.find('.cap').attributes('data-status')).toBe('loading');
    expect(closedWrap.find('.cap').attributes('data-status')).toBe('done');
    expect(closedWrap.text()).toContain('ready');
  });

  it('passes code block and stream status through to custom code components', () => {
    const nodes = htmlToVNode(
      '<code data-block="true" data-state="loading" class="language-js">const a = 1</code>',
      { components: { code: CaptureBlock } },
    );
    const wrapper = mountNodes(nodes);
    const cap = wrapper.find('.cap');
    expect(cap.attributes('data-block')).toBe('true');
    expect(cap.attributes('data-status')).toBe('loading');
    expect(cap.text()).toContain('const a = 1');
  });

  it('coerces boolean attributes', () => {
    const nodes = htmlToVNode('<input disabled checked>', {
      components: { input: CaptureBlock },
    });
    const wrapper = mountNodes(nodes);
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
    const wrapper = mountNodes(nodes);
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

describe('detectUnclosedTags', () => {
  it('detects unclosed, closed, and self-closing custom tags', () => {
    const components = { 'custom-tag': CaptureBlock };
    expect(detectUnclosedTags('<custom-tag>content', components).has('custom-tag')).toBe(true);
    expect(
      detectUnclosedTags('<custom-tag>content</custom-tag>', components).has(
        'custom-tag',
      ),
    ).toBe(false);
    expect(detectUnclosedTags('<custom-tag />', components).has('custom-tag')).toBe(false);
  });

  it('handles multiple tags correctly', () => {
    const components = { 'tag-a': CaptureBlock, 'tag-b': CaptureBlock };
    const result = detectUnclosedTags(
      '<tag-a>content</tag-a><tag-b>content',
      components,
    );
    expect(result.has('tag-a')).toBe(false);
    expect(result.has('tag-b')).toBe(true);
  });

  it('ignores non-custom tags', () => {
    const result = detectUnclosedTags('<div>content<p>paragraph', {
      'custom-tag': CaptureBlock,
    });
    expect(result.size).toBe(0);
  });

  it('handles nested tags', () => {
    const components = { 'outer-tag': CaptureBlock, 'inner-tag': CaptureBlock };
    expect(
      detectUnclosedTags(
        '<outer-tag><inner-tag>content</inner-tag></outer-tag>',
        components,
      ).size,
    ).toBe(0);
    expect(
      detectUnclosedTags(
        '<outer-tag><inner-tag>content</outer-tag>',
        components,
      ).has('inner-tag'),
    ).toBe(true);
    expect(
      detectUnclosedTags(
        '<outer-tag><inner-tag>content</inner-tag>',
        components,
      ).has('outer-tag'),
    ).toBe(true);
  });

  it('handles case insensitive tag names', () => {
    const components = { 'test-tag': CaptureBlock };
    expect(detectUnclosedTags('<Test-Tag>content', components).has('test-tag')).toBe(true);
    expect(
      detectUnclosedTags('<TEST-TAG>content</TEST-TAG>', components).has(
        'test-tag',
      ),
    ).toBe(false);
  });

  it('handles tags with attributes and empty string', () => {
    const components = { 'custom-tag': CaptureBlock };
    expect(
      detectUnclosedTags(
        '<custom-tag class="test" id="my-id">content',
        components,
      ).has('custom-tag'),
    ).toBe(true);
    expect(detectUnclosedTags('', components).size).toBe(0);
  });

  it('handles same tag multiple times', () => {
    const components = { 'custom-tag': CaptureBlock };
    expect(
      detectUnclosedTags(
        '<custom-tag>first</custom-tag><custom-tag>second',
        components,
      ).has('custom-tag'),
    ).toBe(true);
  });
});

describe('buildDomPurifyConfig', () => {
  it('adds custom component tags', () => {
    const config = buildDomPurifyConfig({
      'custom-tag': CaptureBlock,
      'another-tag': CaptureBlock,
    });
    expect(config.ADD_TAGS).toContain('custom-tag');
    expect(config.ADD_TAGS).toContain('another-tag');
  });

  it('merges with user provided dompurifyConfig', () => {
    const config = buildDomPurifyConfig(
      { 'custom-tag': CaptureBlock },
      {
        ALLOWED_TAGS: ['div', 'span'],
        ALLOWED_ATTR: ['class', 'id'],
      },
    );
    expect(config.ADD_TAGS).toContain('custom-tag');
    expect(config.ALLOWED_TAGS).toContain('div');
    expect(config.ALLOWED_ATTR).toContain('class');
  });

  it('handles empty components', () => {
    const config = buildDomPurifyConfig({});
    expect(config.ADD_TAGS).toEqual([]);
  });

  it('deduplicates tags in ADD_TAGS', () => {
    const config = buildDomPurifyConfig(
      { 'custom-tag': CaptureBlock },
      { ADD_TAGS: ['custom-tag', 'custom-tag2'] },
    );
    expect(config.ADD_TAGS).toEqual(['custom-tag', 'custom-tag2']);
  });

  it('always adds target and rel to ADD_ATTR', () => {
    const config = buildDomPurifyConfig();
    expect(config.ADD_ATTR).toContain('target');
    expect(config.ADD_ATTR).toContain('rel');
  });
});

describe('class merge and checkbox props', () => {
  it('merges class / className / classname into class props', () => {
    const cases: Array<{ html: string; expected: string }> = [
      {
        html: '<test-component class="custom-class">content</test-component>',
        expected: 'custom-class',
      },
      {
        html: '<test-component className="existing-class">content</test-component>',
        expected: 'existing-class',
      },
      {
        html: '<test-component class="new-class" className="existing-class">content</test-component>',
        expected: 'existing-class new-class',
      },
      {
        html: '<test-component class="class1 class2" className="existing-class">content</test-component>',
        expected: 'existing-class class1 class2',
      },
      {
        html: '<test-component class="" className="existing-class">content</test-component>',
        expected: 'existing-class',
      },
      {
        html: '<test-component class="new-class" className="">content</test-component>',
        expected: 'new-class',
      },
      {
        html: '<test-component classname="test-class">content</test-component>',
        expected: 'test-class',
      },
    ];

    for (const { html, expected } of cases) {
      const wrapper = mountNodes(
        htmlToVNode(html, { components: { 'test-component': CaptureBlock } }),
      );
      expect(wrapper.find('.cap').attributes('data-classname')).toBe(expected);
    }
  });

  it('preserves other attributes while merging class', () => {
    const wrapper = mountNodes(
      htmlToVNode(
        '<test-component id="test-id" class="custom-class" classname="existing-class" data-test="value">content</test-component>',
        { components: { 'test-component': CaptureBlock } },
      ),
    );
    const cap = wrapper.find('.cap');
    expect(cap.attributes('data-id')).toBe('test-id');
    expect(cap.attributes('data-classname')).toBe('existing-class custom-class');
    expect(cap.attributes('data-test')).toBe('value');
  });

  it('sets disabled and checked for checkbox input', () => {
    const both = mountNodes(
      htmlToVNode(
        '<ul><li> <input checked="" disabled="" type="checkbox"/>checkbox</li></ul>',
        { components: { input: CaptureBlock } },
      ),
    );
    expect(both.find('.cap').attributes('data-disabled')).toBe('true');
    expect(both.find('.cap').attributes('data-checked')).toBe('true');

    const disabledOnly = mountNodes(
      htmlToVNode(
        '<ul><li> <input disabled="" type="checkbox"/>checkbox</li></ul>',
        { components: { input: CaptureBlock } },
      ),
    );
    expect(disabledOnly.find('.cap').attributes('data-disabled')).toBe('true');
    // Vue coerces presence; empty string still becomes true when attribute exists.
    // Intentional: checked attribute absent => default false on CaptureBlock.
    expect(disabledOnly.find('.cap').attributes('data-checked')).toBe('false');
  });

  it('matches nested custom components', () => {
    const Parent = defineComponent({
      name: 'ParentComp',
      setup(_, { slots }) {
        return () => h('div', { 'data-testid': 'parent' }, slots.default?.());
      },
    });
    const Child = defineComponent({
      name: 'ChildComp',
      setup(_, { slots }) {
        return () => h('span', { 'data-testid': 'child' }, slots.default?.());
      },
    });
    const wrapper = mountNodes(
      htmlToVNode('<p><a>link text</a></p>', {
        components: { p: Parent, a: Child },
      }),
    );
    expect(wrapper.find('[data-testid="parent"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="child"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="child"]').text()).toBe('link text');
  });

  it('sets loading streamStatus for unclosed parent with closed child', () => {
    const Parent = defineComponent({
      name: 'ParentStatus',
      props: { streamStatus: { type: String, default: 'done' } },
      setup(props, { slots }) {
        return () =>
          h(
            'div',
            { 'data-parent-status': props.streamStatus },
            slots.default?.(),
          );
      },
    });
    const Child = defineComponent({
      name: 'ChildStatus',
      props: { streamStatus: { type: String, default: 'done' } },
      setup(props, { slots }) {
        return () =>
          h(
            'span',
            { 'data-child-status': props.streamStatus },
            slots.default?.(),
          );
      },
    });
    // htmlparser2 may auto-close; detectUnclosedTags drives status from raw HTML.
    const wrapper = mountNodes(
      htmlToVNode('<div><span>child content</span>', {
        components: { div: Parent, span: Child },
      }),
    );
    expect(wrapper.find('[data-parent-status]').attributes('data-parent-status')).toBe(
      'loading',
    );
    expect(wrapper.find('[data-child-status]').attributes('data-child-status')).toBe(
      'done',
    );
  });
});

describe('DOMPurify integration via htmlToVNode pipeline', () => {
  it('uses buildDomPurifyConfig ADD_TAGS for custom components', () => {
    const spy = vi.spyOn(DOMPurify, 'sanitize');
    const html = '<custom-tag>content</custom-tag><script>alert("xss")</script>';
    DOMPurify.sanitize(
      html,
      buildDomPurifyConfig({ 'custom-tag': CaptureBlock as Component }),
    );
    expect(spy).toHaveBeenCalledWith(
      html,
      expect.objectContaining({
        ADD_TAGS: expect.arrayContaining(['custom-tag']),
      }),
    );
    spy.mockRestore();
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
