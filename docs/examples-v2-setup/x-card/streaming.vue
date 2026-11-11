<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import {
  registerCatalog,
  XCard,
  type XAgentCommand_v0_9,
} from '@ant-design-x-vue/x-card';
import {
  CATALOGS,
  LoadingProgress,
  RESTAURANT_DATA,
  RestaurantCard,
  RestaurantList,
  StreamContainer,
  TextBlock,
  type RestaurantItem,
} from './_shared';

registerCatalog(CATALOGS.streaming);

const INTRO_TEXT = `Hello! I'm your food recommendation assistant 🍽️

Based on your location and preferences, I'm selecting the best restaurants nearby for you...

Here are my recommendation criteria:

1. **Distance First**: Prioritizing restaurants within 15 minutes walking distance
2. **Quality Guaranteed**: Selecting only restaurants with ratings above 4.5
3. **Diverse Cuisines**: Covering Chinese, Japanese, Western, and more

Generating personalized recommendations for you...`;

const commands = ref<XAgentCommand_v0_9[]>([]);
const introText = ref('');
const sessionKey = ref(0);
let textTimer: number | undefined;
let progressTimer: number | undefined;
let reloadTimer: number | undefined;

const append = (...next: XAgentCommand_v0_9[]) => {
  commands.value = [...commands.value, ...next];
};

const createSurfaceCommands = (): XAgentCommand_v0_9[] => [
  {
    version: 'v0.9',
    createSurface: {
      surfaceId: 'recommendation',
      catalogId: 'local://restaurant_streaming_catalog.json',
    },
  },
  {
    version: 'v0.9',
    updateComponents: {
      surfaceId: 'recommendation',
      components: [
        { id: 'title', component: 'Text', text: 'AI Food Recommendations', variant: 'h1' },
        {
          id: 'progress',
          component: 'LoadingProgress',
          percent: { path: '/progress' },
          status: { path: '/progressStatus' },
        },
        {
          id: 'restaurant-list',
          component: 'RestaurantList',
          restaurants: { path: '/restaurants' },
          loadingProgress: { path: '/progress' },
          isStreaming: { path: '/isStreaming' },
        },
        {
          id: 'root',
          component: 'Container',
          children: ['title', 'progress', 'restaurant-list'],
        },
      ],
    },
  },
  {
    version: 'v0.9',
    updateDataModel: {
      surfaceId: 'recommendation',
      path: '/',
      value: {
        progress: 0,
        progressStatus: 'active',
        restaurants: [] as RestaurantItem[],
        isStreaming: true,
      },
    },
  },
];

const startProgress = () => {
  let progress = 0;
  let visibleCount = 0;
  if (progressTimer) window.clearInterval(progressTimer);
  progressTimer = window.setInterval(() => {
    progress = Math.min(100, progress + 5);
    const nextVisible = Math.ceil((progress / 100) * RESTAURANT_DATA.length);
    if (nextVisible !== visibleCount) {
      visibleCount = nextVisible;
      append({
        version: 'v0.9',
        updateDataModel: {
          surfaceId: 'recommendation',
          path: '/restaurants',
          value: RESTAURANT_DATA.slice(0, visibleCount),
        },
      });
    }
    append({
      version: 'v0.9',
      updateDataModel: {
        surfaceId: 'recommendation',
        path: '/progress',
        value: progress,
      },
    });

    if (progress >= 100) {
      if (progressTimer) window.clearInterval(progressTimer);
      append(
        {
          version: 'v0.9',
          updateDataModel: {
            surfaceId: 'recommendation',
            path: '/isStreaming',
            value: false,
          },
        },
        {
          version: 'v0.9',
          updateDataModel: {
            surfaceId: 'recommendation',
            path: '/progressStatus',
            value: 'success',
          },
        },
      );
    }
  }, 85);
};

const startIntro = () => {
  if (textTimer) window.clearInterval(textTimer);
  introText.value = '';
  let index = 0;
  textTimer = window.setInterval(() => {
    index = Math.min(index + 3, INTRO_TEXT.length);
    introText.value = INTRO_TEXT.slice(0, index);
    if (index >= INTRO_TEXT.length) {
      if (textTimer) window.clearInterval(textTimer);
      append(...createSurfaceCommands());
      startProgress();
    }
  }, 24);
};

const reload = () => {
  if (textTimer) window.clearInterval(textTimer);
  if (progressTimer) window.clearInterval(progressTimer);
  if (reloadTimer) window.clearTimeout(reloadTimer);
  introText.value = '';
  append({ version: 'v0.9', deleteSurface: { surfaceId: 'recommendation' } });
  reloadTimer = window.setTimeout(() => {
    commands.value = [];
    sessionKey.value += 1;
    startIntro();
  }, 50);
};

onMounted(startIntro);
onUnmounted(() => {
  if (textTimer) window.clearInterval(textTimer);
  if (progressTimer) window.clearInterval(progressTimer);
  if (reloadTimer) window.clearTimeout(reloadTimer);
});
</script>

<template>
  <div>
    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px">
      <button
        type="button"
        style="padding: 7px 13px; border: 0; border-radius: 7px; background: #1677ff; color: #fff; cursor: pointer"
        @click="reload"
      >
        Recommend Again
      </button>
      <span style="color: #8c8c8c; font-size: 13px">文本流式输出后，推荐卡片按进度逐步出现</span>
    </div>

    <div style="white-space: pre-wrap; line-height: 1.7; font-size: 14px; color: #595959">{{ introText }}</div>

    <XCard.Box
      :key="sessionKey"
      :commands="commands"
      :components="{
        Text: TextBlock,
        LoadingProgress,
        RestaurantCard,
        RestaurantList,
        Container: StreamContainer,
      }"
    >
      <XCard.Card id="recommendation" />
    </XCard.Box>
  </div>
</template>
