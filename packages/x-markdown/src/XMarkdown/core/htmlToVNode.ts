import type { ChildNode, Document, Element, Text } from 'domhandler';
import type { Config as DOMPurifyConfig } from 'dompurify';
import { parseDocument } from 'htmlparser2';
import { h, markRaw, toRaw, type Component, type VNode } from 'vue';
import AnimationText from '../AnimationText.vue';
import type {
  ComponentStreamStatus,
  DOMNode,
  StreamingOption,
} from '../interface';

const NON_WHITESPACE_REGEX = /[^\r\n\s]+/;

function isElement(node: ChildNode): node is Element {
  return 'name' in node && 'attribs' in node;
}

function isText(node: ChildNode): node is Text {
  return 'data' in node && !('name' in node);
}

function toDOMNode(node: ChildNode): DOMNode {
  if (isElement(node)) {
    return {
      type: 'tag',
      name: node.name,
      attribs: { ...node.attribs },
      children: node.children?.map((child) => toDOMNode(child)) ?? [],
    };
  }
  if (isText(node)) {
    return {
      type: 'text',
      data: node.data,
    };
  }
  return {
    type: (node as { type?: string }).type || 'unknown',
    ...(node as object),
  };
}

function getAttribs(element: Element): Record<string, any> {
  const attrs: Record<string, any> = {};
  const source = element.attribs || {};
  for (const key in source) {
    attrs[key] = source[key];
  }
  return attrs;
}

function parentTagName(node: ChildNode): string | undefined {
  const parent = (node as { parent?: Element }).parent;
  return parent?.name?.toLowerCase();
}

/**
 * Tags that are still open in the raw HTML. Custom components for those tags
 * receive `streamStatus="loading"` (same rule as @ant-design/x-markdown).
 */
export function detectUnclosedTags(
  htmlString: string,
  components?: Record<string, unknown>,
): Set<string> {
  const unclosedTags = new Set<string>();
  if (!components) return unclosedTags;

  const stack: string[] = [];
  const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9-]*)(?:\s[^>]*)?>/g;
  let match = tagRegex.exec(htmlString);
  while (match !== null) {
    const [fullMatch, tagName] = match;
    const normalized = tagName.toLowerCase();
    const isClosing = fullMatch.startsWith('</');
    const isSelfClosing = fullMatch.endsWith('/>');

    if (components[normalized] || components[tagName]) {
      if (isClosing) {
        const lastIndex = stack.lastIndexOf(normalized);
        if (lastIndex !== -1) {
          stack.splice(lastIndex, 1);
        }
      } else if (!isSelfClosing) {
        stack.push(normalized);
      }
    }
    match = tagRegex.exec(htmlString);
  }

  stack.forEach((tag) => unclosedTags.add(tag));
  return unclosedTags;
}

/**
 * Keep custom component tags (and link targets) when DOMPurify runs.
 */
export function buildDomPurifyConfig(
  components?: Record<string, unknown>,
  userConfig?: DOMPurifyConfig,
): DOMPurifyConfig {
  const customComponents = Object.keys(components || {});
  const allowedTags = Array.isArray(userConfig?.ADD_TAGS)
    ? userConfig.ADD_TAGS
    : [];
  const addAttr = Array.isArray(userConfig?.ADD_ATTR)
    ? userConfig.ADD_ATTR
    : [];

  return {
    ...userConfig,
    ADD_TAGS: Array.from(new Set([...customComponents, ...allowedTags])),
    ADD_ATTR: Array.from(new Set(['target', 'rel', ...addAttr])),
  };
}

export interface HtmlToVNodeOptions {
  components?: Record<string, Component>;
  /**
   * Fallback status used when a custom tag is already closed.
   * Unclosed custom tags are always `'loading'`.
   */
  streamStatus?: ComponentStreamStatus;
  /**
   * Streaming options. `enableAnimation` fades in newly rendered text.
   */
  streaming?: StreamingOption | boolean;
}

/**
 * Convert HTML string to Vue VNodes with optional component replacement
 * (align with html-react-parser in @ant-design/x-markdown)
 */
export function htmlToVNode(
  html: string,
  options: HtmlToVNodeOptions = {},
): VNode[] {
  const { components = {}, streamStatus = 'done' } = options;
  if (!html || !html.trim()) return [];

  const streamingOption =
    typeof options.streaming === 'object' ? options.streaming : undefined;
  const enableAnimation = !!streamingOption?.enableAnimation;
  const unclosedTags = detectUnclosedTags(html, components);
  const doc = parseDocument(html, { decodeEntities: true });
  const root = doc as Document;

  function walk(nodes: ChildNode[]): (VNode | string)[] {
    const result: (VNode | string)[] = [];
    for (const node of nodes) {
      const visited = visit(node);
      if (visited !== null && visited !== undefined && visited !== '') {
        result.push(visited);
      }
    }
    return result;
  }

  function visit(node: ChildNode): VNode | string | null {
    if (isText(node)) {
      const text = node.data || '';
      const parentName = parentTagName(node);
      const parentIsCustom = !!(parentName && components[parentName]);
      if (
        enableAnimation &&
        NON_WHITESPACE_REGEX.test(text) &&
        !parentIsCustom
      ) {
        return h(AnimationText, {
          text,
          animationConfig: streamingOption?.animationConfig,
        });
      }
      return text.trim() ? text : '';
    }
    if (!isElement(node)) return null;

    const element = node;
    const tagName = element.name?.toLowerCase() || element.name;
    const resolved = components[tagName] || components[element.name];
    const CustomComponent = resolved ? markRaw(toRaw(resolved)) : undefined;
    const attribs = getAttribs(element);
    const childNodes = walk(element.children || []);

    if (CustomComponent) {
      const domNode = toDOMNode(node);
      const status: ComponentStreamStatus = unclosedTags.has(tagName)
        ? 'loading'
        : streamStatus;
      const classes = [attribs.className, attribs.classname, attribs.class]
        .filter(Boolean)
        .join(' ')
        .trim();
      const props: Record<string, any> = {
        domNode,
        streamStatus: status,
        ...attribs,
        ...(classes ? { class: classes, className: classes } : {}),
        ...(attribs.disabled !== undefined && { disabled: true }),
        ...(attribs.checked !== undefined && { checked: true }),
        children: childNodes.length ? childNodes : undefined,
      };

      if (tagName === 'code') {
        const block = (attribs['data-block'] ?? 'false') === 'true';
        const codeStreamStatus =
          attribs['data-state'] === 'loading' ? 'loading' : 'done';
        props.block = block;
        props.streamStatus = codeStreamStatus;
      }

      return h(CustomComponent, props, () => childNodes) as VNode;
    }

    return h(element.name, attribs, childNodes) as VNode;
  }

  const children = walk(root.children || []);
  return children.filter(
    (child): child is VNode => child !== '' && typeof child === 'object',
  );
}

export default htmlToVNode;
