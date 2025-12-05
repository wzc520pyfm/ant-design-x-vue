<script setup lang="ts">
import { CopyOutlined, RedoOutlined } from '@ant-design/icons-vue';
import { message as messageAnt } from 'ant-design-vue';
import { Actions, type ActionsProps } from 'ant-design-x-vue';
import { h } from 'vue';

defineOptions({ name: 'AXActionsVariantSetup' });

const [message, contextHolder] = messageAnt.useMessage();

const actionItems: ActionsProps['items'] = [
  {
    key: 'retry',
    icon: h(RedoOutlined),
    label: 'Retry',
  },
  {
    key: 'copy',
    icon: h(CopyOutlined),
    label: 'Copy',
  },
];

const onClick: ActionsProps['onClick'] = ({ keyPath }) => {
  // Logic for handling click events
  message.success(`you clicked ${keyPath.join(',')}`);
};
</script>

<template>
  <context-holder />
  <Actions :items="actionItems" :on-click="onClick" variant="border" />
</template>

