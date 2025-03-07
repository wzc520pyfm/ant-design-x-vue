<script setup lang="ts">
import {
  CopyOutlined,
  SyncOutlined,
  UserOutlined,
} from '@ant-design/icons-vue';
import { Bubble } from 'ant-design-x-vue';
import { Button, Space, theme, Avatar } from 'ant-design-vue';
import { h } from 'vue';

defineOptions({ name: 'AXBubbleHeaderAndFooterSetup' });

const { token } = theme.useToken();
</script>

<template>
  <Bubble
    content="Hello, welcome to use Ant Design X! Just ask if you have any questions."
    :avatar="{ icon: h(UserOutlined) }"
    header="Ant Design X"
  >
    <template #footer>
      <Space :size="token.paddingXXS">
        <Button type="text" size="small" :icon="h(SyncOutlined)"></Button>
        <Button type="text" size="small" :icon="h(CopyOutlined)" />
      </Space>
    </template>
  </Bubble>
</template>
