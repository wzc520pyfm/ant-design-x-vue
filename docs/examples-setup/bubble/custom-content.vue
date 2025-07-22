<script lang="ts" setup>
import { UserOutlined } from '@ant-design/icons-vue';
import { Bubble } from 'ant-design-x-vue';
import { Button, Flex, Image } from 'ant-design-vue';
import { h, ref, type VNode } from 'vue';

type ContentType = {
  imageUrl: string;
  text: string;
  actionNode: VNode;
};

const MyBubble = Bubble<ContentType>;

defineOptions({ name: 'AXBubbleCustomContentSetup' });

const contentState = ref<ContentType>({
  imageUrl:
    'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original',
  text: 'Ant Design X Vue',
  actionNode: h('span', 'Click Me'),
});
</script>
<template>
  <div style="height: 100px">
    <MyBubble
      :typing="true"
      :content="contentState"
      :avatar="{ icon: h(UserOutlined) }"
    >
      <template #message="{ content }">
        <Flex
          gap="middle"
          align="center"
        >
          <Image
            :height="50"
            :src="content.imageUrl"
          />
          <span style="font-size: 18px; font-weight: bold;">{{ content.text }}</span>
        </Flex>
      </template>
      <template #footer="{ content }">
        <Button
          type="text"
          @click="() => {
            contentState = {
              ...contentState,
              actionNode: h('span', '🎉 Happy Ant Design X Vue !'),
            };
          }"
        >
          <component :is="content?.actionNode" />
        </Button>
      </template>
    </MyBubble>
  </div>
</template>
