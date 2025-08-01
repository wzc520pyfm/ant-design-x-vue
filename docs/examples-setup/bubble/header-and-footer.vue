<script setup lang="ts">
import {
  CopyOutlined,
  SyncOutlined,
  UserOutlined,
} from '@ant-design/icons-vue';
import { Bubble } from 'ant-design-x-vue';
import { Button, Space, theme, message as messageAnt } from 'ant-design-vue';
import { h } from 'vue';

defineOptions({ name: 'AXBubbleHeaderAndFooterSetup' });

const [message, contextHolder] = messageAnt.useMessage();
const { token } = theme.useToken();

const onCopy = (textToCopy: any) => {
  if (!textToCopy) return message.success('Text is empty');
  message.success(`Text copied successfully：${textToCopy}`);
};
</script>

<template>
  <context-holder />
  <Bubble
    content="Hello, welcome to use Ant Design X! Just ask if you have any questions."
    :avatar="{ icon: h(UserOutlined) }"
  >
    <template #header="{ content }">
      <Space :size="token.paddingXXS">
        <div>{{ content }} </div>
      </Space>
    </template>
    <template #footer="{ content }">
      <Space :size="token.paddingXXS">
        <Button
          type="text"
          size="small"
          :icon="h(SyncOutlined)"
        />
        <Button
          type="text"
          size="small"
          :icon="h(CopyOutlined)"
          @click="() => onCopy(content)"
        />
      </Space>
    </template>
  </Bubble>
</template>
