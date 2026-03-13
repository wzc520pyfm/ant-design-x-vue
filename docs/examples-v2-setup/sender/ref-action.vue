<script setup lang="ts">
defineOptions({ name: 'AXSenderRefActionV2Setup' });

import { ref } from 'vue';
import { Sender } from 'ant-design-x-vue';

const senderRef = ref<InstanceType<typeof Sender> | null>(null);

const insertText = () => senderRef.value!.insert('some text');
const insertTextEnd = () => senderRef.value!.insert('some text', 'end');
const insertTextStart = () => senderRef.value!.insert('some text', 'start');
const focusFirst = () => senderRef.value!.focus({ cursor: 'start' });
const focusLast = () => senderRef.value!.focus({ cursor: 'end' });
const focusSelectAll = () => senderRef.value!.focus({ cursor: 'all' });
const focusPreventScroll = () => senderRef.value!.focus({ preventScroll: true });
const blur = () => senderRef.value!.blur();
</script>

<template>
  <a-flex wrap :gap="12">
    <a-button @click="insertText">Insert Text</a-button>
    <a-button @click="insertTextEnd">Insert Text End</a-button>
    <a-button @click="insertTextStart">Insert Text Start</a-button>
    <a-button @click="focusFirst">Focus at first</a-button>
    <a-button @click="focusLast">Focus at last</a-button>
    <a-button @click="focusSelectAll">Focus to select all</a-button>
    <a-button @click="focusPreventScroll">Focus prevent scroll</a-button>
    <a-button @click="blur">Blur</a-button>
    <Sender ref="senderRef" default-value="Hello, welcome to use Ant Design X!" />
  </a-flex>
</template>
