<script setup lang="ts">
import { CloudUploadOutlined, LinkOutlined } from '@ant-design/icons-vue';
import { App, Button, Flex, Switch, type UploadFile } from 'ant-design-vue';
import { Attachments } from 'ant-design-x-vue';
import { h, ref } from 'vue';

defineOptions({ name: 'AXAttachmentBasic' });

const { message } = App.useApp();

const fullScreenDrop = ref(true);
const customContent = ref(true);
const divRef = ref<HTMLDivElement>();

const handleChange = ({ file }: { file: UploadFile }) => {
  message.info(`Mock upload: ${file.name}`);
};

const getDropContainer = () => (fullScreenDrop.value ? document.body : divRef.value);
</script>

<template>
  <App>
    <div ref="divRef">
      <Flex vertical gap="middle" align="flex-start">
        <Attachments :before-upload="() => false" :on-change="handleChange" :get-drop-container="getDropContainer"
          :placeholder="{
            icon: h(CloudUploadOutlined),
            title: 'Drag & Drop files here',
            description: 'Support file type: image, video, audio, document, etc.',
          }" :children="customContent && h(Button, { type: 'text', icon: h(LinkOutlined) })" />

        <Switch v-model:checked="fullScreenDrop" checked-children="Full screen drop"
          un-checked-children="Full screen drop" />

        <Switch v-model:checked="customContent" checked-children="use default content"
          un-checked-children="custom content" />
      </Flex>
    </div>
  </App>
</template>
