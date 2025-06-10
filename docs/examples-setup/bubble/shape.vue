<script setup lang="ts">
import { Bubble, type BubbleProps } from 'ant-design-x-vue';
import { Flex } from 'ant-design-vue';

defineOptions({ name: 'AXBubbleShapeSetup' });

const sharedLongTextProps: BubbleProps = {
  placement: 'end',
  content:
    'This is a long text message to show the multiline view of the bubble component. '.repeat(
      3,
    ),
  styles: { content: { maxWidth: 500 } },
};
</script>

<template>
  <Flex gap="middle" vertical>
    <Bubble content="shape: default" />
    <Bubble v-bind="sharedLongTextProps" />
    <Bubble content="shape: round" shape="round" />
    <Bubble v-bind="sharedLongTextProps" shape="round" />
    <Bubble content="shape: corner" shape="corner" />
    <Bubble v-bind="sharedLongTextProps" shape="corner" />
  </Flex>
</template>
