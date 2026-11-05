<script setup lang="tsx">
defineOptions({ name: 'AXBubbleListScrollV2' });

import { ref, computed, onMounted } from 'vue';
import { AntDesignOutlined, CopyOutlined, RedoOutlined, UserOutlined } from '@ant-design/icons-vue';
import { Bubble, Actions, type BubbleItemType, type RoleType, type BubbleListRef } from 'ant-design-x-vue';
import { Avatar, Button, Flex } from 'ant-design-vue';

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

const listRef = ref<BubbleListRef | null>(null);
const items = ref<BubbleItemType[]>([]);

onMounted(() => {
  items.value = [
    genItem(false, { typing: false }),
    genItem(true, { typing: false }),
    genItem(false, { typing: false }),
    genItem(true, { typing: false }),
    genItem(false, { typing: false }),
    genItem(true, { typing: false }),
    genItem(false, { typing: false }),
    genItem(true, { typing: false }),
    genItem(false, { typing: false }),
    genItem(true, { typing: false }),
    genItem(false, { typing: false }),
  ];
});

const roles = computed<RoleType>(() => ({
  ai: {
    typing: true,
    header: 'AI',
    avatar: () => <Avatar icon={<AntDesignOutlined />} />,
    footer: (content) => <Actions items={actionItems} onClick={() => console.log(content)} />,
  },
  user: {
    placement: 'end',
    typing: false,
    header: 'User',
    avatar: () => <Avatar icon={<UserOutlined />} />,
  },
}));

defineRender(() => (
  <Flex vertical style={{ height: '720px' }} gap="small">
    <Flex gap="small" justify="space-between">
      <Flex gap="small">
        <Button type="primary" onClick={() => console.log(listRef.value?.nativeElement)}>
          Get Dom
        </Button>
        <Button onClick={() => listRef.value?.scrollTo({ top: 'top' })}>Scroll To Top</Button>
        <Button onClick={() => listRef.value?.scrollTo({ top: 'bottom', behavior: 'smooth' })}>
          Scroll To Bottom
        </Button>
        <Button onClick={() => listRef.value?.scrollTo({ top: Math.random() * 1000 })}>
          Scroll To Random
        </Button>
        <Button onClick={() => listRef.value?.scrollTo({ key: items.value[1].key, block: 'nearest' })}>
          Scroll To Second
        </Button>
      </Flex>
    </Flex>

    <Bubble.List
      ref={listRef}
      roles={roles.value}
      items={items.value}
      onScroll={(e: Event) => {
        console.log('scroll', (e.target as HTMLDivElement).scrollTop);
      }}
    />
  </Flex>
));
</script>
