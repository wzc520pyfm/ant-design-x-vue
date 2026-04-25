<script setup lang="tsx">
import { ref } from 'vue';
import { RedoOutlined } from '@ant-design/icons-vue';
import { Button, message as messageAnt, Pagination, Switch } from 'ant-design-vue';
import { Actions, type ActionsProps } from 'ant-design-x-vue';

defineOptions({ name: 'AXActionsFadeInSetup' });

const [message, contextHolder] = messageAnt.useMessage();

const curPage = ref(1);
const rerenderKey = ref(0);
const fadeInLeft = ref(true);

const actionItems: ActionsProps['items'] = [
  {
    key: 'pagination',
    actionRender: () => (
      <Pagination
        simple
        current={curPage.value}
        onChange={(page: number) => (curPage.value = page)}
        total={5}
        pageSize={1}
      />
    ),
  },
  { key: 'retry', icon: <RedoOutlined />, label: 'Retry' },
  {
    key: 'copy',
    label: 'copy',
    actionRender: () => <Actions.Copy text="copy value" />,
  },
];

const onClick: ActionsProps['onClick'] = ({ keyPath }) => {
  message.success(`you clicked ${keyPath.join(',')}`);
};
</script>

<template>
  <context-holder />
  <div style="display:flex; flex-direction:column; gap:12px;">
    <div style="display:flex; align-items:center; gap:12px;">
      <Switch
        v-model:checked="fadeInLeft"
        checked-children="fadeInLeft"
        un-checked-children="fadeIn"
      />
      <Button @click="rerenderKey += 1">Re-Render</Button>
    </div>
    <Actions
      :key="rerenderKey"
      :fade-in="!fadeInLeft"
      :fade-in-left="fadeInLeft"
      :items="actionItems"
      :on-click="onClick"
      variant="borderless"
    />
  </div>
</template>
