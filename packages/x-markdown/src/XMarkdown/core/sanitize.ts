import type { Config as DOMPurifyConfig } from 'dompurify';
import DOMPurify from 'dompurify';
import { buildDomPurifyConfig } from './htmlToVNode';

/**
 * Sanitize parsed markdown HTML.
 *
 * In SSR/Node environments DOMPurify has no DOM and exposes no `sanitize`
 * method. Returning raw HTML there would let markdown such as
 * `<img src=x onerror="...">` execute in the server-rendered page, so callers
 * must skip rendering that section instead (align React @ant-design/x-markdown).
 */
export function sanitizeMarkdownHtml(
  html: string,
  components?: Record<string, unknown>,
  userConfig?: DOMPurifyConfig,
): string | null {
  if (typeof DOMPurify.sanitize !== 'function') {
    return null;
  }
  return DOMPurify.sanitize(
    html,
    buildDomPurifyConfig(components, userConfig) as any,
  ) as unknown as string;
}
