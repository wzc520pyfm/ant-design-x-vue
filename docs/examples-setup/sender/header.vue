<script setup lang="ts">
import { CloudUploadOutlined, LinkOutlined } from '@ant-design/icons-vue';
import { Button, Flex, theme, Typography, message as messageAnt } from 'ant-design-vue';
import { Sender } from 'ant-design-x-vue';
import { ref } from 'vue';

defineOptions({ name: 'AXSenderHeaderSetup' });

const { token } = theme.useToken();
const [message, contextHolder] = messageAnt.useMessage();

const open = ref(false);

const openChange = (v: boolean) => {
  open.value = v;
}

const triggerOpen = () => {
  open.value = !open.value;
}

const senderSubmit = () => {
  message.success('Send message successfully!');
}

const selectFileClick = () => {
  message.info('Mock select file');
}

</script>

<template>
  <context-holder />
  <Flex
    style="height: 350px;"
    align="end"
  >
    <Sender
      placeholder="← Click to open"
      @submit="senderSubmit"
    >
      <template #header>
        <Sender.Header
          title="Upload Sample"
          :open="open"
          @open-change="openChange"
        >
          <Flex
            vertical
            align="center"
            gap="small"
            :style="{ marginBlock: token.paddingLG }"
          >
            <CloudUploadOutlined style="font-size: 4em" />
            <Typography.Title
              :level="5"
              style="margin: 0"
            >
              Drag file here(just demo)
            </Typography.Title>
            <Typography.Text type="secondary">
              Support pdf, doc, xlsx, ppt, txt, image file types
            </Typography.Text>
            <Button @click="selectFileClick">
              Select File
            </Button>
          </Flex>
        </Sender.Header>
      </template>

      <template #prefix>
        <Button
          type="text"
          @click="triggerOpen"
        >
          <template #icon>
            <LinkOutlined />
          </template>
        </Button>
      </template>
    </Sender>
  </Flex>
</template>
