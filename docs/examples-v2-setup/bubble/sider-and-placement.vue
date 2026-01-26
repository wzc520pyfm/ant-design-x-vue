<script setup lang="ts">
import { CopyOutlined, UserOutlined } from '@ant-design/icons-vue';
import { Bubble } from 'ant-design-x-vue';
</script>

<template>
  <a-flex vertical gap="small">
    <a-flex gap="small" wrap>
      <div :style="{ width: '100%' }">
        <Bubble content="align left">
          <template #avatar>
            <a-tooltip title="main side">
              <a-avatar>
                <template #icon>
                  <UserOutlined />
                </template>
              </a-avatar>
            </a-tooltip>
          </template>
          <template #extra>
            <a-tooltip title="extra side">
              <CopyOutlined />
            </a-tooltip>
          </template>
        </Bubble>
      </div>
    </a-flex>
    <a-flex gap="small" wrap>
      <div :style="{ width: '100%' }">
        <Bubble content="align right" placement="end">
          <template #avatar>
            <a-tooltip title="main side">
              <a-avatar>
                <template #icon>
                  <UserOutlined />
                </template>
              </a-avatar>
            </a-tooltip>
          </template>
          <template #extra>
            <a-tooltip title="extra side">
              <CopyOutlined />
            </a-tooltip>
          </template>
        </Bubble>
      </div>
    </a-flex>
  </a-flex>
</template>
