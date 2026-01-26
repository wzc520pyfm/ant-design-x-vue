<script setup lang="ts">
import { CopyOutlined, RedoOutlined, UserOutlined } from '@ant-design/icons-vue';
import { Bubble, Actions } from 'ant-design-x-vue';

const actionItems = [
  {
    key: 'retry',
    icon: RedoOutlined,
    label: 'Retry',
  },
  {
    key: 'copy',
    icon: CopyOutlined,
    label: 'Copy',
  },
];
</script>

<template>
  <a-flex vertical gap="small">
    <a-flex gap="small" wrap>
      <div :style="{ width: '100%' }">
        <Bubble content="outer footer" header="footer">
          <template #avatar>
            <a-avatar>
              <template #icon>
                <UserOutlined />
              </template>
            </a-avatar>
          </template>
          <template #footer="{ content }">
            <Actions :items="actionItems" @click="console.log(content)" />
          </template>
        </Bubble>
      </div>
    </a-flex>
    <a-flex gap="small" wrap>
      <div :style="{ width: '100%' }">
        <Bubble content="inner footer" placement="end" footer-placement="inner-end" header="footer">
          <template #avatar>
            <a-avatar>
              <template #icon>
                <UserOutlined />
              </template>
            </a-avatar>
          </template>
          <template #footer="{ content }">
            <Actions :items="actionItems" @click="console.log(content)" />
          </template>
        </Bubble>
      </div>
    </a-flex>
    <a-flex gap="small" wrap>
      <div :style="{ width: '100%' }">
        <Bubble content="outer footer and align right" footer-placement="outer-end" header="footer">
          <template #avatar>
            <a-avatar>
              <template #icon>
                <UserOutlined />
              </template>
            </a-avatar>
          </template>
          <template #footer="{ content }">
            <Actions :items="actionItems" @click="console.log(content)" />
          </template>
        </Bubble>
      </div>
    </a-flex>
    <a-flex gap="small" wrap>
      <div :style="{ width: '100%' }">
        <Bubble content="inner footer and align left" placement="end" footer-placement="inner-start" header="footer">
          <template #avatar>
            <a-avatar>
              <template #icon>
                <UserOutlined />
              </template>
            </a-avatar>
          </template>
          <template #footer="{ content }">
            <Actions :items="actionItems" @click="console.log(content)" />
          </template>
        </Bubble>
      </div>
    </a-flex>
  </a-flex>
</template>
