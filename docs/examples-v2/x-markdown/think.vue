<script setup lang="tsx">
defineOptions({ name: 'AXXMarkdownThinkV2' });

import { Think } from 'ant-design-x-vue';
import { XMarkdown } from '@ant-design-x-vue/x-markdown';

const content = '<think>Check the constraint, then answer.</think>\n\nThe answer is 42.';

defineRender(() => (
  <XMarkdown content={content} components={{ think: Think }} />
));
</script>
