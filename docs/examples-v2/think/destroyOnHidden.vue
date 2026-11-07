<script setup lang="tsx">
import { Button, Space, Switch } from 'ant-design-vue';
import { Think } from 'ant-design-x-vue';
import { ref } from 'vue';

const expanded = ref(true);
const destroyOnHidden = ref(true);

defineRender(() => (
  <Space direction="vertical" size={16}>
    <Space>
      <Button onClick={() => (expanded.value = !expanded.value)}>
        {expanded.value ? 'Collapse' : 'Expand'}
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
    <Think
      title="Deep Thinking"
      expanded={expanded.value}
      onExpand={(val: boolean) => {
        expanded.value = val;
      }}
      destroyOnHidden={destroyOnHidden.value}
    >
      This content will be removed from DOM when collapsed and destroyOnHidden is true.
    </Think>
  </Space>
));
</script>
