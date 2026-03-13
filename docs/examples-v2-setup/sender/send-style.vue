<script setup lang="ts">
import { Sender } from 'ant-design-x-vue';
import { Flex, Tooltip, message } from 'ant-design-vue';
import { SendOutlined } from '@ant-design/icons-vue';
import { ref, watch, h } from 'vue';

const value = ref('Ask something?');
const loading = ref(false);

watch(loading, (val) => {
  if (val) {
    const timer = setTimeout(() => {
      loading.value = false;
    }, 3000);
    return () => clearTimeout(timer);
  }
});

const sendOutlinedIcon = h(SendOutlined);

const onSubmit = (msg: string) => {
  message.success(`Send: ${msg}`);
  value.value = '';
  loading.value = true;
};

const onCancel = () => {
  loading.value = false;
};
</script>

<template>
  <Flex vertical gap="middle">
    <Sender
      v-model:value="value"
      :loading="loading"
      placeholder="Change button border radius"
      @submit="onSubmit"
      @cancel="onCancel"
    >
      <template #suffix="{ info }">
        <Tooltip v-if="loading" title="Click to cancel">
          <component :is="info.components.LoadingButton" />
        </Tooltip>
        <Tooltip v-else :title="value ? 'Send ↵' : 'Please type something'">
          <component
            :is="info.components.SendButton"
            shape="default"
            :style="{ borderRadius: '12px' }"
          />
        </Tooltip>
      </template>
    </Sender>

    <Sender
      v-model:value="value"
      :loading="loading"
      placeholder="Change button icon"
      @submit="onSubmit"
      @cancel="onCancel"
    >
      <template #suffix="{ info }">
        <Tooltip v-if="loading" title="Click to cancel">
          <component :is="info.components.LoadingButton" />
        </Tooltip>
        <Tooltip v-else :title="value ? 'Send ↵' : 'Please type something'">
          <component
            :is="info.components.SendButton"
            variant="text"
            color="primary"
            :icon="sendOutlinedIcon"
            shape="default"
          />
        </Tooltip>
      </template>
    </Sender>

    <Sender
      v-model:value="value"
      :loading="loading"
      placeholder="Loading not change button"
      @submit="onSubmit"
      @cancel="onCancel"
    >
      <template #suffix="{ info }">
        <component :is="info.components.SendButton" />
      </template>
    </Sender>
  </Flex>
</template>
