<script setup lang="tsx">
import { computed, h, onUnmounted, ref, watch } from 'vue';
import {
  CloudUploadOutlined,
  FileImageOutlined,
  FileWordOutlined,
  LinkOutlined,
} from '@ant-design/icons-vue';
import {
  Badge,
  Button,
  Dropdown,
  Flex,
  notification as antNotification,
  Typography,
} from 'ant-design-vue';
import {
  Attachments,
  Sender,
  type AttachmentsProps,
  type AttachmentsRef,
  type SenderRef,
} from 'ant-design-x-vue';

defineOptions({ name: 'AXAttachmentsSelectFilesSetup' });

const MAX_COUNT = 5;

const open = ref(false);
const items = ref<AttachmentsProps['items']>([]);
const text = ref('');

const senderRef = ref<SenderRef | null>(null);
const attachmentsRef = ref<AttachmentsRef | null>(null);

onUnmounted(() => {
  items.value?.forEach((item) => {
    if (item.url?.startsWith('blob:')) URL.revokeObjectURL(item.url);
  });
});

watch(
  () => items.value?.length ?? 0,
  (length) => {
    open.value = length > 0;
  },
);

const acceptItems = [
  {
    key: 'image',
    label: (
      <Flex gap="small">
        <FileImageOutlined />
        <span>Image</span>
      </Flex>
    ),
  },
  {
    key: 'docs',
    label: (
      <Flex gap="small">
        <FileWordOutlined />
        <span>Docs</span>
      </Flex>
    ),
  },
];

function selectFile({ key }: { key: string }) {
  attachmentsRef.value?.select({
    accept: key === 'image' ? '.png,.jpg,.jpeg' : '.doc,.docx',
    multiple: true,
  });
}

const senderHeader = computed(() =>
  h(
    Sender.Header,
    {
      closable: false,
      forceRender: true,
      title: 'Attachments',
      open: open.value,
      onOpenChange: (v: boolean) => (open.value = v),
      styles: { content: { padding: 0 } },
    },
    {
      default: () =>
        h(Attachments, {
          ref: attachmentsRef as any,
          multiple: true,
          maxCount: MAX_COUNT,
          beforeUpload: () => false,
          items: items.value,
          onChange: ({ file, fileList }: any) => {
            const updated = fileList.map((item: any) => {
              if (item.uid === file.uid && file.status !== 'removed' && item.originFileObj) {
                if (item.url?.startsWith('blob:')) URL.revokeObjectURL(item.url);
                return { ...item, url: URL.createObjectURL(item.originFileObj) };
              }
              return item;
            });
            items.value = updated;
          },
          placeholder: (type: string) =>
            type === 'drop'
              ? { title: 'Drop file here' }
              : {
                  icon: h(CloudUploadOutlined),
                  title: 'Upload files',
                  description: 'Click or drag files to this area to upload',
                },
          getDropContainer: () => senderRef.value?.nativeElement as HTMLElement,
        }),
    },
  ),
);

const prefixNode = computed(() =>
  h(
    Badge,
    { dot: (items.value?.length ?? 0) > 0 && !open.value },
    {
      default: () =>
        h(
          Dropdown,
          {
            trigger: ['click'],
            menu: { items: acceptItems, onClick: selectFile },
            placement: 'topLeft',
            arrow: { pointAtCenter: true },
          },
          {
            default: () =>
              h(Button, {
                disabled: (items.value?.length ?? 0) >= MAX_COUNT,
                type: 'text',
                icon: h(LinkOutlined),
              }),
          },
        ),
    },
  ),
);

function onSubmit() {
  antNotification.info({
    message: 'Mock Submit',
    description: h(Typography, null, {
      default: () =>
        h('ul', null, [
          h('li', null, `You said: ${text.value}`),
          h('li', null, [
            `Attachments count: ${items.value?.length ?? 0}`,
            h(
              'ul',
              null,
              (items.value ?? []).map((item: any) => h('li', { key: item.uid }, item.name)),
            ),
          ]),
        ]),
    }),
  });
  items.value = [];
  text.value = '';
}
</script>

<template>
  <Flex style="min-height: 250px" align="flex-end">
    <Sender
      ref="senderRef"
      :header="senderHeader"
      :prefix="prefixNode"
      :value="text"
      @change="(v: string) => (text = v)"
      @submit="onSubmit"
    />
  </Flex>
</template>
