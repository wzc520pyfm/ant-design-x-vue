import { describe, expect, it } from 'vitest';
import { sanitizeMarkdownHtml } from '../core/sanitize';

describe('sanitizeMarkdownHtml', () => {
  it('removes scripts, event handlers and javascript: URLs', () => {
    const html = sanitizeMarkdownHtml(
      '<img src="x" onerror="alert(1)"><script>alert(1)</script><a href="javascript:alert(1)">x</a>',
    );
    expect(html).not.toBeNull();
    expect(html).not.toContain('<script');
    expect(html).not.toContain('onerror');
    expect(html).not.toContain('javascript:');
  });

  it('keeps registered custom component tags', () => {
    const html = sanitizeMarkdownHtml('<my-widget data-x="1">hi</my-widget>', {
      'my-widget': {},
    });
    expect(html).toContain('my-widget');
  });
});
