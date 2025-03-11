<script setup lang="ts">
import { EllipsisOutlined, ShareAltOutlined } from '@ant-design/icons-vue';
import { Button, Space } from 'ant-design-vue';
import { Welcome } from 'ant-design-x-vue';

defineOptions({ name: 'AXWelcomeVariantSetup' });
</script>
<template>
  <Welcome
    variant="borderless"
    icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
    title="Hello, I'm Ant Design X"
    description="Base on Ant Design, AGI product interface solution, create a better intelligent vision~"
  >
    <template #extra>
      <Space>
        <Button>
          <template #icon>
            <ShareAltOutlined />
          </template>
        </Button>
        <Button>
          <template #icon>
            <EllipsisOutlined />
          </template>
        </Button>
      </Space>
    </template>
  </Welcome>
</template>
