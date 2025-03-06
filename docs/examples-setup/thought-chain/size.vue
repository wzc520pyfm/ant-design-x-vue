<script setup lang="ts">
import { MoreOutlined } from '@ant-design/icons-vue';
import { Button, Card, Radio, type ConfigProviderProps } from 'ant-design-vue';
import { ThoughtChain, type ThoughtChainProps } from 'ant-design-x-vue';
import { ref, h } from 'vue';

defineOptions({ name: 'AXThoughtChainSizeSetup' });

type SizeType = ConfigProviderProps['componentSize'];

const items: ThoughtChainProps['items'] = [
  {
    title: 'Thought Chain Item Title',
    description: 'description',
    extra: h(Button, { type: 'text', icon: h(MoreOutlined) }),
  },
  {
    title: 'Thought Chain Item Title',
    description: 'description',
    extra: h(Button, { type: 'text', icon: h(MoreOutlined) }),
  },
  {
    title: 'Thought Chain Item Title',
    description: 'description',
    extra: h(Button, { type: 'text', icon: h(MoreOutlined) }),
  },

  {
    title: 'Thought Chain Item Title',
    description: 'description',
    extra: h(Button, { type: 'text', icon: h(MoreOutlined) }),
  },
];

// default size is 'middle'
const size = ref<SizeType>('middle');
</script>
<template>
  <Card :style="{ width: '500px' }">
    <Radio.Group
      :value="size"
      :style="{ marginBottom: '16px' }"
      @change="
        (e) => {
          size = e.target.value;
        }
      "
    >
      <Radio.Button value="large">
        Large
      </Radio.Button>
      <Radio.Button value="middle">
        Default
      </Radio.Button>
      <Radio.Button value="small">
        Small
      </Radio.Button>
    </Radio.Group>
    <ThoughtChain
      :items="items"
      :size="size"
    />
  </Card>
</template>
