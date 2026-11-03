import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import XMarkdown from '../../../XMarkdown/XMarkdown.vue';
import latexPlugin from '../index';

describe('LaTeX Plugin', () => {
  it('should render inline LaTeX with $..$ syntax', () => {
    const wrapper = mount(XMarkdown, {
      props: {
        content: '$E=mc^2$',
        config: { extensions: latexPlugin() },
      },
    });
    expect(wrapper.find('.katex').exists()).toBe(true);
    expect(wrapper.html()).toContain('E');
  });

  it('should render block LaTeX with $$..$$ syntax', () => {
    const wrapper = mount(XMarkdown, {
      props: {
        content: '$$\\frac{a}{b}$$',
        config: { extensions: latexPlugin() },
      },
    });
    expect(wrapper.find('.katex').exists()).toBe(true);
  });

  it('should render block LaTeX with \\[..\\] syntax', () => {
    const wrapper = mount(XMarkdown, {
      props: {
        content: '\\[\\frac{a}{b}\\]',
        config: { extensions: latexPlugin() },
      },
    });
    expect(wrapper.find('.katex').exists()).toBe(true);
  });

  it('should handle LaTeX with surrounding text', () => {
    const wrapper = mount(XMarkdown, {
      props: {
        content: 'This is an equation: $E=mc^2$ in text',
        config: { extensions: latexPlugin() },
      },
    });
    expect(wrapper.text()).toContain('This is an equation:');
    expect(wrapper.find('.katex').exists()).toBe(true);
  });

  it('should handle multiple LaTeX formulas', () => {
    const wrapper = mount(XMarkdown, {
      props: {
        content: '$a+b$ and $$\\frac{c}{d}$$',
        config: { extensions: latexPlugin() },
      },
    });
    expect(wrapper.findAll('.katex').length).toBeGreaterThanOrEqual(2);
  });

  it('should handle align* syntax replacement', () => {
    const wrapper = mount(XMarkdown, {
      props: {
        content: '$$ \\begin{align*} x &= y \\\\ y &= z \\end{align*} $$',
        config: { extensions: latexPlugin() },
      },
    });
    expect(wrapper.find('.katex').exists()).toBe(true);
    // KaTeX does not support align*; plugin rewrites to aligned.
    expect(wrapper.html()).not.toContain('align*');
  });

  it('should handle empty content', () => {
    const wrapper = mount(XMarkdown, {
      props: {
        content: '',
        config: { extensions: latexPlugin() },
      },
    });
    expect(wrapper.find('.x-markdown').exists()).toBe(false);
    expect(wrapper.text()).toBe('');
  });

  it('should handle content without LaTeX', () => {
    const wrapper = mount(XMarkdown, {
      props: {
        content: 'Just plain text',
        config: { extensions: latexPlugin() },
      },
    });
    expect(wrapper.text()).toContain('Just plain text');
    expect(wrapper.find('.katex').exists()).toBe(false);
  });

  it('should handle complex LaTeX expressions', () => {
    const wrapper = mount(XMarkdown, {
      props: {
        content: '$\\sum_{i=1}^{n} x_i = \\prod_{j=1}^{m} y_j$',
        config: { extensions: latexPlugin() },
      },
    });
    expect(wrapper.find('.katex').exists()).toBe(true);
  });

  it('should handle mixed LaTeX syntaxes', () => {
    const wrapper = mount(XMarkdown, {
      props: {
        content: 'Inline: $x^2$ and block: $$\\int_0^1 f(x)dx$$',
        config: { extensions: latexPlugin() },
      },
    });
    expect(wrapper.findAll('.katex').length).toBeGreaterThanOrEqual(2);
  });

  it('should not throw error by default on malformed latex', () => {
    expect(() =>
      mount(XMarkdown, {
        props: {
          content: 'latex: \n\n $$\n\\begin{align\n$$\n\n',
          config: { extensions: latexPlugin() },
        },
      }),
    ).not.toThrow();
  });

  it('should throw error when katexOptions.throwOnError is true', () => {
    expect(() =>
      mount(XMarkdown, {
        props: {
          content: 'latex: \n\n $$\n\\begin{align\n$$\n\n',
          config: {
            extensions: latexPlugin({ katexOptions: { throwOnError: true } }),
          },
        },
      }),
    ).toThrow();
  });

  it('should support display katex with \\[ ... \\]', () => {
    const wrapper = mount(XMarkdown, {
      props: {
        content:
          'latex: \n\\[\n\\begin{align*}\n\\text{minimize}  \\quad & f_0(x)\n\\end{align*}\n\\]',
        config: { extensions: latexPlugin() },
      },
    });
    expect(wrapper.find('.katex').exists()).toBe(true);
  });
});
