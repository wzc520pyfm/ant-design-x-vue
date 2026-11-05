<script setup lang="ts">
defineOptions({ name: 'AXBubbleEditableV2Setup' });

import { ref } from 'vue';
import { EditOutlined, UserOutlined } from '@ant-design/icons-vue';
import { Bubble, Actions } from 'ant-design-x-vue';

const editable = ref([
  false,
  { editing: false, okText: 'ok', cancelText: 'cancel' },
]);
const content = ref(['editable bubble 1', 'editable bubble 2']);

const actionItems = [
  {
    key: 'edit',
    icon: EditOutlined,
    label: 'edit',
  },
];

const handleClick1 = ({ key }: { key: string }) => {
  editable.value = [key === 'edit', editable.value[1]];
};

const handleEditCancel1 = () => {
  editable.value = [false, editable.value[1]];
};

const handleEditConfirm1 = (val: string) => {
  content.value = [val, content.value[1]];
  editable.value = [false, editable.value[1]];
};

const handleClick2 = ({ key }: { key: string }) => {
  editable.value = [
    editable.value[0],
    { ...(editable.value[1] as any), editing: key === 'edit' },
  ];
};

const handleEditCancel2 = () => {
  editable.value = [editable.value[0], { ...(editable.value[1] as any), editing: false }];
};

const handleEditConfirm2 = (val: string) => {
  content.value = [content.value[0], val];
  editable.value = [editable.value[0], { ...(editable.value[1] as any), editing: false }];
};
</script>

<template>
  <a-flex vertical gap="small" :style="{ minHeight: '200px' }">
    <a-flex>
      <Bubble
        :editable="editable[0]"
        :content="content[0]"
        @edit-cancel="handleEditCancel1"
        @edit-confirm="handleEditConfirm1"
      >
        <template #avatar>
          <a-avatar>
            <template #icon>
              <UserOutlined />
            </template>
          </a-avatar>
        </template>
        <template #footer>
          <Actions :items="actionItems" @click="handleClick1" />
        </template>
      </Bubble>
    </a-flex>
    <a-flex>
      <Bubble
        :style="{ width: '100%' }"
        placement="end"
        :editable="editable[1]"
        :content="content[1]"
        @edit-cancel="handleEditCancel2"
        @edit-confirm="handleEditConfirm2"
      >
        <template #avatar>
          <a-avatar>
            <template #icon>
              <UserOutlined />
            </template>
          </a-avatar>
        </template>
        <template #footer>
          <Actions :items="actionItems" @click="handleClick2" />
        </template>
      </Bubble>
    </a-flex>
  </a-flex>
</template>
