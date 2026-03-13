<script setup lang="tsx">
defineOptions({ name: 'AXFileCardImageLoadingV2' });

import { FileCard } from 'ant-design-x-vue';
import { Button, Flex, Space } from 'ant-design-vue';
import { ref } from 'vue';

const loading = ref(true);
const src = ref('');

defineRender(() => (
  <Flex gap="middle" vertical>
    <Space>
      <Button
        disabled={loading.value}
        onClick={() => {
          loading.value = true;
          src.value = '';
        }}
      >
        Start Loading
      </Button>
      <Button
        onClick={() => {
          src.value = 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png';
          setTimeout(() => {
            loading.value = false;
          }, 400);
        }}
      >
        Load Complete
      </Button>
    </Space>

    <FileCard
      loading={loading.value}
      styles={{ file: { width: '200px' } }}
      spinProps={{ size: 'small' }}
      name="image-file.png"
      src={src.value ? `${src.value}?${Date.now()}` : ''}
    />
    <FileCard
      loading={loading.value}
      name="image-file.png"
      src={src.value ? `${src.value}?${Date.now()}` : ''}
    />
  </Flex>
));
</script>
