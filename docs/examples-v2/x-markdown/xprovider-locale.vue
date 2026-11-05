<script setup lang="tsx">
defineOptions({ name: 'AXXMarkdownXProviderLocaleV2' });

import { ref } from 'vue';
import { Card, Flex, Radio, Typography } from 'ant-design-vue';
import enUS from 'ant-design-vue/es/locale/en_US';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import { XProvider, en_US, zh_CN } from 'ant-design-x-vue';
import { XMarkdown } from '@ant-design-x-vue/x-markdown';
import HighlightCode from '@ant-design-x-vue/x-markdown/plugins/HighlightCode';
import Mermaid from '@ant-design-x-vue/x-markdown/plugins/Mermaid';
import { codeRenderer } from '../_shared/markdown-code';

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
  if (lang === 'mermaid') return <Mermaid children={text} />;
  if (props.block) return <HighlightCode lang={lang} children={text} />;
  return <code class={props.className}>{text}</code>;
});

const localeType = ref<'zh' | 'en'>('zh');
const locale = ref({ ...zhCN, ...zh_CN });

const changeLocale = (e: { target: { value: 'zh' | 'en' } }) => {
  const next = e.target.value;
  localeType.value = next;
  locale.value = next === 'zh' ? { ...zhCN, ...zh_CN } : { ...enUS, ...en_US };
};

defineRender(() => (
  <>
    <Flex gap={12} style={{ marginBottom: '16px' }} align="center">
      <Typography.Text>Change locale of components:</Typography.Text>
      <Radio.Group value={localeType.value} onChange={changeLocale}>
        <Radio.Button value="en">English</Radio.Button>
        <Radio.Button value="zh">中文</Radio.Button>
      </Radio.Group>
    </Flex>
    <XProvider locale={locale.value}>
      <Card>
        {isClient
          ? <XMarkdown content={content} components={{ code: Code }} />
          : <pre>{content}</pre>}
      </Card>
    </XProvider>
  </>
));
</script>
