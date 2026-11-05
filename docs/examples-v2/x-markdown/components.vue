<script setup lang="tsx">
defineOptions({ name: 'AXXMarkdownComponentsV2' });

import { computed, ref, h } from 'vue';
import { XMarkdown } from '@ant-design-x-vue/x-markdown';
import type { ComponentProps } from '@ant-design-x-vue/x-markdown';
import { Flex, Input, theme } from 'ant-design-vue';

const { token } = theme.useToken();
const wrapStyle = computed(() => ({
  border: `1px solid ${token.value.colorBorderSecondary}`,
  borderRadius: '4px',
  padding: '16px',
  minHeight: '100px',
}));

const CustomH1 = (props: ComponentProps) => {
  return h('h1', { style: { color: '#1890ff' }, ...props }, props.children);
};

const components = {
  h1: CustomH1,
};

const content = ref(`# Custom Blue Title

## Normal H2

Paragraph with **bold** and *italic*.
`);

defineRender(() => (
  <Flex vertical gap={16}>
    <Input.TextArea v-model:value={content.value} rows={6} />
    <div style={wrapStyle.value}>
      <XMarkdown content={content.value} components={components} />
    </div>
  </Flex>
));
</script>
