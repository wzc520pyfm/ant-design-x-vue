<script setup lang="ts">
defineOptions({ name: 'AXFileCardMaskV2Setup' });

import { FileCard } from 'ant-design-x-vue';
import { VerticalAlignBottomOutlined } from '@ant-design/icons-vue';
import { h } from 'vue';

const onDownload = () => {
  const blob = new Blob(['123'], { type: 'text/plain' });
  const a = document.createElement('a');
  const href = URL.createObjectURL(blob);
  a.href = href;
  a.download = 'txt-file.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(href);
};

const maskNode = h(VerticalAlignBottomOutlined, {
  style: { fontSize: '20px' },
  onClick: onDownload,
});
</script>

<template>
  <FileCard name="txt-file.txt" :byte="1024" :mask="maskNode" />
</template>
