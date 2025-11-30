<script setup lang="ts">
import { CopyOutlined, DeleteOutlined, RedoOutlined, ShareAltOutlined } from '@ant-design/icons-vue';
import { message as messageAnt, Modal } from 'ant-design-vue';
import { Actions, type ActionsProps } from 'ant-design-x-vue';
import { h } from 'vue';

defineOptions({ name: 'AXActionsSubSetup' });

const [message, contextHolder] = messageAnt.useMessage();

const actionItems: ActionsProps['items'] = [
  {
    key: 'retry',
    label: 'Retry',
    icon: h(RedoOutlined),
  },
  {
    key: 'copy',
    label: 'Copy',
    icon: h(CopyOutlined),
  },
  {
    key: 'more',
    children: [
      {
        key: 'share',
        label: 'Share',
        icon: h(ShareAltOutlined),
        children: [
          { key: 'qq', label: 'QQ' },
          { key: 'wechat', label: 'WeChat' },
        ],
      },
      { key: 'import', label: 'Import' },
      {
        key: 'delete',
        label: 'Delete',
        icon: h(DeleteOutlined),
        onItemClick: () => {
          Modal.confirm({
            title: 'Are you sure want to delete?',
            content: 'Some descriptions',
            onOk() {
              message.success('Delete successfully');
            },
            onCancel() {
              message.info('Cancel');
            },
          });
        },
        danger: true,
      },
    ],
  },
  {
    key: 'clear',
    label: 'Clear',
    icon: h(DeleteOutlined),
  },
];

const onClick: ActionsProps['onClick'] = ({ keyPath }) => {
  // Logic for handling click events
  message.success(`you clicked ${keyPath.join(',')}`);
};
</script>

<template>
  <context-holder />
  <Actions :items="actionItems" :on-click="onClick" />
</template>

