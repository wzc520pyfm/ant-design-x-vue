import { h, type VNode } from 'vue';
import { parseDocument } from 'htmlparser2';
import type { Element, Text, ChildNode, Document } from 'domhandler';
import type { DOMNode } from '../interface';
import type { Component } from 'vue';
import type { ComponentStreamStatus } from '../interface';

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
      children: node.children?.map((c) => toDOMNode(c)) ?? [],
    };
  }
  if (isText(node)) {
    return {
      type: 'text',
      data: node.data,
    };
  }
  return {
    type: (node as any).type,
    ...(node as any),
  };
}

function getAttribs(element: Element): Record<string, any> {
  const attrs: Record<string, any> = {};
  const a = element.attribs || {};
  for (const key in a) {
    attrs[key] = a[key];
  }
  return attrs;
}

export interface HtmlToVNodeOptions {
  components?: Record<string, Component>;
  streamStatus?: ComponentStreamStatus;
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

  const doc = parseDocument(html, { decodeEntities: true });
  const root = doc as Document;

  function walk(nodes: ChildNode[]): (VNode | string)[] {
    const result: (VNode | string)[] = [];
    for (const node of nodes) {
      const v = visit(node);
      if (v !== null && v !== undefined && v !== '') {
        result.push(v);
      }
    }
    return result;
  }

  function visit(node: ChildNode): VNode | string | null {
    if (isText(node)) {
      const text = node.data || '';
      return text.trim() ? text : '';
    }
    if (!isElement(node)) return null;

    const element = node;
    const tagName = element.name?.toLowerCase() || element.name;
    const CustomComponent = components[tagName];
    const attribs = getAttribs(element);
    const childNodes = walk(element.children || []);

    if (CustomComponent) {
      const domNode = toDOMNode(node);
      const props = {
        domNode,
        streamStatus,
        ...attribs,
        children: childNodes.length ? childNodes : undefined,
      };
      return h(CustomComponent, props, () => childNodes) as VNode;
    }

    return h(element.name, attribs, childNodes) as VNode;
  }

  const children = walk(root.children || []);
  return children.filter((c): c is VNode => c !== '' && typeof c === 'object') as VNode[];
}

export default htmlToVNode;
