import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent, h } from 'vue';
import type { Token } from '../interface';
import XMarkdown from '../XMarkdown.vue';

const testCases = [
  {
    title: 'Render basic text',
    markdown: 'Hello world!',
    tag: 'p',
    htmlContains: ['Hello world!'],
  },
  {
    title: 'Render heading1',
    markdown: '# Heading 1',
    tag: 'h1',
    htmlContains: ['Heading 1'],
  },
  {
    title: 'Render heading2',
    markdown: '## Heading 2',
    tag: 'h2',
    htmlContains: ['Heading 2'],
  },
  {
    title: 'Render heading6',
    markdown: '###### Heading 6',
    tag: 'h6',
    htmlContains: ['Heading 6'],
  },
  {
    title: 'Render unordered list',
    markdown: '- Item 1\n- Item 2\n- Item 3',
    htmlContains: ['Item 1', 'Item 2', 'Item 3'],
    tag: 'ul',
  },
  {
    title: 'Render ordered list',
    markdown: '1. First\n2. Second\n3. Third',
    htmlContains: ['First', 'Second', 'Third'],
    tag: 'ol',
  },
  {
    title: 'Render code span',
    markdown: 'this is `codespan`',
    htmlContains: ['codespan'],
    tag: 'code',
  },
  {
    title: 'Render code block',
    markdown: '```javascript\nconsole.log(`hello`);\n```\n',
    htmlContains: ['console.log', 'language-javascript'],
  },
  {
    title: 'Render link',
    markdown: '[Google](https://www.google.com)',
    htmlContains: ['Google'],
    href: 'https://www.google.com',
  },
  {
    title: 'Render image',
    markdown: '![logo](https://example.com/logo.png)',
    alt: 'logo',
    src: 'https://example.com/logo.png',
  },
  {
    title: 'Render bold and italic',
    markdown: 'This is **bold** and *italic* text',
    htmlContains: ['bold', 'italic'],
  },
  {
    title: 'Render blockquote',
    markdown: '> This is a quote',
    tag: 'blockquote',
    htmlContains: ['This is a quote'],
  },
  {
    title: 'Render horizontal rule',
    markdown: '---',
    tag: 'hr',
  },
  {
    title: 'Render del',
    markdown: '~del~',
    tag: 'del',
    htmlContains: ['del'],
  },
  {
    title: 'Render table',
    markdown: `| Month    | Savings |
| -------- | ------- |
| January  | $250    |
| February | $80     |
| March    | $420    |`,
    tag: 'table',
    htmlContains: ['January', '$250', 'March'],
  },
  {
    title: 'Render checkbox',
    markdown: '- [ ] checkbox',
    htmlContains: ['checkbox'],
  },
  {
    title: 'Render escape',
    markdown: '\\>',
    htmlContains: ['>'],
  },
  {
    title: 'Render Html',
    markdown: '<div>hello</div>',
    htmlContains: ['hello'],
  },
  {
    title: 'Render inline Html',
    markdown: 'inline: <span>hello</span>',
    htmlContains: ['inline:', 'hello'],
  },
];

