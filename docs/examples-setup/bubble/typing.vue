<script setup lang="ts">
import { UserOutlined } from '@ant-design/icons-vue';
import { Bubble } from 'ant-design-x-vue';
import { Button, Flex } from 'ant-design-vue';
import { ref, h } from 'vue';

defineOptions({ name: 'AXBubbleTypingSetup' });

const text = ref('Ant Design X love you! ');

const repeat = ref(1);
</script>

<template>
  <Flex vertical gap="small">
    <Bubble
      :content="text.repeat(repeat)"
      :typing="{ step: 2, interval: 50 }"
      :avatar="{ icon: h(UserOutlined) }"
    />
    <Bubble
      :content="text.repeat(repeat)"
      :typing="{ step: 2, interval: 50, suffix: '💗' }"
      :avatar="{ icon: h(UserOutlined) }"
    />

    <Button
      :style="{ alignSelf: 'flex-end' }"
      @click="repeat = repeat < 5 ? repeat + 1 : 1"
    >
      Repeat {{ repeat }} Times
    </Button>
  </Flex>
</template>
