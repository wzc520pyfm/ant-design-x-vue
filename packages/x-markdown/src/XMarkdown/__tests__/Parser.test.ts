import { describe, expect, it } from 'vitest';
import Parser from '../core/Parser';

describe('Parser', () => {
  it('should render paragraphs with custom tag when paragraphTag is provided', () => {
    const parser = new Parser({ paragraphTag: 'div' });
    const result = parser.parse('This is a paragraph.');
    expect(result).toBe('<div>This is a paragraph.</div>\n');
  });

  it('should render paragraphs with default p tag when paragraphTag is not provided', () => {
    const parser = new Parser();
    const result = parser.parse('This is a paragraph.');
    expect(result).toBe('<p>This is a paragraph.</p>\n');
  });

  it('should render multiple paragraphs with custom tag', () => {
    const parser = new Parser({ paragraphTag: 'section' });
    const result = parser.parse(
      'This is the first paragraph.\n\nThis is the second paragraph.',
    );
    expect(result).toBe(
      '<section>This is the first paragraph.</section>\n<section>This is the second paragraph.</section>\n',
    );
  });

  describe('openLinksInNewTab', () => {
    it('should add target="_blank" and rel="noopener noreferrer" to links when openLinksInNewTab is true', () => {
      const parser = new Parser({ openLinksInNewTab: true });
      const result = parser.parse('[Example](https://example.com)');
      expect(result).toBe(
        '<p><a href="https://example.com" target="_blank" rel="noopener noreferrer">Example</a></p>\n',
      );
    });

    it('should not add target and rel attributes when openLinksInNewTab is false', () => {
      const parser = new Parser({ openLinksInNewTab: false });
      const result = parser.parse('[Example](https://example.com)');
      expect(result).toBe('<p><a href="https://example.com">Example</a></p>\n');
    });

    it('should not add target and rel attributes when openLinksInNewTab is not provided', () => {
      const parser = new Parser();
      const result = parser.parse('[Example](https://example.com)');
      expect(result).toBe('<p><a href="https://example.com">Example</a></p>\n');
    });

    it('should handle links with title attribute when openLinksInNewTab is true', () => {
      const parser = new Parser({ openLinksInNewTab: true });
      const result = parser.parse(
        '[Example](https://example.com "Example Title")',
      );
      expect(result).toBe(
        '<p><a href="https://example.com" title="Example Title" target="_blank" rel="noopener noreferrer">Example</a></p>\n',
      );
    });

    it('should handle multiple links in content', () => {
      const parser = new Parser({ openLinksInNewTab: true });
      const result = parser.parse(
        '[Link1](https://example1.com) and [Link2](https://example2.com)',
      );
      expect(result).toBe(
        '<p><a href="https://example1.com" target="_blank" rel="noopener noreferrer">Link1</a> and <a href="https://example2.com" target="_blank" rel="noopener noreferrer">Link2</a></p>\n',
      );
    });

    it('should handle reference-style links', () => {
      const parser = new Parser({ openLinksInNewTab: true });
      const result = parser.parse('[Example][1]\n\n[1]: https://example.com');
      expect(result).toBe(
        '<p><a href="https://example.com" target="_blank" rel="noopener noreferrer">Example</a></p>\n',
      );
    });

    it('should work with custom marked config and openLinksInNewTab', () => {
      const parser = new Parser({
        markedConfig: { breaks: true },
        openLinksInNewTab: true,
      });
      const result = parser.parse('[Example](https://example.com)');
      expect(result).toBe(
        '<p><a href="https://example.com" target="_blank" rel="noopener noreferrer">Example</a></p>\n',
      );
    });
  });

  describe('code renderer streaming attrs', () => {
    it('marks finished fenced code as done', () => {
      const parser = new Parser();
      const result = parser.parse('```js\nconsole.log(1);\n```');
      expect(result).toContain('data-block="true"');
      expect(result).toContain('data-state="done"');
      expect(result).toContain('language-js');
    });

    it('marks unfinished fenced code as loading', () => {
      const parser = new Parser();
      const result = parser.parse('```js\nconsole.log(1);');
      expect(result).toContain('data-block="true"');
      expect(result).toContain('data-state="loading"');
    });
  });

  describe('protectCustomTagNewlines', () => {
    it('should protect newlines inside custom tags when protectCustomTagNewlines is true', () => {
      const parser = new Parser({
        protectCustomTagNewlines: true,
        components: { CustomComponent: 'div' },
      });
      const content = '<CustomComponent>First line\n\nSecond line</CustomComponent>';
      const result = parser.parse(content);
      expect(result).toContain('<CustomComponent>First line\n\nSecond line</CustomComponent>');
      expect(result).not.toMatch(/<CustomComponent>First line<\/p>\s*<p>Second line/);
    });

    it('should not protect newlines when protectCustomTagNewlines is false', () => {
      const parser = new Parser({
        protectCustomTagNewlines: false,
        components: { CustomComponent: 'div' },
      });
      const content = '<CustomComponent>First line\n\nSecond line</CustomComponent>';
      const result = parser.parse(content);
      expect(result).toContain('<p>');
    });

    it('should work normally when protectCustomTagNewlines is true but no custom components', () => {
      const parser = new Parser({
        protectCustomTagNewlines: true,
      });
      const result = parser.parse('This is a paragraph.\n\nThis is another paragraph.');
      expect(result).toBe('<p>This is a paragraph.</p>\n<p>This is another paragraph.</p>\n');
    });

    it('should keep block markdown parsing behavior when only protectCustomTagNewlines is enabled', () => {
      const parser = new Parser({
        protectCustomTagNewlines: true,
        components: { think: 'div' },
      });
      const content =
        '<think>The user is asking what I can do.\n\nKey capabilities:\n1. one\n2. two\n</think>正文内容开始';
      const result = parser.parse(content);

      expect(result).toContain('<ol>');
      expect(result).toContain('<li>one</li>');
      expect(result).toContain('正文内容开始');
    });

    it('should keep ordered list markup inside custom tags intact when disableCustomTagBlockMarkdown is enabled', () => {
      const parser = new Parser({
        disableCustomTagBlockMarkdown: true,
        components: { think: 'div' },
      });
      const content =
        '<think>The user is asking what I can do.\n\nKey capabilities:\n1. one\n2. two\n</think>正文内容开始';
      const result = parser.parse(content);

      expect(result).toContain(
        '<think>The user is asking what I can do.\n\nKey capabilities:\n1. one\n2. two\n</think>',
      );
      expect(result).toContain('正文内容开始');
      expect(result).not.toContain('<ol>');
      expect(result).not.toContain('<li>');
    });

    it('should still parse inline markdown when disableCustomTagBlockMarkdown is enabled', () => {
      const parser = new Parser({
        disableCustomTagBlockMarkdown: true,
        components: { think: 'div' },
      });
      const content = '<think>line a\n**bold**\nline c</think>tail';
      const result = parser.parse(content);

      expect(result).toContain('<think>line a\n<strong>bold</strong>\nline c</think>');
      expect(result).not.toContain('<ol>');
      expect(result).not.toMatch(/X_MD_NL_/);
    });
  });

  describe('escapeRawHtml', () => {
    it('should escape raw HTML when escapeRawHtml is true', () => {
      const parser = new Parser({ escapeRawHtml: true });
      const result = parser.parse('<div>hello</div>');
      // encode mode also escapes `/` → &#x2F; (align React escapeHtml)
      expect(result).toContain('&lt;div&gt;hello&lt;');
      expect(result).toContain('div&gt;');
      expect(result).toContain('hello');
      expect(result).not.toContain('<div>hello</div>');
    });

    it('should leave raw HTML when escapeRawHtml is false', () => {
      const parser = new Parser({ escapeRawHtml: false });
      const result = parser.parse('<div>hello</div>');
      expect(result).toContain('<div>hello</div>');
    });
  });

});
