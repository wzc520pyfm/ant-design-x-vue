<script setup lang="tsx">
defineOptions({ name: 'AXXMarkdownThemesV2' });

import { XMarkdown } from '@ant-design-x-vue/x-markdown';
import { Flex } from 'ant-design-vue';
import '@ant-design-x-vue/x-markdown/themes/light.css';
import '@ant-design-x-vue/x-markdown/themes/dark.css';

const content = [
  '# Theme sample',
  '',
  'Body text with a [link](https://x.ant.design).',
  '',
  '- one',
  '- two',
].join('\n');

defineRender(() => (
  <Flex gap={16} wrap="wrap">
    <div style={{ flex: '1 1 240px', padding: '12px', background: '#fff' }}>
      <XMarkdown className="x-markdown-light" content={content} />
    </div>
    <div style={{ flex: '1 1 240px', padding: '12px', background: '#141414' }}>
      <XMarkdown className="x-markdown-dark" content={content} />
    </div>
  </Flex>
));
</script>
