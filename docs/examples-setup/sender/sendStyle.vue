<script setup lang="ts">
import { SendOutlined } from '@ant-design/icons-vue';
import { Flex, Tooltip, message } from 'ant-design-vue';
import { Sender, theme } from 'ant-design-x-vue';
import { onWatcherCleanup, ref, watch, h } from 'vue';

defineOptions({ name: 'AXSenderSendStyleSetup' });

const [messageApi, contextHolder] = message.useMessage();
const { token } = theme.useToken();

const value = ref('Ask something?');
const loading = ref(false);

watch(loading, () => {
  if (loading.value) {
    const timer = setTimeout(() => {
      loading.value = false;
    }, 3000);

    onWatcherCleanup(() => {
      clearTimeout(timer);
    })
  }
});

</script>
<template>
  <contextHolder />
  <Flex
    vertical
    gap="middle"
  >
    <Sender
      v-model:value="value"
      :loading="loading"
      placeholder="Change button border radius"
      @submit="(msg) => {
        messageApi.success(`Send: ${msg}`);
        value = ''
        loading = true
      }"
      @cancel="() => {
        loading = false
      }"
    >
      <template #actions="{ info: { components: { SendButton, LoadingButton } } }">
        <Tooltip
          v-if="loading"
          title="Click to cancel"
        >
          <component :is="LoadingButton" />
        </Tooltip>
        <Tooltip
          v-else
          :title="value ? 'Send \u21B5' : 'Please type something'"
        >
          <component
            :is="SendButton"
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
      @submit="(msg) => {
        messageApi.success(`Send: ${msg}`);
        value = ''
        loading = true
      }"
      @cancel="() => {
        loading = false
      }"
    >
      <template #actions="{ info: { components: { SendButton, LoadingButton } } }">
        <Tooltip
          v-if="loading"
          title="Click to cancel"
        >
          <component :is="LoadingButton" />
        </Tooltip>
        <Tooltip
          v-else
          :title="value ? 'Send \u21B5' : 'Please type something'"
        >
          <component
            :is="SendButton"
            type="text"
            shape="default"
            :icon="h(SendOutlined)"
            :style="{ color: token.colorPrimary }"
          />
        </Tooltip>
      </template>
    </Sender>
    <Sender
      v-model:value="value"
      :loading="loading"
      placeholder="Loading not change button"
      @submit="(msg) => {
        messageApi.success(`Send: ${msg}`);
        value = ''
        loading = true
      }"
      @cancel="() => {
        loading = false
      }"
    >
      <template #actions="{ info: { components: { SendButton } } }">
        <component :is="SendButton" />
      </template>
    </Sender>
  </Flex>
</template>
