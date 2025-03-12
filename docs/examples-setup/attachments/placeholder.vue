<script setup lang="ts">
import { CloudUploadOutlined } from '@ant-design/icons-vue';
import { Button, Flex, Result, theme, Typography } from 'ant-design-vue';
import { Attachments, type AttachmentsProps } from 'ant-design-x-vue';
import { computed, type CSSProperties, ref } from 'vue';

defineOptions({ name: 'AXAttachmentPlaceHolderSetup' });

const presetFiles: AttachmentsProps['items'] = [
  {
    uid: '1',
    name: 'uploading file.xlsx',
    status: 'uploading',
    url: 'http://www.baidu.com/xxx.png',
    percent: 93,
  },
  {
    uid: '2',
    name: 'uploaded file.docx',
    status: 'done',
    size: 123456,
    description: 'Customize description',
    url: 'http://www.baidu.com/yyy.png',
  },
  {
    uid: '3',
    name: 'upload error with long text file name.zip',
    status: 'error',
    response: 'Server Error 500', // custom error message to show
    url: 'http://www.baidu.com/zzz.png',
  },
  {
    uid: '4',
    name: 'image uploading preview.png',
    status: 'uploading',
    percent: 33,
    thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  },
  {
    uid: '5',
    name: 'image done preview.png',
    status: 'done',
    size: 123456,
    thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  },
  {
    uid: '6',
    name: 'image error preview.png',
    status: 'error',
    response: 'Server Error 500', // custom error message to show
    thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  },
];

const { token } = theme.useToken();
const items = ref<AttachmentsProps['items']>([]);

const sharedBorderStyle = computed<CSSProperties>(() => ({
  borderRadius: token.value.borderRadius,
  overflow: 'hidden',
  background: token.value.colorBgContainer,
}));

const sharedAttachmentProps = computed<AttachmentsProps>(() => ({
  beforeUpload: () => false,
  items: items.value,
  onChange: ({ fileList }) => {
    console.log('onChange:', fileList);
    items.value = fileList;
  },
}));

const fillFiles = () => {
  items.value = presetFiles;
};

const resetFiles = () => {
  items.value = [];
};
</script>
<template>
  <Flex
    vertical
    gap="middle"
    :style="{
      padding: token.padding,
      background: token.colorBgContainerDisabled,
    }"
  >
    <div :style="sharedBorderStyle">
      <Attachments
        v-bind="sharedAttachmentProps"
      >
        <template #placeholder="{ type }">
          <Flex
            v-if="type === 'inline'"
            align="center"
            justify="center"
            vertical
            gap="2"
          >
            <Typography.Text style="font-size: 30px; line-height: 1;">
              <CloudUploadOutlined />
            </Typography.Text>
            <Typography.Title
              :level="5"
              style="margin: 0; font-size: 14px; line-height: 1.5;"
            >
              Click or Drop files here
            </Typography.Title>
            <Typography.Text type="secondary">
              Support file type: image, video, audio, document, etc.
            </Typography.Text>
          </Flex>
          <Typography.Text v-if="type === 'drop'">
            Drop file here
          </Typography.Text>
        </template>
      </Attachments>
    </div>

    <div :style="sharedBorderStyle">
      <Attachments
        v-bind="sharedAttachmentProps"
      >
        <template #placeholder="{ type }">
          <Result
            v-if="type === 'inline'"
            title="Custom Placeholder Node"
            :style="{ padding: 0 }"
          >
            <template #icon>
              <CloudUploadOutlined />
            </template>
            <template #extra>
              <Button type="primary">
                Do Upload
              </Button>
            </template>
          </Result>
          <Typography.Text v-if="type === 'drop'">
            Drop file here
          </Typography.Text>
        </template>
      </Attachments>
    </div>

    <Flex gap="middle">
      <Button
        :style="{ flex: '1 1 50%' }"
        :disabled="!!items.length"
        type="primary"
        @click="fillFiles"
      >
        Fill Files
      </Button>
      <Button
        :style="{ flex: '1 1 50%' }"
        :disabled="!items.length"
        @click="resetFiles"
      >
        Reset Files
      </Button>
    </Flex>
  </Flex>
</template>
