<script setup lang="tsx">
defineOptions({ name: 'AXXMarkdownThoughtChainV2Setup' });

import { CheckCircleOutlined, InfoCircleOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import type { ThoughtChainItemType } from 'ant-design-x-vue';
import { Bubble, ThoughtChain } from 'ant-design-x-vue';
import { XMarkdown, type ComponentProps } from '@ant-design-x-vue/x-markdown';
import { Avatar, Button, Card, Spin } from 'ant-design-vue';
import { defineComponent, h, ref, type PropType } from 'vue';
import { textOf } from '../../examples-v2/_shared/markdown-code';

function getStatusIcon(status: ThoughtChainItemType['status']) {
  switch (status) {
    case 'success':
      return h(CheckCircleOutlined);
    case 'error':
      return h(InfoCircleOutlined);
    case 'loading':
      return h(LoadingOutlined);
    default:
      return undefined;
  }
}

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const ThoughtPanel = defineComponent({
  name: 'XMarkdownThoughtPanelSetup',
  props: {
    items: { type: Array as PropType<ThoughtChainItemType[]>, required: true },
  },
  setup(props) {
    const items = ref<ThoughtChainItemType[]>([...props.items]);
    const loading = ref(false);

    const onClick = async () => {
      loading.value = true;
      items.value = [
        ...items.value,
        {
          title: `Thought Chain Item - ${items.value.length + 1}`,
          status: 'loading',
          icon: getStatusIcon('loading'),
          description: 'status: loading',
        },
      ];
      for (const status of ['error', 'loading', 'success'] as const) {
        await delay(800);
        const next = [...items.value];
        const last = { ...next[next.length - 1] };
        last.status = status;
        last.icon = getStatusIcon(status);
        last.description = `status: ${status}`;
        next[next.length - 1] = last;
        items.value = next;
      }
      loading.value = false;
    };

    return () =>
      h(Card, { style: { width: 500 } }, {
        default: () => [
          h(
            Button,
            { style: { marginBottom: '16px' }, loading: loading.value, onClick },
            () => (loading.value ? 'Running' : 'Run Next'),
          ),
          h(ThoughtChain, { items: items.value }),
        ],
      });
  },
});

const text = `<div><thought>[{"title":"Thought Chain Item - 1","status":"success","description":"status: success"},{"title":"Thought Chain Item - 2","status":"error","description":"status: error"}]</thought></div>`;

const ThoughtComponent = (props: ComponentProps) => {
  if (props.streamStatus === 'loading') return h(Spin);
  const raw = textOf(props.children);
  if (!raw) return null;
  const data = JSON.parse(raw) as ThoughtChainItemType[];
  const withIcons = data.map((item) => ({
    ...item,
    icon: getStatusIcon(item.status),
  }));
  return h(ThoughtPanel, { items: withIcons });
};

const components = { thought: ThoughtComponent };
const avatar = h(Avatar, {
  src: 'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*2Q5LRJ3LFPUAAAAAAAAAAAAADmJ7AQ/fmt.webp',
});
const renderContent = (content: unknown) =>
  h(XMarkdown, { content: String(content ?? ''), components });
</script>

<template>
  <a-flex vertical gap="small">
    <Bubble
      :content="text"
      :content-render="renderContent"
      :avatar="avatar"
      variant="outlined"
    />
  </a-flex>
</template>
