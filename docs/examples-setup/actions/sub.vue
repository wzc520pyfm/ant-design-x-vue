<script setup lang="ts">
import { DeleteOutlined, EditOutlined, RedoOutlined, ShareAltOutlined } from '@ant-design/icons-vue';
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
    key: 'edit',
    icon: h(EditOutlined),
    label: 'Edit',
  },
  {
    key: 'more',
    subItems: [
      {
        key: 'share',
        label: 'Share',
        icon: h(ShareAltOutlined),
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
    danger: true,
  },
];

const onClick: ActionsProps['onClick'] = ({ keyPath }) => {
  message.success(`you clicked ${keyPath.join(',')}`);
};
</script>

<template>
  <context-holder />
  <Actions :items="actionItems" :on-click="onClick" />
</template>
