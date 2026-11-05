<script setup lang="ts">
defineOptions({ name: 'AXBubbleListV2Setup' });

import { computed, h, nextTick, onMounted, ref } from 'vue';
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
import { Avatar, Space, theme, Typography } from 'ant-design-vue';
import type { CSSProperties } from 'vue';

const { token } = theme.useToken();

const actionItems = [
  {
    key: 'retry',
    icon: h(RedoOutlined),
    label: 'Retry',
  },
  {
    key: 'copy',
    icon: h(CopyOutlined),
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

const markdownStyle = computed(
  () =>
    ({
      '--ax-link': token.value.colorLink,
      '--ax-link-hover': token.value.colorLinkHover,
    }) as CSSProperties,
);

const roles = computed<RoleType>(() => ({
  ai: {
    typing: true,
    header: 'AI',
    avatar: () => h(Avatar, { icon: h(AntDesignOutlined) }),
    footer: (content) => h(Actions, { items: actionItems, onClick: () => console.log(content) }),
  },
  user: (data) => ({
    placement: 'end',
    typing: false,
    header: `User-${data.key}`,
    avatar: () => h(Avatar, { icon: h(UserOutlined) }),
    footer: () =>
      h(Actions, {
        items: [
          data.editable
            ? { key: 'done', icon: h(CheckOutlined), label: 'done' }
            : { key: 'edit', icon: h(EditOutlined), label: 'edit' },
        ],
        onClick: ({ key }: { key: string }) => update(data.key, { editable: key === 'edit' }),
      }),
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
    contentRender: (content: FileCardProps) =>
      h(Space, null, () => [
        h(LinkOutlined),
        h(FileCard, { type: 'file', size: 'small', name: content.name, byte: content.byte }),
      ]),
  },
}));

const scrollTo = (option: { top: 'top' | 'bottom' }) => {
  nextTick(() => {
    listRef.value?.scrollTo({ ...option, behavior: 'smooth' });
  });
};

const addBubble = () => {
  const chatItems = items.value.filter((item) => item.role === 'ai' || item.role === 'user');
  const isAI = !!(chatItems.length % 2);
  add(genItem(isAI, { typing: { effect: 'fade-in', step: [20, 50] } }));
  if (enableLocScroll.value) scrollTo({ top: 'bottom' });
};

const addMarkdown = () => {
  add({
    key: getKey(),
    role: 'ai',
    typing: { effect: 'fade-in', step: 6 },
    content: text,
    contentRender: (content: string) =>
      h(Typography, { class: 'ax-bubble-md', style: markdownStyle.value }, () =>
        h(XMarkdown, { content }),
      ),
  });
  if (enableLocScroll.value) scrollTo({ top: 'bottom' });
};

const addDivider = () => {
  items.value = [...items.value, { key: getKey(), role: 'divider', content: 'Divider' }];
  if (enableLocScroll.value) scrollTo({ top: 'bottom' });
};

const addSystem = () => {
  items.value = [...items.value, { key: getKey(), role: 'system', content: 'This is a system message' }];
  if (enableLocScroll.value) scrollTo({ top: 'bottom' });
};

const addToTop = () => {
  const item = genItem(false);
  items.value = [item, genItem(true), genItem(false), ...items.value];
  if (enableLocScroll.value) scrollTo({ top: 'top' });
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
  if (enableLocScroll.value) scrollTo({ top: 'bottom' });
};
</script>

<template>
  <a-flex
    vertical
    :style="{ height: '720px' }"
    :gap="20"
  >
    <a-flex
      vertical
      gap="small"
    >
      <a-space align="center">
        <a-switch v-model:checked="autoScroll" />
        <span>启用 autoScroll / enabled autoScroll</span>
      </a-space>
      <a-space align="center">
        <a-switch v-model:checked="enableLocScroll" />
        <span>定位到新气泡 / locate to new bubble</span>
      </a-space>
    </a-flex>
    <a-flex
      gap="small"
      wrap="wrap"
    >
      <a-button
        type="primary"
        @click="addBubble"
      >
        Add Bubble
      </a-button>
      <a-button @click="addMarkdown">
        Add Markdown
      </a-button>
      <a-button @click="addDivider">
        Add Divider
      </a-button>
      <a-button @click="addSystem">
        Add System
      </a-button>
      <a-button @click="addToTop">
        Add To Top
      </a-button>
      <a-button @click="addWithRef">
        Add With Ref
      </a-button>
    </a-flex>
    <div :style="{ display: 'flex', flex: 1, minHeight: 0 }">
      <Bubble.List
        ref="listRef"
        :style="{ height: '620px' }"
        :roles="roles"
        :items="items"
        :auto-scroll="autoScroll"
      />
    </div>
  </a-flex>
</template>

<style>
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
