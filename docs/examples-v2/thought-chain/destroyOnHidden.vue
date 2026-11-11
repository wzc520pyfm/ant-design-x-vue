<script setup lang="tsx">
import type { ThoughtChainProps } from 'ant-design-x-vue';
import { ThoughtChain } from 'ant-design-x-vue';
import { Button, Card, Space, Switch } from 'ant-design-vue';
import { computed, ref } from 'vue';

const expandedKeys = ref<string[]>(['task1']);
const destroyOnHidden = ref(true);

const items = computed<ThoughtChainProps['items']>(() => [
  {
    key: 'task1',
    title: 'Collapsible Task',
    description: 'Content will be removed from DOM when collapsed',
    collapsible: true,
    destroyOnHidden: destroyOnHidden.value,
    content: 'Task detail content.',
  },
  {
    key: 'task2',
    title: 'Normal Task',
    content: 'Task2 content.',
  },
]);

defineRender(() => (
  <Card style={{ width: '500px' }}>
    <Space style={{ marginBottom: '16px' }}>
      <Button
        onClick={() => {
          expandedKeys.value = expandedKeys.value.includes('task1') ? [] : ['task1'];
        }}
      >
        {expandedKeys.value.includes('task1') ? 'Collapse' : 'Expand'}
      </Button>
      <Switch
        checked={destroyOnHidden.value}
        onChange={(checked: boolean) => {
          destroyOnHidden.value = checked;
        }}
        checkedChildren="destroyOnHidden"
        unCheckedChildren="keep"
      />
    </Space>
    <ThoughtChain
      items={items.value}
      expandedKeys={expandedKeys.value}
      onExpand={(keys: string[]) => {
        expandedKeys.value = keys;
      }}
    />
  </Card>
));
</script>