describe('XMarkdown', () => {
  it('content undefined renders nothing', () => {
    const wrapper = mount(XMarkdown, { props: { content: undefined } });
    expect(wrapper.find('.x-markdown').exists()).toBe(false);
    expect(wrapper.text()).toBe('');
  });

  it('children undefined renders nothing', () => {
    const wrapper = mount(XMarkdown, { props: { children: undefined } });
    expect(wrapper.find('.x-markdown').exists()).toBe(false);
    expect(wrapper.text()).toBe('');
  });

  testCases.forEach((tc) => {
    it(`common markdown case: ${tc.title}`, () => {
      const wrapper = mount(XMarkdown, {
        props: { content: tc.markdown },
      });
      const root = wrapper.find('.x-markdown');
      expect(root.exists()).toBe(true);

      if ('html' in tc && tc.html) {
        expect(root.element.innerHTML).toBe(tc.html);
      }
      if (tc.tag) {
        expect(wrapper.find(tc.tag).exists()).toBe(true);
      }
      if (tc.htmlContains) {
        for (const part of tc.htmlContains) {
          expect(wrapper.html()).toContain(part);
        }
      }
      if (tc.href) {
        expect(wrapper.find('a').attributes('href')).toBe(tc.href);
      }
      if (tc.alt) {
        expect(wrapper.find('img').attributes('alt')).toBe(tc.alt);
      }
      if (tc.src) {
        expect(wrapper.find('img').attributes('src')).toBe(tc.src);
      }
    });
  });

  it('render custom components', () => {
    const Custom = defineComponent({
      name: 'CustomComponent',
      setup(_, { slots }) {
        return () => h('span', 'change Line to span');
      },
    });
    const wrapper = mount(XMarkdown, {
      props: {
        content: 'custom component <custom-component>This is Line</custom-component>',
        components: { 'custom-component': Custom },
      },
    });
    expect(wrapper.html()).toContain('change Line to span');
  });

  it('walkTokens', () => {
    const walkTokens = (token: Token) => {
      if (token.type === 'heading') {
        token.depth = (token.depth || 0) + 1;
      }
    };
    const wrapper = mount(XMarkdown, {
      props: {
        content: '# heading',
        config: { walkTokens },
      },
    });
    expect(wrapper.find('h2').exists()).toBe(true);
  });

  it('custom className', () => {
    const wrapper = mount(XMarkdown, {
      props: { content: 'Test', className: 'custom-class' },
    });
    expect(wrapper.classes()).toContain('custom-class');
  });

  it('custom style', () => {
    const wrapper = mount(XMarkdown, {
      props: {
        content: 'Test',
        style: { backgroundColor: 'red' },
      },
    });
    expect(
      (wrapper.element as HTMLElement).style.backgroundColor,
    ).toBe('red');
  });

  it('should render paragraphs with custom tag when paragraphTag is provided', () => {
    const wrapper = mount(XMarkdown, {
      props: { content: 'This is a paragraph.', paragraphTag: 'div' },
    });
    expect(wrapper.classes()).toContain('x-markdown');
    expect(wrapper.find('div').text()).toBe('This is a paragraph.');
    // Vue scoped attrs may appear on nodes; assert structure, not exact HTML string.
    expect(wrapper.find('p').exists()).toBe(false);
  });

  it('support checkbox is checked', () => {
    const wrapper = mount(XMarkdown, {
      props: { content: '- [x] checkbox' },
    });
    const input = wrapper.find('input[type="checkbox"]');
    expect(input.exists()).toBe(true);
    expect(input.attributes()).toHaveProperty('checked');
  });

  it('support checkbox not checked', () => {
    const wrapper = mount(XMarkdown, {
      props: { content: '- [ ] checkbox' },
    });
    const input = wrapper.find('input[type="checkbox"]');
    expect(input.exists()).toBe(true);
    expect(input.attributes()).not.toHaveProperty('checked');
  });

  describe('openLinksInNewTab', () => {
    it('adds target and rel when true', () => {
      const wrapper = mount(XMarkdown, {
        props: {
          content: '[Google](https://www.google.com "Google Search")',
          openLinksInNewTab: true,
        },
      });
      const link = wrapper.find('a');
      expect(link.attributes('href')).toBe('https://www.google.com');
      expect(link.attributes('target')).toBe('_blank');
      expect(link.attributes('rel')).toBe('noopener noreferrer');
      expect(link.attributes('title')).toBe('Google Search');
      expect(link.text()).toBe('Google');
    });

    it('does not add target when false', () => {
      const wrapper = mount(XMarkdown, {
        props: {
          content: '[Google](https://www.google.com)',
          openLinksInNewTab: false,
        },
      });
      const link = wrapper.find('a');
      expect(link.attributes('href')).toBe('https://www.google.com');
      expect(link.attributes('target')).toBeUndefined();
      expect(link.attributes('rel')).toBeUndefined();
    });

    it('does not add target when omitted', () => {
      const wrapper = mount(XMarkdown, {
        props: { content: '[Google](https://www.google.com)' },
      });
      const link = wrapper.find('a');
      expect(link.attributes('target')).toBeUndefined();
    });
  });

  describe('animation', () => {
    it('parent is not custom components', () => {
      const wrapper = mount(XMarkdown, {
        props: {
          content: 'This is Text.',
          streaming: { enableAnimation: true },
        },
      });
      expect(wrapper.find('.x-markdown-animation-text').exists()).toBe(true);
      expect(wrapper.find('.x-markdown-animation-text').text()).toBe(
        'This is Text.',
      );
    });

    it('parent is custom components skips animation on child text', () => {
      const CustomParagraph = defineComponent({
        name: 'CustomParagraph',
        setup(_, { slots }) {
          return () => h('p', slots.default?.());
        },
      });
      const wrapper = mount(XMarkdown, {
        props: {
          content: 'This is Text.',
          components: { p: CustomParagraph },
          streaming: { enableAnimation: true },
        },
      });
      // AnimationText is skipped when parent is a custom component.
      expect(wrapper.find('.x-markdown-animation-text').exists()).toBe(false);
      expect(wrapper.text()).toContain('This is Text.');
    });
  });
});

