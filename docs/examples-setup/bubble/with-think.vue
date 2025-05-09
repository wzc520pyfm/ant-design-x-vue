<script setup lang="ts">
import { BulbOutlined, DownOutlined, LoadingOutlined, UpOutlined, UserOutlined } from '@ant-design/icons-vue';
import { Button, Space, Typography } from 'ant-design-vue';
import { Bubble, type BubbleProps } from 'ant-design-x-vue';
import markdownit from 'markdown-it';
import { h, ref } from 'vue';

defineOptions({ name: 'AXBubbleWithThinkSetup' });

const md = markdownit({ html: true, breaks: true });

const think = ref(false);
const collapse = ref(false);
const thinkContent = ref('');
const answerContent = ref('');

const renderMarkdown: BubbleProps['messageRender'] = (content) => {
  return h(Typography, null, () => h('div', { innerHTML: md.render(content) }));
};
</script>

<template>
  <Space
    direction="vertical"
    size="large"
  >
    <Button
      :disabled="think"
      @click="() => {
        think = true;
        thinkContent += '> 好的，用户之前询问过我一些问题，我需要综合考虑，首先...';
        answerContent = '';
      }"
    >
      开始思考
    </Button>
    <Bubble
      v-if="thinkContent"
      :avatar="{ icon: h(UserOutlined) }"
      :styles="{ footer: { marginTop: 0 } }"
    >
      <template #message>
        <Space>
          <BulbOutlined />
          <span>{{ think ? "思考中..." : "已深度思考" }}</span>
          <Button
            type="text"
            size="small"
            style="background: transparent;"
            :icon="collapse ? h(UpOutlined) : h(DownOutlined)"
            @click="() => {
              collapse = !collapse;
            }"
          />
        </Space>
      </template>
      <template #footer>
        <Space direction="vertical">
          <Bubble
            v-show="!collapse"
            variant="borderless"
            :typing="true"
            :content="thinkContent"
            :message-render="renderMarkdown"
            @typing-complete="() => {
              think = false;
              answerContent += '思考完毕，这是我的答案。';
            }"
          />
          <LoadingOutlined v-if="think" />
          <Bubble
            variant="borderless"
            style="margin-top: -24px;"
            :typing="true"
            :content="answerContent"
            :message-render="renderMarkdown"
          />
        </Space>
      </template>
    </Bubble>
  </Space>
</template>
