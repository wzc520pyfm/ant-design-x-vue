<script setup lang="tsx">
defineOptions({ name: 'AXXMarkdownThoughtChainV2' });

import { CheckCircleOutlined, InfoCircleOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import type { ThoughtChainItemType } from 'ant-design-x-vue';
import { Bubble, ThoughtChain } from 'ant-design-x-vue';
import { XMarkdown, type ComponentProps } from '@ant-design-x-vue/x-markdown';
import { Avatar, Button, Card, Flex, Spin } from 'ant-design-vue';
import { defineComponent, ref, type PropType } from 'vue';
import { textOf } from '../_shared/markdown-code';

function getStatusIcon(status: ThoughtChainItemType['status']) {
  switch (status) {
    case 'success':
      return <CheckCircleOutlined />;
    case 'error':
      return <InfoCircleOutlined />;
    case 'loading':
      return <LoadingOutlined />;
    default:
      return undefined;
  }
}

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const ThoughtPanel = defineComponent({
  name: 'XMarkdownThoughtPanel',
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

    return () => (
      <Card style={{ width: 500 }}>
        <Button onClick={onClick} style={{ marginBottom: 16 }} loading={loading.value}>
          {loading.value ? 'Running' : 'Run Next'}
        </Button>
        <ThoughtChain items={items.value} />
      </Card>
    );
  },
});

const text = `<div><thought>[{"title":"Thought Chain Item - 1","status":"success","description":"status: success"},{"title":"Thought Chain Item - 2","status":"error","description":"status: error"}]</thought></div>`;

const ThoughtComponent = (props: ComponentProps) => {
  if (props.streamStatus === 'loading') {
    return <Spin />;
  }
  const raw = textOf(props.children);
  if (!raw) return null;
  const data = JSON.parse(raw) as ThoughtChainItemType[];
  const withIcons = data.map((item) => ({
    ...item,
    icon: getStatusIcon(item.status),
  }));
  return <ThoughtPanel items={withIcons} />;
};

defineRender(() => (
  <Flex vertical gap="small">
    <Bubble
      content={text}
      contentRender={(content) => (
        <XMarkdown
          content={content as string}
          components={{ thought: ThoughtComponent }}
        />
      )}
      avatar={
        <Avatar src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*2Q5LRJ3LFPUAAAAAAAAAAAAADmJ7AQ/fmt.webp" />
      }
      variant="outlined"
    />
  </Flex>
));
</script>
