<script setup lang="tsx">
import { CodeHighlighter } from 'ant-design-x-vue';
import { Button, Space } from 'ant-design-vue';

defineOptions({ name: 'AXCodeHighlighterCustomHeader' });

const code = `import { ref } from 'vue';

function useCounter() {
  const count = ref(0);
  const inc = () => {
    count.value += 1;
  };
  return { count, inc };
}`;

const customHeader = (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px 16px',
      background: '#f5f5f5',
    }}
  >
    <Space>
      <span style={{ fontWeight: 500 }}>Vue 计数器示例</span>
      <span
        style={{
          padding: '2px 8px',
          background: '#e6f7ff',
          borderRadius: '4px',
          fontSize: '12px',
          color: '#1890ff',
        }}
      >
        JavaScript
      </span>
    </Space>
    <Space>
      <Button size="small" type="text">
        运行
      </Button>
      <Button size="small" type="text">
        分享
      </Button>
    </Space>
  </div>
);

defineRender(() => (
  <CodeHighlighter lang="javascript" header={customHeader}>
    {code}
  </CodeHighlighter>
));
</script>
