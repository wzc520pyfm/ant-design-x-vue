<script setup lang="tsx">
defineOptions({ name: 'AXXMarkdownSourcesV2' });

import { onUnmounted, ref, watchEffect } from 'vue';
import { Bubble, Sources } from 'ant-design-x-vue';
import { XMarkdown, type ComponentProps } from '@ant-design-x-vue/x-markdown';
import { Button, Flex } from 'ant-design-vue';
import { textOf } from '../_shared/markdown-code';

const text = `Ant Financial has a large number of enterprise-level products.<sup>1</sup> With complex scenarios, designers and developers often need to respond fast due to frequent changes in product demands and concurrent R & D workflow.<sup>2</sup> Many similar contents exist in the process. Through abstraction, we could obtain some stable and highly reusable components and pages.<sup>3</sup>`;

const items = [
  {
    title: '1. Data source',
    key: 1,
    url: 'https://x.ant.design/components/overview',
    description:
      'Artificial Intelligence, often abbreviated as AI, is a broad branch of computer science concerned with building smart machines capable of performing tasks that typically require human intelligence.',
  },
  {
    title: '2. Data source',
    key: 2,
    url: 'https://x.ant.design/components/overview',
  },
  {
    title: '3. Data source',
    key: 3,
    url: 'https://x.ant.design/components/overview',
  },
];

const SupSource = (props: ComponentProps) => {
  const title = textOf(props.children) || '0';
  return (
    <Sources
      activeKey={parseInt(title, 10)}
      title={title}
      items={items}
      inline
    />
  );
};

const index = ref(0);
const isServer = import.meta.env.SSR;

watchEffect((onCleanup) => {
  if (isServer || index.value >= text.length) return;
  const timerId = setTimeout(() => {
    index.value = Math.min(text.length, index.value + 5);
  }, 20);
  onCleanup(() => clearTimeout(timerId));
});

onUnmounted(() => {
  index.value = text.length;
});

defineRender(() => (
  <Flex vertical gap="small">
    <Button style={{ alignSelf: 'flex-end' }} onClick={() => (index.value = 0)}>
      Re-Render
    </Button>
    <Bubble
      content={text.slice(0, index.value)}
      contentRender={(content) => (
        <XMarkdown
          content={content as string}
          components={{ sup: SupSource }}
          paragraphTag="div"
        />
      )}
      variant="outlined"
    />
  </Flex>
));
</script>
