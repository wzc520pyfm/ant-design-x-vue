<script setup lang="ts">
import { Sender, SenderSwitch } from 'ant-design-x-vue';
import { Flex } from 'ant-design-vue';
import { ref } from 'vue';

const checked = ref(false);

const onChange = (v: boolean) => {
  checked.value = v;
};
</script>

<template>
  <Flex vertical gap="middle">
    <Flex align="center" gap="small">
      Default:
      <SenderSwitch>
        <template #icon><search-outlined /></template>
        Deep Search
      </SenderSwitch>
    </Flex>
    <Flex align="center" gap="small">
      Custom checked/unchecked content:
      <SenderSwitch
        checked-children="Deep Search: on"
        un-checked-children="Deep Search: off"
      >
        <template #icon><search-outlined /></template>
      </SenderSwitch>
    </Flex>
    <Flex align="center" gap="small">
      Disabled:
      <SenderSwitch disabled>
        <template #icon><search-outlined /></template>
        Deep Search
      </SenderSwitch>
    </Flex>
    <Flex align="center" gap="small">
      Loading:
      <SenderSwitch loading>
        <template #icon><search-outlined /></template>
        Deep Search
      </SenderSwitch>
    </Flex>
    <Flex align="center" gap="small">
      DefaultValue:
      <SenderSwitch :default-value="true" @change="(v: boolean) => console.log('Switch toggled', v)">
        <template #icon><search-outlined /></template>
        Deep Search
      </SenderSwitch>
    </Flex>
    <Flex align="center" gap="small">
      Controlled mode:
      <SenderSwitch :value="checked" :on-change="onChange">
        <template #icon><search-outlined /></template>
        Deep Search
      </SenderSwitch>
    </Flex>
  </Flex>
</template>
