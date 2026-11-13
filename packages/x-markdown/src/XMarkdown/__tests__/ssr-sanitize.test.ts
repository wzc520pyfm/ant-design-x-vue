// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { sanitizeMarkdownHtml } from '../core/sanitize';

describe('sanitizeMarkdownHtml in SSR', () => {
  it('returns null instead of leaking raw HTML without a DOM', () => {
    expect(sanitizeMarkdownHtml('<script>alert(1)</script>')).toBeNull();
    expect(sanitizeMarkdownHtml('<img src=x onerror="alert(1)">')).toBeNull();
  });
});
