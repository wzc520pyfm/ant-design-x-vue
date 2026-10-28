<script setup lang="ts">
import { RedoOutlined } from '@ant-design/icons-vue';
import { message as messageAnt, Pagination } from 'ant-design-vue';
import { Actions, type ActionsProps } from 'ant-design-x-vue';
import { h, ref } from 'vue';

defineOptions({ name: 'AXActionsVariantSetup' });

const [message, contextHolder] = messageAnt.useMessage();
const curPage = ref(1);

const actionItems: ActionsProps['items'] = [
  {
    key: 'pagination',
    actionRender: () => h(Pagination, {
      simple: true,
      current: curPage.value,
      total: 5,
      pageSize: 1,
      onChange: (page: number) => { curPage.value = page; },
    }),
  },
  {
    key: 'retry',
    icon: h(RedoOutlined),
    label: 'Retry',
  },
  {
    key: 'copy',
    label: 'copy',
    actionRender: () => h(Actions.Copy, { text: 'copy value' }),
  },
];

const onClick: ActionsProps['onClick'] = ({ keyPath }) => {
  message.success(`you clicked ${keyPath.join(',')}`);
};
</script>

<template>
  <context-holder />
  <a-flex gap="middle" vertical align="flex-start">
    <Actions :items="actionItems" :on-click="onClick" variant="outlined" />
    <Actions :items="actionItems" :on-click="onClick" variant="filled" />
    <Actions :items="actionItems" :on-click="onClick" variant="borderless" />
  </a-flex>
</template>
