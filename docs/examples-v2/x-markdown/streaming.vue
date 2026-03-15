<script setup lang="tsx">
defineOptions({ name: 'AXXMarkdownStreamingV2' });

import { ref } from 'vue';
import { XMarkdown, useStreaming } from '@ant-design-x-vue/x-markdown';
import { Button, Flex, Space } from 'ant-design-vue';

const fullContent = `# Streaming Demo

Content appears **progressively**.

- Step 1
- Step 2
- Step 3
`;

const content = ref('');
const streaming = ref(false);
const { status, displayedContent } = useStreaming({
  content,
  streaming,
  onComplete: () => console.log('stream complete'),
});

const startStream = () => {
  content.value = '';
  streaming.value = true;
  let i = 0;
  const timer = setInterval(() => {
    if (i < fullContent.length) {
      content.value = fullContent.slice(0, i + 3);
      i += 3;
    } else {
      streaming.value = false;
      clearInterval(timer);
    }
  }, 50);
};

defineRender(() => (
  <Flex vertical gap={16}>
    <Space>
      <Button type="primary" onClick={startStream}>
        Start streaming
      </Button>
      <span>Status: {status.value}</span>
    </Space>
    <div class="x-markdown-demo-wrap">
      <XMarkdown content={displayedContent.value} streaming={streaming.value} />
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
