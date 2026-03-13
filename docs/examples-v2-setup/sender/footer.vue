<script setup lang="tsx">
import { Sender } from 'ant-design-x-vue';
import { Button, Divider, Flex, Switch, theme } from 'ant-design-vue';
import { ApiOutlined, LinkOutlined, SearchOutlined } from '@ant-design/icons-vue';
import { ref, watch } from 'vue';
import type { ActionsComponents, BaseNode } from 'ant-design-x-vue/es/sender/interface';

const { token } = theme.useToken();
const loading = ref(false);
const value = ref('');

watch(loading, (val) => {
  if (val) {
    const timer = setTimeout(() => {
      loading.value = false;
      value.value = '';
      console.log('Send message successfully!');
    }, 2000);
    return () => clearTimeout(timer);
  }
});

const iconStyle = { fontSize: '18px', color: token.value.colorText };

const onSubmit = () => { loading.value = true; };
const onCancel = () => { loading.value = false; };

const footerRender = (_: any, { components }: { components: ActionsComponents }): BaseNode => {
  const { SendButton, LoadingButton, SpeechButton } = components;
  return (
    <Flex justify="space-between" align="center">
      <Flex gap="small" align="center">
        <Button style={iconStyle} type="text">
          {{ icon: () => <LinkOutlined /> }}
        </Button>
        <Divider type="vertical" />
        Deep Thinking
        <Switch size="small" />
        <Divider type="vertical" />
        <Button>
          {{ icon: () => <SearchOutlined /> }}
          Global Search
        </Button>
      </Flex>
      <Flex align="center">
        <Button type="text" style={iconStyle}>
          {{ icon: () => <ApiOutlined /> }}
        </Button>
        <Divider type="vertical" />
        <SpeechButton style={iconStyle} />
        <Divider type="vertical" />
        {loading.value ? (
          <LoadingButton type="default" />
        ) : (
          <SendButton type="primary" disabled={false} />
        )}
      </Flex>
    </Flex>
  );
};
</script>

<template>
  <Sender
    v-model:value="value"
    :auto-size="{ minRows: 2, maxRows: 6 }"
    placeholder="Press Enter to send message"
    :footer="footerRender"
    :suffix="false"
    @submit="onSubmit"
    @cancel="onCancel"
  />
</template>
