<script setup lang="ts">
import { UserOutlined } from '@ant-design/icons-vue';
import { Flex, Switch, Avatar } from 'ant-design-vue';
import { Bubble } from 'ant-design-x-vue';
import { ref, h } from 'vue';

defineOptions({ name: 'AXBubbleLoadingSetup' });

const loading = ref(true);
</script>

<template>
  <Flex gap="large" vertical>
    <Bubble
      :loading="loading"
      content="hello world !"
      :avatar="{ icon: h(UserOutlined) }"
    />
    <Flex gap="large" wrap="wrap">
      Loading state:
      <Switch v-model:checked="loading" />
    </Flex>
  </Flex>
</template>
