<script setup lang="tsx">
defineOptions({ name: 'AXXMarkdownLatexV2' });

import { XMarkdown } from '@ant-design-x-vue/x-markdown';
import Latex from '@ant-design-x-vue/x-markdown/plugins/Latex';

const content = [
  'Pythagoras: $a^2 + b^2 = c^2$.',
  '',
  '$$',
  'S = \\pi r^2',
  '$$',
].join('\n');

defineRender(() => (
  <XMarkdown content={content} config={{ extensions: Latex() }} />
));
</script>
