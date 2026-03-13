<script setup lang="ts">
defineOptions({ name: 'AXSenderHeaderFixedV2Setup' });

import { ref, h } from 'vue';
import { EnterOutlined } from '@ant-design/icons-vue';
import { Sender, SenderHeader } from 'ant-design-x-vue';
import { message } from 'ant-design-vue';

const hasRef = ref(true);

const onSubmit = () => {
  message.success('Send message successfully!');
};
</script>

<template>
  <a-flex vertical gap="middle" align="flex-start">
    <a-switch
      :checked="hasRef"
      checked-children="With Reference"
      un-checked-children="With Reference"
      @change="() => { hasRef = !hasRef; }"
    />
    <Sender @submit="onSubmit">
      <template #header>
        <SenderHeader
          :open="hasRef"
          @open-change="(val: boolean) => { hasRef = val; }"
        >
          <template #title>
            <a-space>
              <EnterOutlined />
              <a-typography-text type="secondary">"Tell more about Ant Design X"</a-typography-text>
            </a-space>
          </template>
        </SenderHeader>
      </template>
    </Sender>
  </a-flex>
</template>
