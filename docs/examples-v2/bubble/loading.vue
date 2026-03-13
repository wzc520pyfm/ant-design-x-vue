<script setup lang="tsx">
defineOptions({ name: 'AXBubbleLoadingV2' });

import { ref } from 'vue';
import { Bubble } from 'ant-design-x-vue';
import { Flex, Switch } from 'ant-design-vue';

const loading = ref(true);

defineRender(() => (
  <Flex gap="large" vertical>
    <Bubble loading={loading.value} content="hello world !" />
    <Flex gap="large" wrap>
      Loading state:
      <Switch checked={loading.value} onChange={(val: boolean) => (loading.value = val)} />
    </Flex>
  </Flex>
));
</script>
