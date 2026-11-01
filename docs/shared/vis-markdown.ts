export type VisMarkdownParts = {
  before: string;
  syntax: string;
  after: string;
};

const VIS_FENCE = /```vis\b[^\n]*\n/;

/**
 * Split a Bubble message into prose and one GPT-Vis fence.
 * An unclosed fence (still streaming) keeps the partial body as `syntax`.
 */
export function splitVisMarkdown(content: string): VisMarkdownParts {
  const matched = VIS_FENCE.exec(content);
  if (!matched || matched.index == null) {
    return { before: content, syntax: '', after: '' };
  }

  const bodyStart = matched.index + matched[0].length;
  const closeAt = content.indexOf('```', bodyStart);
  if (closeAt === -1) {
    return {
      before: content.slice(0, matched.index),
      syntax: content.slice(bodyStart),
      after: '',
    };
  }

  return {
    before: content.slice(0, matched.index),
    syntax: content.slice(bodyStart, closeAt),
    after: content.slice(closeAt + 3),
  };
}

/**
 * Drop a trailing incomplete `vis` record so `GPTVis.render` only sees points
 * that already have a numeric `value`. Returns '' until the first point is complete.
 */
export function toRenderSyntax(syntax: string): string {
  const trimmed = syntax.trim();
  if (!/^vis\s+\S+/.test(trimmed)) return '';

  const lines = trimmed.split('\n');
  let lastValue = -1;
  for (let i = 0; i < lines.length; i += 1) {
    if (/^\s*value\s+-?\d+(?:\.\d+)?\s*$/.test(lines[i])) lastValue = i;
  }
  if (lastValue < 0) return '';

  const kept = lines.slice(0, lastValue + 1);
  for (let i = lastValue + 1; i < lines.length; i += 1) {
    const line = lines[i];
    if (!line.trim()) continue;
    if (/^\s/.test(line) || line.trimStart().startsWith('-')) break;
    kept.push(line);
  }
  return kept.join('\n').trim();
}
