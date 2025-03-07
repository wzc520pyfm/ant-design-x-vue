<script setup lang="ts">
import { Bubble } from 'ant-design-x-vue';
import { UserOutlined } from '@ant-design/icons-vue';
import { Flex, Avatar } from 'ant-design-vue';
import type { CSSProperties } from 'vue';
import { h } from 'vue';

defineOptions({ name: 'AXBubbleAvatarAndPlacementSetup' });

const fooAvatar: CSSProperties = {
  color: '#f56a00',
  backgroundColor: '#fde3cf',
};

const barAvatar: CSSProperties = {
  color: '#fff',
  backgroundColor: '#87d068',
};

const hideAvatar: CSSProperties = {
  visibility: 'hidden',
};
</script>

<template>
  <Flex gap="middle" vertical>
    <Bubble
      placement="start"
      content="Good morning, how are you?"
      :avatar="{ icon: h(UserOutlined), style: fooAvatar }"
    />
    <Bubble
      placement="start"
      content="What a beautiful day!"
      :styles="{ avatar: hideAvatar }"
      :avatar="{}"
    />
    <Bubble
      placement="end"
      content="Hi, good morning, I'm fine!"
      :avatar="{ icon: h(UserOutlined), style: barAvatar }"
    />
    <Bubble
      placement="end"
      content="Thank you!"
      :styles="{ avatar: hideAvatar }"
      :avatar="{}"
    />
  </Flex>
</template>
