<script setup lang="tsx">
defineOptions({ name: 'AXXMarkdownBasicV2' });

import { computed, ref } from 'vue';
import { Flex, Input, theme } from 'ant-design-vue';
import { XMarkdown } from '@ant-design-x-vue/x-markdown';
import '@ant-design-x-vue/x-markdown/themes/light.css';
import '@ant-design-x-vue/x-markdown/themes/dark.css';
import { isDarkColor } from '../_shared/playground-shell';

const { token } = theme.useToken();
const markdownClass = computed(() => (
  isDarkColor(token.value.colorBgContainer) ? 'x-markdown-dark' : 'x-markdown-light'
));

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
      <XMarkdown className={markdownClass.value} content={content.value} />
    </div>
  </Flex>
));
</script>

<style scoped>
.x-markdown-demo-wrap {
  border: 1px solid var(--ant-color-border-secondary, rgba(0, 0, 0, 0.06));
  border-radius: 4px;
  padding: 16px;
  min-height: 120px;
}
</style>
