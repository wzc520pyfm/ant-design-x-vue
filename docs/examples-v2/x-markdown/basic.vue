<script setup lang="tsx">
defineOptions({ name: 'AXXMarkdownBasicV2' });

import { ref } from 'vue';
import { XMarkdown } from '@ant-design-x-vue/x-markdown';
import { Flex, Input } from 'ant-design-vue';

const content = ref(`# Hello World

### Welcome to XMarkdown!

- Item 1
- Item 2
- Item 3

\`\`\`js
const a = 1;
\`\`\`
`);

defineRender(() => (
  <Flex vertical gap={16}>
    <Input.TextArea v-model:value={content.value} rows={8} />
    <div class="x-markdown-demo-wrap">
      <XMarkdown content={content.value} />
    </div>
  </Flex>
));
</script>

<style scoped>
.x-markdown-demo-wrap {
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 16px;
  min-height: 120px;
}
</style>
