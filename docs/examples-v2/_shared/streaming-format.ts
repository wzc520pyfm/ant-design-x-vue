export interface StreamingFormatDemo {
  title: string;
  content: string;
}

/** Same samples as React `demo/streaming/format.tsx`. */
export const streamingFormatDemos: StreamingFormatDemo[] = [
  {
    title: 'Mixed',
    content: `## Ant Design X｜AI interface solution
![Ant Design X](https://mdn.alipayobjects.com/huamei_yz9z7c/afts/img/0lMhRYbo0-8AAAAAQDAAAAgADlJoAQFr/original)

Ant Design X is a comprehensive toolkit for AI applications, integrating a UI component library, streaming Markdown rendering engine, and AI SDK.

### @ant-design/x

A React UI library based on the Ant Design system, designed for **AI-driven interfaces**. [Click here for details.](/components/introduce/).

### @ant-design/x-markdown

An optimized Markdown rendering solution for **streaming content**. [Click here for details.](/x-markdowns/introduce).

### @ant-design/x-sdk

Provides a complete set of **tool APIs**. [Click here for details.](/x-sdks/introduce).
<welcome data-icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp" title="Hello, I'm Ant Design X" data-description="Base on Ant Design, AGI product interface solution, create a better intelligent vision~"></welcome>

| Repo | Description |
| ------ | ----------- |
| @ant-design/x   | A React UI library based on the Ant Design system. |
| @ant-design/x-markdown | An optimized Markdown rendering solution for **streaming content**. |
| @ant-design/x-sdk    | Provides a complete set of **tool APIs**. |
`,
  },
  {
    title: 'Link',
    content: 'Visit [Ant Design X](https://github.com/ant-design/x)  for more details.',
  },
  {
    title: 'Image',
    content:
      '![Ant Design X](https://mdn.alipayobjects.com/huamei_yz9z7c/afts/img/0lMhRYbo0-8AAAAAQDAAAAgADlJoAQFr/original)',
  },
  {
    title: 'Html',
    content: `<welcome data-icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp" title="Hello, I'm Ant Design X" data-description="Base on Ant Design, AGI product interface solution, create a better intelligent vision~"></welcome>`,
  },
  {
    title: 'Table',
    content: `
| Repo | Description |
| ------ | ----------- |
| @ant-design/x   | A React UI library based on the Ant Design system. |
| @ant-design/x-markdown | An optimized Markdown rendering solution for streaming content. |
| @ant-design/x-sdk    | Provides a complete set of tool APIs. |`,
  },
  {
    title: 'Emphasis',
    content:
      'This is **bold text** and this is *italic text*. You can also use ***bold and italic***.',
  },
  {
    title: 'InlineCode',
    content: 'Run `npm install @ant-design/x-markdown`.',
  },
];

/** React IncompleteLink: show the link label, not the raw markdown source. */
export function incompleteLinkText(raw: string) {
  const text = decodeURIComponent(raw || '');
  const linkTextMatch = text.match(/^\[([^\]]*)\]/);
  return linkTextMatch ? linkTextMatch[1] : text.slice(1);
}

export function incompleteEmphasisParts(raw: string) {
  const text = decodeURIComponent(raw || '');
  const match = text.match(/^([*_]{1,3})([^*_]*)/);
  if (!match || !match[2])
    return null;
  return { level: match[1].length, content: match[2] };
}
