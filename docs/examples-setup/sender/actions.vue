<script setup lang="ts">
import { Space, Spin, Typography, message as messageAnt } from 'ant-design-vue';
import { Sender } from 'ant-design-x-vue';
import { onWatcherCleanup, ref, watch, h } from 'vue';

defineOptions({ name: 'AXSenderActionsSetup' });

const [message, contextHolder] = messageAnt.useMessage();

const value = ref('');
const loading = ref<boolean>(false);

// Mock send message
watch(loading, () => {
  if (loading.value) {
    const timer = setTimeout(() => {
      loading.value = false;
      value.value = '';
      message.success('Send message successfully!');
    }, 2000);

    onWatcherCleanup(() => {
      clearTimeout(timer);
    });
  }
});
</script>

<template>
  <context-holder />
  <Sender
    v-model:value="value"
    submit-type="shiftEnter"
    :loading="loading"
    @change="(v) => {
      console.log('Sender onChange', v)
    }"
    @submit="() => {
      loading = true;
    }"
    @cancel="() => {
      loading = false;
    }"
  >
    <template #actions="{ info: { components: { SendButton, LoadingButton, ClearButton, SpeechButton } } }">
      <Space size="small">
        <Typography.Text type="secondary">
          <small>`Shift + Enter` to submit</small>
        </Typography.Text>
        <component :is="ClearButton" />
        <component :is="SpeechButton" />
        <component
          :is="LoadingButton"
          v-if="loading"
          type="default"
          style="display: block;"
          :disabled="true"
        >
          <template #icon>
            <Spin size="small" />
          </template>
        </component>
        <component
          :is="SendButton"
          v-else
          type="primary"
          :disabled="false"
        />
      </Space>
    </template>
  </Sender>
</template>
