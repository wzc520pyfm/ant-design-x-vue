<script setup lang="tsx">
defineOptions({ name: 'AXSourcesInlineV2' });

import { Sources } from 'ant-design-x-vue';

const items = [
  {
    title: '1. Data source',
    key: '1',
    url: 'https://x.ant.design/components/overview',
    description:
      'Artificial Intelligence, often abbreviated as AI, is a broad branch of computer science concerned with building smart machines capable of performing tasks that typically require human intelligence.',
  },
  {
    title: '2. Data source',
    key: '2',
    url: 'https://x.ant.design/components/overview',
  },
  {
    title: '3. Data source',
    key: '3',
    url: 'https://x.ant.design/components/overview',
  },
];

defineRender(() => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <span>Use the inline mode in the text</span>
    <Sources title="1" activeKey="1" items={items} inline />
    <span>Use the inline mode in the text</span>
    <Sources title="2" activeKey="2" items={items} inline />
  </div>
));
</script>
