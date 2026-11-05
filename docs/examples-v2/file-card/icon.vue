<script setup lang="tsx">
defineOptions({ name: 'AXFileCardIconV2' });

import { FileCard } from 'ant-design-x-vue';
import { Flex } from 'ant-design-vue';
import { AndroidOutlined } from '@ant-design/icons-vue';

defineRender(() => (
  <Flex vertical gap="middle">
    <FileCard icon="pdf" name="txt-file.txt" byte={1024} />
    <FileCard
      icon={<AndroidOutlined style={{ fontSize: '36px', color: '#22b35e' }} />}
      name="android-file.apk"
      byte={1024}
    />
  </Flex>
));
</script>
