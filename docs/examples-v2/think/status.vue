<script setup lang="tsx">
import { ChromeOutlined, SyncOutlined } from '@ant-design/icons-vue';
import { Button } from 'ant-design-vue';
import { Think } from 'ant-design-x-vue';
import { ref } from 'vue';

const title = ref('Complete thinking');
const loading = ref(false);

const handleClick = () => {
  loading.value = true;
  title.value = 'deep thinking';

  setTimeout(() => {
    loading.value = false;
    title.value = 'Complete thinking';
  }, 2000);
};

defineRender(() => (
  <>
    <div>
      <Button onClick={handleClick}>Run</Button>
    </div>
    <br />
    <Think title={title.value} blink loading={loading.value}>
      This is deep thinking content.
    </Think>
    <br />
    <Think
      title={title.value}
      loading={
        loading.value ? (
          <SyncOutlined style={{ fontSize: '12px', animation: 'spin 1s linear infinite' }} />
        ) : (
          false
        )
      }
      icon={<ChromeOutlined />}
    >
      Customize status icon.
    </Think>
    <style>{`
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `}</style>
  </>
));
</script>
