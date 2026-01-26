<script setup lang="tsx">
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
import { Bubble, Actions, type BubbleItemType, type RoleType } from 'ant-design-x-vue';
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
}));

const addBubble = () => {
  const chatItems = items.value.filter((item) => item.role === 'ai' || item.role === 'user');
  const isAI = !!(chatItems.length % 2);
  items.value = [...items.value, genItem(isAI, { typing: { effect: 'fade-in', step: [20, 50] } })];
};

const addDivider = () => {
  items.value = [...items.value, { key: getKey(), role: 'divider', content: 'Divider' }];
};

const addSystem = () => {
  items.value = [...items.value, { key: getKey(), role: 'system', content: 'This is a system message' }];
};

defineRender(() => (
  <Flex vertical style={{ height: '720px' }} gap={20}>
    <Flex gap="small">
      <Button type="primary" onClick={addBubble}>
        Add Bubble
      </Button>
      <Button onClick={addDivider}>Add Divider</Button>
      <Button onClick={addSystem}>Add System</Button>
    </Flex>
    <Bubble.List roles={roles.value} items={items.value} />
  </Flex>
));
</script>
