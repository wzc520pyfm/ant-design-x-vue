<script setup lang="ts">
import {
  CodeOutlined,
  FileImageOutlined,
  FileSearchOutlined,
  EditOutlined,
} from '@ant-design/icons-vue';
import { Card, Flex, Tag, Typography } from 'ant-design-vue';
import { Conversations, XProvider } from 'ant-design-x-vue';
import { h } from 'vue';

defineOptions({ name: 'AXProviderShortcutKeysSetup' });

const conversationItems = [
  { key: 'write', label: 'Help Me Write', icon: h(EditOutlined) },
  { key: 'coding', label: 'AI Coding', icon: h(CodeOutlined) },
  { key: 'createImage', label: 'Create Image', icon: h(FileImageOutlined) },
  { key: 'deepSearch', label: 'Deep Search', icon: h(FileSearchOutlined) },
];
</script>

<template>
  <div>
    <Flex :gap="12" style="margin-bottom: 16px" align="center">
      <Typography.Text>
        You can switch sessions using the shortcut key: <Tag>Alt/⌥</Tag> + <Tag>number</Tag>
      </Typography.Text>
    </Flex>
    <Card>
      <XProvider
        :conversations="{
          shortcutKeys: {
            items: ['Alt', 'number'],
          },
        }"
      >
        <Conversations
          style="width: 200px"
          default-active-key="write"
          :items="conversationItems"
        />
      </XProvider>
    </Card>
  </div>
</template>
