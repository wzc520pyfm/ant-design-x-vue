<script setup lang="ts">
defineOptions({ name: 'AXXMarkdownXProviderThemeV2Setup' });

import { computed, h, ref } from 'vue';
import { Card, Flex, Typography } from 'ant-design-vue';
import { XProvider } from 'ant-design-x-vue';
import { XMarkdown } from '@ant-design-x-vue/x-markdown';
import HighlightCode from '@ant-design-x-vue/x-markdown/plugins/HighlightCode';
import { codeRenderer } from '../../examples-v2/_shared/markdown-code';

const content = [
  "Here's a Python example:",
  '',
  '```python',
  'def fibonacci(n):',
  '    if n <= 1:',
  '        return n',
  '    a, b = 0, 1',
  '    for _ in range(2, n + 1):',
  '        a, b = b, a + b',
  '    return b',
  '',
  'print(fibonacci(10))',
  '```',
].join('\n');

const Code = codeRenderer((props, lang, text) => {
  if (!props.block) return h('code', { class: props.className }, text);
  return h(HighlightCode, { lang, children: text });
});

const colorBgTitle = ref('#d9afdf');

const theme = computed(() => ({
  token: {
    colorFillContent: colorBgTitle.value,
  },
}));

function onColorChange(e: Event) {
  colorBgTitle.value = (e.target as HTMLInputElement).value;
}

const components = { code: Code };
</script>

<template>
  <div>
    <Flex :gap="12" style="margin-bottom: 16px" align="center">
      <Typography.Text>Header fill (colorFillContent):</Typography.Text>
      <!-- ant-design-vue@4.2.6 has no ColorPicker export; match x-provider theme demo. -->
      <input type="color" :value="colorBgTitle" @input="onColorChange" />
    </Flex>
    <Card>
      <XProvider :theme="theme">
        <XMarkdown :content="content" :components="components" />
      </XProvider>
    </Card>
  </div>
</template>
