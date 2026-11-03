<script setup lang="tsx">
defineOptions({ name: 'AXXMarkdownXProviderThemeV2' });

import { computed, ref } from 'vue';
import { Card, ColorPicker, Flex, Typography } from 'ant-design-vue';
import { XProvider } from 'ant-design-x-vue';
import { XMarkdown } from '@ant-design-x-vue/x-markdown';
import HighlightCode from '@ant-design-x-vue/x-markdown/plugins/HighlightCode';
import { codeRenderer } from '../_shared/markdown-code';

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
  if (!props.block) return <code class={props.className}>{text}</code>;
  return <HighlightCode lang={lang} children={text} />;
});

const colorBgTitle = ref('#d9afdf');

const theme = computed(() => ({
  token: {
    colorFillContent: colorBgTitle.value,
  },
}));

defineRender(() => (
  <>
    <Flex gap={12} style={{ marginBottom: '16px' }} align="center">
      <Typography.Text>Header fill (colorFillContent):</Typography.Text>
      <ColorPicker
        value={colorBgTitle.value}
        onChange={(value: any) => {
          colorBgTitle.value = typeof value === 'string'
            ? value
            : value?.toHexString?.() || colorBgTitle.value;
        }}
      />
    </Flex>
    <Card>
      <XProvider theme={theme.value}>
        <XMarkdown content={content} components={{ code: Code }} />
      </XProvider>
    </Card>
  </>
));
</script>
