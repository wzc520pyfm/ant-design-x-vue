<script setup lang="ts">
defineOptions({ name: 'AXSenderPasteImageV2Setup' });

import { ref } from 'vue';
import { CloudUploadOutlined, PaperClipOutlined } from '@ant-design/icons-vue';
import { Attachments, Sender, SenderHeader } from 'ant-design-x-vue';
import type { AttachmentsProps } from 'ant-design-x-vue';

const open = ref(false);
const items = ref<AttachmentsProps['items']>([]);
const text = ref('');
const attachmentsRef = ref<InstanceType<typeof Attachments> | null>(null);
const senderRef = ref<InstanceType<typeof Sender> | null>(null);

const onPasteFile = (files: FileList) => {
  for (const file of files) {
    attachmentsRef.value?.upload(file);
  }
  open.value = true;
};

const onSubmit = () => {
  items.value = [];
  text.value = '';
};
</script>

<template>
  <a-flex :style="{ height: '220px' }" align="end">
    <Sender
      ref="senderRef"
      v-model:value="text"
      @paste-file="onPasteFile"
      @submit="onSubmit"
    >
      <template #header>
        <SenderHeader
          title="Attachments"
          :styles="{ content: { padding: 0 } }"
          :open="open"
          force-render
          @open-change="(val: boolean) => { open = val; }"
        >
          <Attachments
            ref="attachmentsRef"
            :before-upload="() => false"
            :items="items"
            @change="({ fileList }: any) => { items = fileList; }"
            :get-drop-container="() => senderRef?.nativeElement"
          >
            <template #placeholder="{ type }">
              <template v-if="type === 'drop'">
                <div>Drop file here</div>
              </template>
              <template v-else>
                <div>
                  <CloudUploadOutlined />
                  <div>Upload files</div>
                  <div>Click or drag files to this area to upload</div>
                </div>
              </template>
            </template>
          </Attachments>
        </SenderHeader>
      </template>
      <template #prefix>
        <a-button type="text" :style="{ fontSize: '16px' }" @click="open = !open">
          <template #icon>
            <PaperClipOutlined />
          </template>
        </a-button>
      </template>
    </Sender>
  </a-flex>
</template>
