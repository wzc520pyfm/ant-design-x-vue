<script setup lang="tsx">
defineOptions({ name: 'AXXMarkdownHighlightV2' });

import { XMarkdown } from '@ant-design-x-vue/x-markdown';
import HighlightCode from '@ant-design-x-vue/x-markdown/plugins/HighlightCode';
import { codeRenderer } from '../_shared/markdown-code';

const content = [
  'A fenced block picks up the language class:',
  '',
  '```ts',
  'export const answer = 42;',
  '```',
  '',
  'Inline `const x = 1` stays a plain code tag.',
].join('\n');

const Code = codeRenderer((props, lang, text) => {
  if (!props.block) return <code class={props.className}>{text}</code>;
  return <HighlightCode lang={lang} children={text} />;
});

defineRender(() => (
  <XMarkdown content={content} components={{ code: Code }} />
));
</script>
