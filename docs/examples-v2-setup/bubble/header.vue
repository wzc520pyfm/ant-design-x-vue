<script setup lang="ts">
import { UserOutlined } from '@ant-design/icons-vue';
import { Bubble } from 'ant-design-x-vue';
</script>

<template>
  <a-flex vertical gap="small">
    <a-flex gap="small" wrap>
      <div :style="{ width: '100%' }">
        <Bubble content="align left" header="header">
          <template #avatar>
            <a-avatar>
              <template #icon>
                <UserOutlined />
              </template>
            </a-avatar>
          </template>
        </Bubble>
      </div>
    </a-flex>
    <a-flex gap="small" wrap>
      <div :style="{ width: '100%' }">
        <Bubble content="align right" placement="end" header="header">
          <template #avatar>
            <a-avatar>
              <template #icon>
                <UserOutlined />
              </template>
            </a-avatar>
          </template>
        </Bubble>
      </div>
    </a-flex>
  </a-flex>
</template>
