<script setup lang="ts">
import { ApiOutlined, LinkOutlined, SearchOutlined } from '@ant-design/icons-vue';
import { Button, Divider, Flex, Switch, theme } from 'ant-design-vue';
import { Sender } from 'ant-design-x-vue';
import { ref, watch, h } from 'vue';

defineOptions({ name: 'AXSenderFooterSetup' });

const { token } = theme.useToken();
const loading = ref<boolean>(false);
const value = ref<string>('');

const iconStyle = {
  fontSize: 18,
  color: token.value.colorText,
}

watch(loading, () => {
  if (loading.value) {
    const timer = setTimeout(() => {
      loading.value = false;
      value.value = '';

      console.log('Send message successfully!');
    }, 2000);
    return () => {
      clearTimeout(timer);
    };
  }
});
</script>
<template>
  <Sender
    :value="value"
    :on-change="(v) => {
      value = v;
    }"
    placeholder="Press Enter to send message"
    :on-submit="() => {
      loading = true;
    }"
    :on-cancel="() => {
      loading = false;
    }"
    :actions="false"
  >
    <template #footer="{ info: { components: { SendButton, LoadingButton, SpeechButton } } }">
      <Flex
        justify="space-between"
        align="center"
      >
        <Flex
          gap="small"
          align="center"
        >
          <Button
            :style="iconStyle"
            type="text"
            :icon="h(LinkOutlined)"
          />
          <Divider type="vertical" />
          Deep Thinking
          <Switch size="small" />
          <Divider type="vertical" />
          <Button :icon="h(SearchOutlined)">
            Global Search
          </Button>
        </Flex>
        <Flex align="center">
          <Button
            type="text"
            :style="iconStyle"
            :icon="h(ApiOutlined)"
          />
          <Divider type="vertical" />
          <component
            :is="SpeechButton"
            :style="iconStyle"
          />
          <Divider type="vertical" />
          <component
            :is="LoadingButton"
            v-if="loading"
            type="default"
          />
          <component
            :is="SendButton"
            v-else
            type="primary"
            :disabled="false"
          />
        </Flex>
      </Flex>
    </template>
  </Sender>
</template>
