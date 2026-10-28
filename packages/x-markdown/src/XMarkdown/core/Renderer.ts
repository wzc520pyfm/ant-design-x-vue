import type { VNode } from 'vue';
import { htmlToVNode, type HtmlToVNodeOptions } from './htmlToVNode';

/**
 * Turn sanitized HTML into VNodes, replacing mapped tags with Vue components.
 * Aligned with `@ant-design/x-markdown`'s Renderer.
 */
export class Renderer {
  private readonly options: HtmlToVNodeOptions;

  constructor(options: HtmlToVNodeOptions = {}) {
    this.options = options;
  }

  public render(html: string): VNode[] {
    return htmlToVNode(html, this.options);
  }
}

export default Renderer;
