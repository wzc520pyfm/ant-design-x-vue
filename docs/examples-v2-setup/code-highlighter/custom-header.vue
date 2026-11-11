<script setup lang="ts">
import { CodeHighlighter } from 'ant-design-x-vue';
import { Button, Space } from 'ant-design-vue';
import { h } from 'vue';

defineOptions({ name: 'AXCodeHighlighterCustomHeaderSetup' });

const code = `import { ref } from 'vue';

function useCounter() {
  const count = ref(0);
  const inc = () => {
    count.value += 1;
  };
  return { count, inc };
}`;

const customHeader = () =>
  h(
    'div',
    {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 16px',
        background: '#f5f5f5',
      },
    },
    [
      h(Space, null, () => [
        h('span', { style: { fontWeight: 500 } }, 'Vue 计数器示例'),
        h(
          'span',
          {
            style: {
              padding: '2px 8px',
              background: '#e6f7ff',
              borderRadius: '4px',
              fontSize: '12px',
              color: '#1890ff',
            },
          },
          'JavaScript',
        ),
      ]),
      h(Space, null, () => [
        h(Button, { size: 'small', type: 'text' }, () => '运行'),
        h(Button, { size: 'small', type: 'text' }, () => '分享'),
      ]),
    ],
  );
</script>

<template>
  <CodeHighlighter lang="javascript" :children="code" :header="customHeader" />
</template>
