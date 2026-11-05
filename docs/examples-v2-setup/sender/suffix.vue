<script setup lang="tsx">
defineOptions({ name: 'AXSenderSuffixV2Setup' });

import { Sender } from 'ant-design-x-vue';
import { Space, Spin, Typography, message } from 'ant-design-vue';
import { RobotOutlined } from '@ant-design/icons-vue';
import { ref, watch } from 'vue';
import type { ActionsComponents, BaseNode } from 'ant-design-x-vue/es/sender/interface';

const loading = ref(false);
const value = ref('');

watch(loading, (val) => {
  if (val) {
    const timer = setTimeout(() => {
      loading.value = false;
      value.value = '';
      message.success('Send message successfully!');
    }, 2000);
    return () => clearTimeout(timer);
  }
});

const onSubmit = () => { loading.value = true; };
const onCancel = () => { loading.value = false; };

const suffixRender = (_: any, info: { components: ActionsComponents }): BaseNode => {
  const { SendButton, LoadingButton, ClearButton, SpeechButton } = info.components;
  return (
    <Space size="small">
      <Typography.Text style={{ whiteSpace: 'nowrap' }} type="secondary">
        <small>`Shift + Enter` to submit</small>
      </Typography.Text>
      <ClearButton />
      <SpeechButton />
      {loading.value ? (
        <LoadingButton
          type="default"
          icon={<Spin size="small" />}
          disabled
        />
      ) : (
        <SendButton type="primary" icon={<RobotOutlined />} disabled={false} />
      )}
    </Space>
  );
};
</script>

<template>
  <Sender
    submit-type="shiftEnter"
    v-model:value="value"
    :loading="loading"
    :suffix="suffixRender"
    @submit="onSubmit"
    @cancel="onCancel"
  />
</template>
