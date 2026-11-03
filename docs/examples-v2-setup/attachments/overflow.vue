<script setup lang="ts">
import { CloudUploadOutlined } from '@ant-design/icons-vue';
import { Flex, Segmented, Switch } from 'ant-design-vue';
import { Attachments, type AttachmentsProps } from 'ant-design-x-vue';
import { ref, h, computed } from 'vue';

defineOptions({ name: 'AXAttachmentOverflow' });

const presetFiles: AttachmentsProps['items'] = Array.from({ length: 30 }).map((_, index) => ({
  uid: String(index),
  name: `file-${index}.jpg`,
  status: 'done',
  thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
}));

const overflow = ref<AttachmentsProps['overflow']>('wrap');
const items = ref<AttachmentsProps['items']>(presetFiles);
const disabled = ref(false);

// 使用计算属性来处理 items.length !== 0
const hasItems = computed({
  get: () => items.value.length !== 0,
  set: (value) => {
    items.value = value ? presetFiles : [];
  }
});
</script>

<template>
  <Flex
    vertical
    :gap="'middle'"
  >
    <Flex
      :gap="'middle'"
      :align="'center'"
    >
      <Segmented
        v-model:value="overflow"
        :options="[
          { value: 'wrap', label: 'Wrap' },
          { value: 'scrollX', label: 'Scroll X' },
          { value: 'scrollY', label: 'Scroll Y' },
        ]"
        style="margin-inline-end: auto"
      />
      <Switch
        v-model:checked="hasItems"
        checked-children="Data"
        un-checked-children="Data"
      />
      <Switch
        v-model:checked="disabled"
        checked-children="Disabled"
        un-checked-children="Disabled"
      />
    </Flex>
    <Attachments
      :overflow="overflow"
      :items="items"
      :before-upload="() => false"
      :placeholder="{
        icon: h(CloudUploadOutlined),
        title: 'Click or Drop files here',
        description: 'Support file type: image, video, audio, document, etc.',
      }"
      :disabled="disabled"
      @change="(info) => items = info.fileList"
    />
  </Flex>
</template>
