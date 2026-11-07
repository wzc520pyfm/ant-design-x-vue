<script setup lang="tsx">
import { EditOutlined, ShareAltOutlined } from '@ant-design/icons-vue';
import { Mermaid } from 'ant-design-x-vue';
import { Checkbox, message, Space } from 'ant-design-vue';
import { computed, ref } from 'vue';

const enableZoom = ref(true);
const enableDownload = ref(true);
const enableCopy = ref(true);
const showCustom = ref(false);

const customActions = [
  {
    key: 'edit',
    icon: EditOutlined,
    label: 'Edit',
    onItemClick: () => {
      message.info('Edit button clicked');
    },
  },
  {
    key: 'share',
    icon: ShareAltOutlined,
    label: 'Share',
    onItemClick: () => {
      message.success('Chart link copied to clipboard');
    },
  },
];

const actions = computed(() => ({
  enableZoom: enableZoom.value,
  enableDownload: enableDownload.value,
  enableCopy: enableCopy.value,
  ...(showCustom.value ? { customActions } : {}),
}));

defineRender(() => (
  <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
    <div style={{ marginBottom: 24 }}>
      <h2 style={{ marginBottom: 16, color: '#1a1a1a' }}>Header Actions Configuration</h2>
      <Space size="large" wrap>
        <Checkbox
          checked={enableZoom.value}
          onChange={(e) => {
            enableZoom.value = e.target.checked as boolean;
          }}
        >
          Enable Zoom
        </Checkbox>
        <Checkbox
          checked={enableDownload.value}
          onChange={(e) => {
            enableDownload.value = e.target.checked as boolean;
          }}
        >
          Enable Download
        </Checkbox>
        <Checkbox
          checked={enableCopy.value}
          onChange={(e) => {
            enableCopy.value = e.target.checked as boolean;
          }}
        >
          Enable Copy
        </Checkbox>
        <Checkbox
          checked={showCustom.value}
          onChange={(e) => {
            showCustom.value = e.target.checked as boolean;
          }}
        >
          Show Custom Actions
        </Checkbox>
      </Space>
    </div>

    <div style={{ border: '1px solid #f0f0f0', borderRadius: 8, overflow: 'hidden' }}>
      <Mermaid actions={actions.value}>
        {`flowchart TD
    A[Start] --> B{Decision Point}
    B -->|Yes| C[Process Data]
    B -->|No| D[Skip Processing]
    C --> E[Generate Report]
    D --> E
    E --> F[End]`}
      </Mermaid>
    </div>
  </div>
));
</script>
