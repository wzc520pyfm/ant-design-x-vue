<script setup lang="tsx">
defineOptions({ name: 'AXXMarkdownMermaidV2' });

import { XMarkdown } from '@ant-design-x-vue/x-markdown';
import Mermaid from '@ant-design-x-vue/x-markdown/plugins/Mermaid';
import { codeRenderer } from '../_shared/markdown-code';

const isClient = typeof window !== 'undefined';

const content = [
  '```mermaid',
  'graph TD',
  '  A[Start] --> B[Answer]',
  '```',
].join('\n');

const Code = codeRenderer((props, lang, text) => {
  if (lang === 'mermaid') return <Mermaid children={text} />;
  return <code class={props.className}>{text}</code>;
});

defineRender(() => (
  isClient
    ? <XMarkdown content={content} components={{ code: Code }} />
    : <pre>{content}</pre>
));
</script>
