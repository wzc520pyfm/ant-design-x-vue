import { describe, expect, it } from 'vitest';
import Parser from '../core/Parser';

/**
 * Playground demos used to rewrite `\n\n` → `<br/><br/>` before XMarkdown.
 * That destroys Markdown block boundaries (same bug as React ultramodern).
 */
describe('playground md br rewrite regression', () => {
  it('keeps ### and --- as blocks when blank lines are preserved', () => {
    const md = 'intro\n\n---\n\n### 一、X SDK 的核心组成部分\n\n1. item';
    const broken = md.replace(/\n\n/g, '<br/><br/>');
    const p = new Parser({ paragraphTag: 'div' });
    const ok = p.parse(md);
    const bad = p.parse(broken);
    expect(ok).toMatch(/<h3[\s>]/);
    expect(ok).toMatch(/<hr/i);
    // After rewriting blank lines to <br/><br/>, heading markers stay literal.
    expect(bad).toContain('###');
    expect(bad).not.toMatch(/<h3[\s>]/);
  });
});
