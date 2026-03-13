<script setup lang="tsx">
defineOptions({ name: 'AXBubbleListV2' });

import { ref, computed, onMounted } from 'vue';
import {
  AntDesignOutlined,
  CopyOutlined,
  CheckOutlined,
  EditOutlined,
  LinkOutlined,
  RedoOutlined,
  UserOutlined,
} from '@ant-design/icons-vue';
import { Bubble, Actions, FileCard, type BubbleItemType, type RoleType, type FileCardProps } from 'ant-design-x-vue';
import { XMarkdown } from '@ant-design-x-vue/x-markdown';
import { Avatar, Button, Flex, Space, Typography } from 'ant-design-vue';

const actionItems = [
  {
    key: 'retry',
    icon: <RedoOutlined />,
    label: 'Retry',
  },
  {
    key: 'copy',
    icon: <CopyOutlined />,
    label: 'Copy',
  },
];

let id = 0;
const getKey = () => `bubble_${id++}`;

const genItem = (isAI: boolean, config?: Partial<BubbleItemType>): BubbleItemType => ({
  key: getKey(),
  role: isAI ? 'ai' : 'user',
  content: `${id} : ${isAI ? 'Mock AI content'.repeat(50) : 'Mock user content.'}`,
  ...config,
});

const text = `
> Render as markdown content to show rich text!

Link: [Ant Design X](https://x.ant.design)
`.trim();

const items = ref<BubbleItemType[]>([]);

const update = (key: string | number, data: Partial<BubbleItemType>) => {
  items.value = items.value.map((item) => (item.key === key ? { ...item, ...data } : item));
};

onMounted(() => {
  items.value = [
    { key: getKey(), role: 'system', content: 'Welcome to use Ant Design X' },
    genItem(false, { typing: false }),
    genItem(true, { typing: false }),
    { key: getKey(), role: 'divider', content: 'divider' },
    genItem(false, { typing: false }),
    genItem(true, { typing: false, loading: true }),
  ];
});

const listRef = ref<InstanceType<typeof Bubble.List> | null>(null);

const roles = computed<RoleType>(() => ({
  ai: {
    typing: true,
    header: 'AI',
    avatar: () => <Avatar icon={<AntDesignOutlined />} />,
    footer: (content) => <Actions items={actionItems} onClick={() => console.log(content)} />,
  },
  user: (data) => ({
    placement: 'end',
    typing: false,
    header: `User-${data.key}`,
    avatar: () => <Avatar icon={<UserOutlined />} />,
    footer: () => (
      <Actions
        items={[
          data.editable
            ? { key: 'done', icon: <CheckOutlined />, label: 'done' }
            : { key: 'edit', icon: <EditOutlined />, label: 'edit' },
        ]}
        onClick={({ key }) => update(data.key, { editable: key === 'edit' })}
      />
    ),
    onEditConfirm: (content: string) => {
      console.log(`editing User-${data.key}: `, content);
      update(data.key, { content, editable: false });
    },
    onEditCancel: () => {
      update(data.key, { editable: false });
    },
  }),
  reference: {
    variant: 'borderless',
    styles: { root: { margin: 0, marginBottom: -12 } },
    avatar: () => '',
    contentRender: (content: FileCardProps) => (
      <Space>
        <LinkOutlined />
        <FileCard type="file" size="small" name={content.name} byte={content.byte} />
      </Space>
    ),
  },
}));

const addBubble = () => {
  const chatItems = items.value.filter((item) => item.role === 'ai' || item.role === 'user');
  const isAI = !!(chatItems.length % 2);
  items.value = [...items.value, genItem(isAI, { typing: { effect: 'fade-in', step: [20, 50] } })];
};

const addMarkdownMsg = () => {
  items.value = [
    ...items.value,
    {
      key: getKey(),
      role: 'ai',
      typing: { effect: 'fade-in', step: 6 },
      content: text,
      contentRender: (content: string) => (
        <Typography>
          <XMarkdown content={content} />
        </Typography>
      ),
    },
  ];
};

const addDivider = () => {
  items.value = [...items.value, { key: getKey(), role: 'divider', content: 'Divider' }];
};

const addSystem = () => {
  items.value = [...items.value, { key: getKey(), role: 'system', content: 'This is a system message' }];
};

const addToPre = () => {
  const item = genItem(false);
  items.value = [item, genItem(true), genItem(false), ...items.value];
  setTimeout(() => {
    listRef.value?.scrollTo({ key: item.key });
  }, 0);
};

const addWithRef = () => {
  items.value = [
    ...items.value,
    {
      key: getKey(),
      role: 'reference',
      placement: 'end',
      content: { name: 'Ant-Design-X.pdf' },
    } as any,
    genItem(false),
  ];
};

defineRender(() => (
  <Flex vertical style={{ height: '720px' }} gap={20}>
    <Flex gap="small">
      <Button type="primary" onClick={addBubble}>
        Add Bubble
      </Button>
      <Button onClick={addMarkdownMsg}>Add Markdown Msg</Button>
      <Button onClick={addDivider}>Add Divider</Button>
      <Button onClick={addSystem}>Add System</Button>
      <Button onClick={addToPre}>Add To Pre</Button>
      <Button onClick={addWithRef}>Add With Ref</Button>
    </Flex>
    <Bubble.List ref={listRef} roles={roles.value} items={items.value} />
  </Flex>
));
</script>
