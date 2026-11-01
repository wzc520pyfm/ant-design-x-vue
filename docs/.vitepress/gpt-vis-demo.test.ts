import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { parse } from '../node_modules/@antv/gpt-vis/dist/esm/syntax/parser.js';
import { splitVisMarkdown, toRenderSyntax } from '../shared/vis-markdown';

const docsRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const demoFiles = [
  'examples/bubble/gpt-vis.vue',
  'examples-setup/bubble/gpt-vis.vue',
  'examples-v2/bubble/gpt-vis.vue',
  'examples-v2-setup/bubble/gpt-vis.vue',
];

const haidilao = `
vis line
data
  - time 2013
    value 59.3
  - time 2014
    value 64.4
  - time 2022
    value 121
title Haidilao delivery revenue
axisXTitle year
axisYTitle sale
`.trim();

describe('Bubble GPT-Vis demos', () => {
  it('parses the Haidilao vis line block into a line chart config', () => {
    const config = parse(haidilao);
    expect(config.type).toBe('line');
    expect(config.axisXTitle).toBe('year');
    expect(config.axisYTitle).toBe('sale');
    expect(config.title).toBe('Haidilao delivery revenue');
    const data = config.data as Array<{ time: number; value: number }>;
    expect(data[0]).toEqual({ time: 2013, value: 59.3 });
    expect(data.at(-1)).toEqual({ time: 2022, value: 121 });
  });

  it('keeps a partial stream renderable and drops an unfinished point', () => {
    const partial = `
vis line
data
  - time 2013
    value 59.3
  - time 2014
`.trim();
    const syntax = toRenderSyntax(partial);
    expect(syntax).toContain('value 59.3');
    expect(syntax).not.toContain('2014');
    expect(parse(syntax).type).toBe('line');

    const message = `Intro\n\n\`\`\`vis\n${partial}`;
    const parts = splitVisMarkdown(message);
    expect(parts.before).toBe('Intro\n\n');
    expect(parts.syntax.trim().startsWith('vis line')).toBe(true);
    expect(parts.after).toBe('');
    expect(toRenderSyntax('vis li')).toBe('');
  });

  it('shows a Vue GPTVis chart instead of a React-only note', () => {
    const page = fs.readFileSync(path.join(docsRoot, 'component/bubble.md'), 'utf8');
    expect(page).toContain('@antv/gpt-vis');
    expect(page).toContain('contentRender');
    expect(page).not.toContain('没有内置 GPT-Vis');
    expect(page).not.toContain('仅支持');
    expect(page).not.toContain('no support');

    const viteConfig = fs.readFileSync(path.join(docsRoot, '.vitepress/config.mts'), 'utf8');
    expect(viteConfig).toContain("find: /^@antv\\/gpt-vis$/");
    expect(viteConfig).toContain('shared/gpt-vis-line.ts');
    const lineEntry = fs.readFileSync(path.join(docsRoot, 'shared/gpt-vis-line.ts'), 'utf8');
    expect(lineEntry).toContain('@antv/gpt-vis/dist/esm/vis/line/index.js');
    expect(lineEntry).not.toMatch(/from '@antv\/gpt-vis'/);

    for (const file of demoFiles) {
      const source = fs.readFileSync(path.join(docsRoot, file), 'utf8');
      expect(source, file).toContain('new GPTVis');
      expect(source, file).toContain("import('@antv/gpt-vis')");
      expect(source, file).toContain('vis line');
      expect(source, file).toContain('value 59.3');
      expect(source, file).toContain('value 121');
      expect(source, file).toContain('chart?.destroy()');
      expect(source, file).toContain('Re-Render');
      expect(source, file).not.toMatch(/React-only|only support React|vis-chart|没有内置/);
    }
  });
});
