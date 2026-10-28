import type { Component } from 'vue';
import type { ComponentProps } from '@ant-design-x-vue/x-markdown';

export function textOf(children: unknown): string {
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) {
    return children.map((item) => (typeof item === 'string' ? item : '')).join('');
  }
  return '';
}

export function languageOf(props: ComponentProps) {
  const className = String(props.className || props.class || '');
  return className.match(/language-(\w+)/)?.[1] || '';
}

export function codeRenderer(render: (props: ComponentProps, lang: string, text: string) => unknown) {
  const Code = (props: ComponentProps) => render(props, languageOf(props), textOf(props.children));
  return Code as Component;
}