describe('custom code component props', () => {
  const codeTestCases = [
    {
      title: 'should pass block=false and streamStatus=done for inline code',
      markdown: 'Inline `code` here',
      block: false,
      streamStatus: 'done',
    },
    {
      title:
        'should pass block=true and streamStatus=loading for unfinished fenced code blocks start ```',
      markdown: '   ```',
      block: true,
      streamStatus: 'loading',
    },
    {
      title:
        'should pass block=true and streamStatus=loading for unfinished fenced code blocks with ```',
      markdown: '```js\nconsole.log(`log`);',
      block: true,
      streamStatus: 'loading',
    },
    {
      title:
        'should pass block=true and streamStatus=done for finished fenced code blocks with ```',
      markdown: '```js\nconsole.log(`log`);\n```',
      block: true,
      streamStatus: 'done',
    },
    {
      title:
        'should pass block=true and streamStatus=done for finished fenced code blocks with surrounding text',
      markdown: 'start text\n```js\n console.log(`log`);\n```\n end text',
      block: true,
      streamStatus: 'done',
    },
    {
      title:
        'should pass block=true and streamStatus=loading for unfinished fenced code blocks start ~~~',
      markdown: '~~~',
      block: true,
      streamStatus: 'loading',
    },
    {
      title:
        'should pass block=true and streamStatus=loading for unfinished fenced code blocks with ~~~',
      markdown: '~~~js\nconsole.log(`log`);',
      block: true,
      streamStatus: 'loading',
    },
    {
      title:
        'should pass block=true and streamStatus=done for finished fenced code blocks with ~~~',
      markdown: 'start text\n ~~~js\n console.log(`log`);\n~~~\n end text',
      block: true,
      streamStatus: 'done',
    },
    {
      title: 'should pass block=true and streamStatus=done for indented code blocks',
      markdown: '    console.log(`log`);',
      block: true,
      streamStatus: 'done',
    },
  ];

  codeTestCases.forEach(({ title, markdown, block, streamStatus }) => {
    it(title, () => {
      const captured: Array<{ block?: boolean; streamStatus?: string }> = [];
      const CodeComponent = defineComponent({
        name: 'CodeSpy',
        props: {
          block: { type: Boolean, default: false },
          streamStatus: { type: String, default: 'done' },
        },
        setup(props) {
          captured.push({
            block: props.block,
            streamStatus: props.streamStatus,
          });
          return () => h('code');
        },
      });

      mount(XMarkdown, {
        props: {
          content: markdown,
          components: { code: CodeComponent },
        },
      });

      expect(captured.length).toBeGreaterThan(0);
      expect(captured[0]).toEqual(
        expect.objectContaining({ block, streamStatus }),
      );
    });
  });
});

describe('extensions', () => {
  it('should use default link renderer when user renderer returns false', () => {
    const wrapper = mount(XMarkdown, {
      props: {
        content: '[Google](https://google.com)',
        openLinksInNewTab: true,
        config: {
          renderer: {
            link() {
              return false as any;
            },
          },
        },
      },
    });
    const link = wrapper.find('a');
    expect(link.exists()).toBe(true);
    expect(link.attributes('href')).toBe('https://google.com');
    expect(link.attributes('target')).toBe('_blank');
    expect(link.attributes('rel')).toBe('noopener noreferrer');
  });

  it('should use user link renderer when it returns non-false', () => {
    const wrapper = mount(XMarkdown, {
      props: {
        content: '[Google](https://google.com)',
        config: {
          renderer: {
            link({ href, text }: any) {
              return `<a href="${href}" class="custom-link">${text}</a>`;
            },
          },
        },
      },
    });
    const link = wrapper.find('a');
    expect(link.classes()).toContain('custom-link');
    expect(link.attributes('target')).toBeUndefined();
    expect(link.text()).toBe('Google');
  });

  it('should use default paragraph renderer when user renderer returns false', () => {
    const wrapper = mount(XMarkdown, {
      props: {
        content: 'Hello',
        paragraphTag: 'div',
        config: {
          renderer: {
            paragraph() {
              return false as any;
            },
          },
        },
      },
    });
    expect(wrapper.text()).toContain('Hello');
  });

  it('should use user paragraph renderer when it returns non-false', () => {
    const wrapper = mount(XMarkdown, {
      props: {
        content: 'Hello',
        config: {
          renderer: {
            paragraph({ text }: any) {
              return `<section>${text}</section>`;
            },
          },
        },
      },
    });
    expect(wrapper.find('section').text()).toBe('Hello');
  });

  it('should use default code renderer when user renderer returns false', () => {
    const content = '```javascript\nconsole.log("javascript");\n```\n';
    const wrapper = mount(XMarkdown, {
      props: {
        content,
        config: {
          renderer: {
            code() {
              return false as any;
            },
          },
        },
      },
    });
    const codeElement = wrapper.find('code');
    expect(codeElement.exists()).toBe(true);
    expect(codeElement.attributes('data-block')).toBe('true');
    expect(codeElement.attributes('data-state')).toBe('done');
  });

  it('should use user code renderer when it returns non-false', () => {
    const content = '```js\nconsole.log(1);\n```';
    const wrapper = mount(XMarkdown, {
      props: {
        content,
        config: {
          renderer: {
            code({ lang, text }: any) {
              return `<pre><code class="lang-${lang}">${text.trim()}</code></pre>`;
            },
          },
        },
      },
    });
    const code = wrapper.find('pre code');
    expect(code.classes()).toContain('lang-js');
    expect(code.text()).toContain('console.log(1);');
    expect(code.attributes('data-block')).toBeUndefined();
  });

  it('keeps legacy plugins.transform', () => {
    const transform = vi.fn((src: string) => src.replace('foo', 'bar'));
    const wrapper = mount(XMarkdown, {
      props: {
        content: 'foo',
        plugins: [{ transform }],
      },
    });
    expect(transform).toHaveBeenCalled();
    expect(wrapper.text()).toContain('bar');
  });
});
