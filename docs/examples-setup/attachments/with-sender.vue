<script setup lang="ts">
import { CloudUploadOutlined, LinkOutlined } from '@ant-design/icons-vue';
import { App, Button, Flex, Badge } from 'ant-design-vue';
import { Attachments, Sender } from 'ant-design-x-vue';
import { computed, ref, h } from 'vue';

defineOptions({ name: 'AXAttachmentWithSender' });

const open = ref(true);
const items = ref([]);
const text = ref('');

const senderRef = ref<InstanceType<typeof Sender>>(null);

const senderHeader = computed(() =>
  h(Sender.Header, {
    title: "Attachments",
    styles: {
      content: {
        padding: 0,
      },
    },
    open: open.value,
    onOpenChange: (v: boolean) => open.value = v,
    forceRender: true
  }, {
    default: () => h(Attachments, {
      beforeUpload: () => false,
      items: items.value,
      onChange: ({ fileList }: { fileList: any[] }) => items.value = fileList,
      placeholder: (type: string) => type === 'drop'
        ? { title: 'Drop file here' }
        : {
            icon: h(CloudUploadOutlined),
            title: 'Upload files',
            description: 'Click or drag files to this area to upload',
          },
      getDropContainer: () => senderRef.value?.nativeElement
    })
  })
);

const badgeNode = computed(() =>
  h(Badge, { dot: items.value.length > 0 && !open.value }, {
    default: () => h(Button, {
      onClick: () => open.value = !open.value,
      icon: h(LinkOutlined)
    })
  })
);
</script>

<template>
  <Flex
    style="min-height: 250px"
    align="flex-end"
  >
    <Sender
      ref="senderRef"
      :header="senderHeader"
      :prefix="badgeNode"
      :value="text"
      @change="v => text = v"
      @submit="() => {
        items = [];
        text = '';
      }"
    />
  </Flex>
</template>
