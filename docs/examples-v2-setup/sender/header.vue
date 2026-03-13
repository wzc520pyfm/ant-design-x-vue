<script setup lang="ts">
import { Sender, SenderHeader } from 'ant-design-x-vue';
import { Button, Flex, Typography, message, theme } from 'ant-design-vue';
import { ref } from 'vue';

const open = ref(false);
const { token } = theme.useToken();

const onSubmit = () => {
  message.success('Send message successfully!');
};

const toggleOpen = () => {
  open.value = !open.value;
};

const onOpenChange = (v: boolean) => {
  open.value = v;
};
</script>

<template>
  <Flex :style="{ height: '350px' }" align="end">
    <Sender placeholder="← Click to open" @submit="onSubmit">
      <template #header>
        <SenderHeader title="Upload Sample" :open="open" :on-open-change="onOpenChange">
          <Flex vertical align="center" gap="small" :style="{ marginBlock: `${token.paddingLG}px` }">
            <cloud-upload-outlined :style="{ fontSize: '4em' }" />
            <Typography.Title :level="5" :style="{ margin: 0 }">
              Drag file here (just demo)
            </Typography.Title>
            <Typography.Text type="secondary">
              Support pdf, doc, xlsx, ppt, txt, image file types
            </Typography.Text>
            <Button @click="() => message.info('Mock select file')">
              Select File
            </Button>
          </Flex>
        </SenderHeader>
      </template>
      <template #prefix>
        <Button type="text" :style="{ fontSize: '16px' }" @click="toggleOpen">
          <template #icon>
            <paper-clip-outlined />
          </template>
        </Button>
      </template>
    </Sender>
  </Flex>
</template>
