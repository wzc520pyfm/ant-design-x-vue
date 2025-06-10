<script setup lang="ts">
import { CloudUploadOutlined, LinkOutlined } from '@ant-design/icons-vue';
import { message, Button, Flex, Switch, type UploadFile } from 'ant-design-vue';
import { Attachments, Sender } from 'ant-design-x-vue';
import { computed, h, ref } from 'vue';

defineOptions({ name: 'AXAttachmentBasic' });


const fullScreenDrop = ref(false);
const customContent = ref(true);
const divRef = ref<HTMLDivElement>();
const [messageApi, contextHolder] = message.useMessage();
const handleChange = ({ file }: { file: UploadFile }) => {
  messageApi.info(`Mock upload: ${file.name}`);
};

const getDropContainer = () => (fullScreenDrop.value ? document.body : divRef.value);

const attachmentsNode = computed(() => h(Attachments, {
  beforeUpload: () => false,
  onChange: handleChange,
  placeholder: {
    icon: h(CloudUploadOutlined),
    title: 'Drag & Drop files here',
    description: 'Support file type: image, video, audio, document, etc.',
  },
  children: customContent.value && h(Button, { type: 'text', icon: h(LinkOutlined) }),
  getDropContainer,
}));

</script>

<template>
  <contextHolder />
  <div ref="divRef">
    <Flex
      vertical
      gap="middle"
      align="flex-start"
    >
      <Sender
        :prefix="attachmentsNode"
      />
      <Switch
        v-model:checked="fullScreenDrop"
        checked-children="Full screen drop"
        un-checked-children="Full screen drop"
      />

      <Switch
        v-model:checked="customContent"
        checked-children="use default content"
        un-checked-children="custom content"
      />
    </Flex>
  </div>
</template>
