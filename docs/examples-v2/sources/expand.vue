<script setup lang="tsx">
defineOptions({ name: 'AXSourcesExpandV2' });

import { Sources } from 'ant-design-x-vue';
import { Button } from 'ant-design-vue';
import { ref } from 'vue';

const items = [
  {
    title: '1. Data source',
    url: 'https://x.ant.design/components/overview',
  },
  {
    title: '2. Data source',
    url: 'https://x.ant.design/components/overview',
  },
  {
    title: '3. Data source',
    url: 'https://x.ant.design/components/overview',
  },
];

const expanded = ref(true);

defineRender(() => (
  <>
    <Button onClick={() => (expanded.value = !expanded.value)} style={{ marginBottom: '8px' }}>
      Change expand
    </Button>
    <br />
    <Sources
      title="Used 3 sources"
      items={items}
      expanded={expanded.value}
      onExpand={(val: boolean) => {
        expanded.value = val;
      }}
    />
  </>
));
</script>
