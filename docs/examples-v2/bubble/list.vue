<script setup lang="tsx">
defineOptions({ name: 'AXBubbleListV2' });

import { computed, nextTick, onMounted, ref, type CSSProperties } from 'vue';
import {
  AntDesignOutlined,
  CheckOutlined,
  CopyOutlined,
  EditOutlined,
  LinkOutlined,
  RedoOutlined,
  UserOutlined,
} from '@ant-design/icons-vue';
import {
  Actions,
  Bubble,
  FileCard,
  type BubbleItemType,
  type BubbleListRef,
  type FileCardProps,
  type RoleType,
} from 'ant-design-x-vue';
import { XMarkdown } from '@ant-design-x-vue/x-markdown';
import { Avatar, Button, Flex, Space, Switch, theme, Typography } from 'ant-design-vue';

const { token } = theme.useToken();

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
const enableLocScroll = ref(true);
const autoScroll = ref(true);
const listRef = ref<BubbleListRef | null>(null);

const update = (key: string | number, data: Partial<BubbleItemType>) => {
  items.value = items.value.map((item) => (item.key === key ? { ...item, ...data } : item));
};

const add = (item: BubbleItemType) => {
  items.value = [...items.value, item];
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
  reference: {
    variant: 'borderless',
    // 16px for list item gap
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

const scrollTo = (option: { top: 'top' | 'bottom' }) => {
  // Vue flushes the list DOM on the next tick. Measuring before that uses the
  // previous scroll height, so the jump misses the bubble that was just added.
  nextTick(() => {
    listRef.value?.scrollTo({ ...option, behavior: 'smooth' });
  });
};

const addBubble = () => {
  const chatItems = items.value.filter((item) => item.role === 'ai' || item.role === 'user');
  const isAI = !!(chatItems.length % 2);
  add(genItem(isAI, { typing: { effect: 'fade-in', step: [20, 50] } }));
  if (enableLocScroll.value) {
    scrollTo({ top: 'bottom' });
  }
};

const addMarkdown = () => {
  add({
    key: getKey(),
    role: 'ai',
    typing: { effect: 'fade-in', step: 6 },
    content: text,
    contentRender: (content: string) => (
      <Typography
        class="ax-bubble-md"
        style={
          {
            '--ax-link': token.value.colorLink,
            '--ax-link-hover': token.value.colorLinkHover,
          } as CSSProperties
        }
      >
        <XMarkdown content={content} />
      </Typography>
    ),
  });
  if (enableLocScroll.value) {
    scrollTo({ top: 'bottom' });
  }
};

const addDivider = () => {
  items.value = [...items.value, { key: getKey(), role: 'divider', content: 'Divider' }];
  if (enableLocScroll.value) {
    scrollTo({ top: 'bottom' });
  }
};

const addSystem = () => {
  items.value = [...items.value, { key: getKey(), role: 'system', content: 'This is a system message' }];
  if (enableLocScroll.value) {
    scrollTo({ top: 'bottom' });
  }
};

const addToTop = () => {
  const item = genItem(false);
  items.value = [item, genItem(true), genItem(false), ...items.value];
  if (enableLocScroll.value) {
    scrollTo({ top: 'top' });
  }
};

const addWithRef = () => {
  items.value = [
    ...items.value,
    {
      key: getKey(),
      role: 'reference',
      placement: 'end',
      content: { name: 'Ant-Design-X.pdf' },
    },
    genItem(false),
  ];
  if (enableLocScroll.value) {
    scrollTo({ top: 'bottom' });
  }
};

defineRender(() => (
  <Flex vertical style={{ height: '720px' }} gap={20}>
    <Flex vertical gap="small">
      <Space align="center">
        <Switch checked={autoScroll.value} onChange={(checked) => (autoScroll.value = !!checked)} />
        <span>启用 autoScroll / enabled autoScroll</span>
      </Space>
      <Space align="center">
        <Switch
          checked={enableLocScroll.value}
          onChange={(checked) => (enableLocScroll.value = !!checked)}
        />
        <span>定位到新气泡 / locate to new bubble</span>
      </Space>
    </Flex>
    <Flex gap="small" wrap="wrap">
      <Button type="primary" onClick={addBubble}>
        Add Bubble
      </Button>
      <Button onClick={addMarkdown}>Add Markdown</Button>
      <Button onClick={addDivider}>Add Divider</Button>
      <Button onClick={addSystem}>Add System</Button>
      <Button onClick={addToTop}>Add To Top</Button>
      <Button onClick={addWithRef}>Add With Ref</Button>
    </Flex>
    <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
      <Bubble.List
        style={{ height: '620px' }}
        ref={listRef}
        roles={roles.value}
        items={items.value}
        autoScroll={autoScroll.value}
      />
    </div>
  </Flex>
));
</script>

<style>
/* Match the React Bubble markdown demo inside VitePress.
   `.vp-doc a` underlines anchors, and `.x-markdown-light a::after` appends ↗. */
.vp-doc .example-showcase .ax-bubble-md a {
  color: var(--ax-link, #1677ff);
  font-weight: 400;
  text-decoration: none;
}

.vp-doc .example-showcase .ax-bubble-md a:hover,
.vp-doc .example-showcase .ax-bubble-md a:active {
  color: var(--ax-link-hover, var(--ax-link, #1677ff));
  text-decoration: none;
}

.vp-doc .example-showcase .ax-bubble-md a::before,
.vp-doc .example-showcase .ax-bubble-md a::after {
  content: none !important;
}

.vp-doc .example-showcase .ax-bubble-md p,
.vp-doc .example-showcase .ax-bubble-md blockquote > p {
  margin: 0;
  line-height: 1.5714285714;
  font-size: inherit;
  color: inherit;
}

.vp-doc .example-showcase .ax-bubble-md blockquote {
  margin: 1em 0;
  padding: 0 0 0 0.6em;
  border: 0;
  border-inline-start: 4px solid rgba(100, 100, 100, 0.2);
  background: transparent;
  color: inherit;
  opacity: 0.85;
}
</style>
