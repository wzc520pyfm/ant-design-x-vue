<script setup lang="ts">
defineOptions({ name: 'AXXMarkdownXProviderLocaleV2Setup' });

import { computed, h, ref } from 'vue';
import { Card, Flex, Radio, RadioButton, Typography } from 'ant-design-vue';
import enUS from 'ant-design-vue/es/locale/en_US';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import { XProvider, en_US, zh_CN } from 'ant-design-x-vue';
import { XMarkdown } from '@ant-design-x-vue/x-markdown';
import HighlightCode from '@ant-design-x-vue/x-markdown/plugins/HighlightCode';
import Mermaid from '@ant-design-x-vue/x-markdown/plugins/Mermaid';
import { codeRenderer } from '../../examples-v2/_shared/markdown-code';

const isClient = typeof window !== 'undefined';

const content = [
  '```ts',
  'export const answer = 42;',
  '```',
  '',
  '```mermaid',
  'quadrantChart',
  '    title Reach and engagement',
  '    x-axis Low Reach --> High Reach',
  '    y-axis Low Engagement --> High Engagement',
  '    quadrant-1 Expand',
  '    quadrant-2 Promote',
  '    quadrant-3 Re-evaluate',
  '    quadrant-4 Improve',
  '    Campaign A: [0.3, 0.6]',
  '    Campaign B: [0.45, 0.23]',
  '```',
].join('\n');

const Code = codeRenderer((props, lang, text) => {
  if (lang === 'mermaid') return h(Mermaid, { children: text });
  if (props.block) return h(HighlightCode, { lang, children: text });
  return h('code', { class: props.className }, text);
});

const localeType = ref<'zh' | 'en'>('zh');
const locale = computed(() =>
  localeType.value === 'zh' ? { ...zhCN, ...zh_CN } : { ...enUS, ...en_US },
);

const components = { code: Code };
</script>

<template>
  <div>
    <Flex :gap="12" style="margin-bottom: 16px" align="center">
      <Typography.Text>Change locale of components:</Typography.Text>
      <Radio.Group v-model:value="localeType">
        <RadioButton value="en">English</RadioButton>
        <RadioButton value="zh">中文</RadioButton>
      </Radio.Group>
    </Flex>
    <XProvider :locale="locale">
      <Card>
        <XMarkdown v-if="isClient" :content="content" :components="components" />
        <pre v-else>{{ content }}</pre>
      </Card>
    </XProvider>
  </div>
</template>
