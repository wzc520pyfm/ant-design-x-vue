<script setup lang="ts">
import { App, Button, Flex } from 'ant-design-vue';
import { Sender } from 'ant-design-x-vue';
import { ref } from 'vue';

defineOptions({ name: 'AXSenderFocusSetup' });

const senderRef = ref<InstanceType<typeof Sender> | null>(null);

const focusStart = () => {
  senderRef.value?.focus({ cursor: 'start' });
};

const focusEnd = () => {
  senderRef.value?.focus({ cursor: 'end' });
};

const focusAll = () => {
  senderRef.value?.focus({ cursor: 'all' });
};

const focusPreventScroll = () => {
  senderRef.value?.focus({ preventScroll: true });
};

const blur = () => {
  senderRef.value?.blur();
};
</script>
<template>
  <App>
    <Flex
      wrap="wrap"
      :gap="12"
    >
      <Button @click="focusStart">
        Focus at first
      </Button>
      <Button @click="focusEnd">
        Focus at last
      </Button>
      <Button @click="focusAll">
        Focus to select all
      </Button>
      <Button @click="focusPreventScroll">
        Focus prevent scroll
      </Button>
      <Button @click="blur">
        Blur
      </Button>
      <Sender
        ref="senderRef"
        default-value="Hello, welcome to use Ant Design X!"
      />
    </Flex>
  </App>
</template>
