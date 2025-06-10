<script setup lang="ts">
import { CloudUploadOutlined, LinkOutlined } from '@ant-design/icons-vue';
import { App, Button, Flex } from 'ant-design-vue';
import { Attachments, Sender } from 'ant-design-x-vue';
import { computed, ref, h } from 'vue';

defineOptions({ name: 'AXSenderPasteImageSetup' });

const open = ref(false);
const items = ref([]);
const text = ref('');

const attachmentsRef = ref(null);
const senderRef = ref<InstanceType<typeof Sender>>(null);

const placeholder = (type) =>
  type === 'drop'
    ? {
      title: 'Drop file here',
    }
    : {
      icon: h(CloudUploadOutlined),
      title: 'Upload files',
      description: 'Click or drag files to this area to upload',
    }

const getDropContainer = () => senderRef.value?.nativeElement;

const pastFile = (_, files) => {
  console.log("past")
  for (const file of files) {
    attachmentsRef.value?.upload(file);
  }
  open.value = true;
}

const submit = () => {
  items.value = [];
  text.value = ''; 
}

const fileChange = ({ fileList }) => items.value = fileList
</script>
<template>
  <App>
    <Flex
      :style="{ height: '220px' }"
      align="end"
    >
      <Sender
        ref="senderRef"
        :value="text"
        :on-change="v => text = v"
        :on-submit="submit"
        :on-paste-file="pastFile"
      >
        <template #prefix>
          <Button
            type="text"
            :icon="h(LinkOutlined)"
            @click="() => {
              open = !open;
            }"
          />
        </template>
        <template #header>
          <Sender.Header
            title="Attachments"
            :styles="{
              content: {
                padding: 0,
              },
            }"
            :open="open"
            :on-open-change="v => open = v"
            force-render
          >
            <Attachments
              ref="attachmentsRef"
              :before-upload="() => false"
              :items="items"
              :on-change="fileChange"
              :placeholder="placeholder"
              :get-drop-container="getDropContainer"
            />
          </Sender.Header>
        </template>
      </Sender>
    </Flex>
  </App>
</template>
