<script setup lang="ts">
import { EditOutlined, ShareAltOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { computed, ref } from 'vue';

defineOptions({ name: 'AXMermaidHeaderActionsV2Setup' });

const enableZoom = ref(true);
const enableDownload = ref(true);
const enableCopy = ref(true);
const showCustom = ref(false);

const customActions = [
  {
    key: 'edit',
    icon: EditOutlined,
    label: 'Edit',
    onItemClick: () => message.info('Edit button clicked'),
  },
  {
    key: 'share',
    icon: ShareAltOutlined,
    label: 'Share',
    onItemClick: () => message.success('Chart link copied to clipboard'),
  },
];

const actions = computed(() => ({
  enableZoom: enableZoom.value,
  enableDownload: enableDownload.value,
  enableCopy: enableCopy.value,
  ...(showCustom.value ? { customActions } : {}),
}));
</script>

<template>
  <div style="padding: 24px; max-width: 800px; margin: 0 auto">
    <div style="margin-bottom: 24px">
      <h2 style="margin-bottom: 16px; color: #1a1a1a">Header Actions Configuration</h2>
      <a-space size="large" wrap>
        <a-checkbox v-model:checked="enableZoom">Enable Zoom</a-checkbox>
        <a-checkbox v-model:checked="enableDownload">Enable Download</a-checkbox>
        <a-checkbox v-model:checked="enableCopy">Enable Copy</a-checkbox>
        <a-checkbox v-model:checked="showCustom">Show Custom Actions</a-checkbox>
      </a-space>
    </div>
    <div style="border: 1px solid #f0f0f0; border-radius: 8px; overflow: hidden">
      <Mermaid :actions="actions">
        {{ `flowchart TD
    A[Start] --> B{Decision Point}
    B -->|Yes| C[Process Data]
    B -->|No| D[Skip Processing]
    C --> E[Generate Report]
    D --> E
    E --> F[End]` }}
      </Mermaid>
    </div>
  </div>
</template>

<script lang="ts">
import { Mermaid } from 'ant-design-x-vue';
import { Checkbox, Space } from 'ant-design-vue';

export default {
  components: {
    Mermaid,
    ACheckbox: Checkbox,
    ASpace: Space,
  },
};
</script>
