<script setup lang="ts">
import { EnterOutlined } from '@ant-design/icons-vue';
import { App, Flex, Space, Switch, Typography, message } from 'ant-design-vue';
import { Sender } from 'ant-design-x-vue';
import { computed, ref, h } from 'vue';

defineOptions({ name: 'AXSenderHeaderFixedSetup' });

const hasRef = ref(true);

const [messageApi, contextHolder] = message.useMessage();

const toggleChecked = () => {
  hasRef.value =!hasRef.value; 
}

const openChange = (v) => {
  hasRef.value = v;
}

const headerTitle = h(Space, {}, [
  h(EnterOutlined),
  h(Typography.Text, { type: 'secondary' }, '"Tell more about Ant Design X"')
])
</script>
<template>
  <App>
    <context-holder />
    <Flex
      vertical
      gap="middle"
      align="flex-start"
    >
      <Switch
        :checked="hasRef"
        un-checked-children="With Reference"
        checked-children="With Reference"
        @change="toggleChecked"
      />
      <Sender
        :on-submit="() => {
          messageApi.success('Send message successfully!');
        }"
      >
        <template #header>
          <Sender.Header
            :open="hasRef"
            :title="headerTitle"
            :on-open-change="openChange"
          />
        </template>
      </Sender>
    </Flex>
  </App>
</template>
