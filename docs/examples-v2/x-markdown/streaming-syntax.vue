<script setup lang="tsx">
defineOptions({ name: 'AXXMarkdownStreamingSyntaxV2' });

import { computed, ref } from 'vue';
import { XMarkdown, type ComponentProps } from '@ant-design-x-vue/x-markdown';
import { Button, Flex } from 'ant-design-vue';

const full = 'Read the [guide](https://x.ant.design) before you ship.';
const content = ref('Read the [guide](https://x.ant.des');
const open = ref(true);

const IncompleteLink = (props: ComponentProps) => {
  const raw = decodeURIComponent(String(props['data-raw'] || ''));
  return <span style={{ color: '#8c8c8c' }}>{raw}</span>;
};

const streaming = computed(() => (
  open.value
    ? {
        hasNextChunk: true,
        enableAnimation: true,
        incompleteMarkdownComponentMap: { link: 'incomplete-link' },
      }
    : false
));

defineRender(() => (
  <Flex vertical gap={12}>
    <Button
      onClick={() => {
        open.value = false;
        content.value = full;
      }}
    >
      Finish the link
    </Button>
    <XMarkdown
      content={content.value}
      streaming={streaming.value}
      components={{ 'incomplete-link': IncompleteLink }}
    />
  </Flex>
));
</script>
