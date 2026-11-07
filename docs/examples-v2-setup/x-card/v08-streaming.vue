<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import {
  XCard,
  type XAgentCommand_v0_8,
} from '@ant-design-x-vue/x-card';
import {
  LoadingProgress,
  RESTAURANT_DATA,
  RestaurantCard,
  RestaurantList,
  StreamContainer,
  TextBlock,
  type RestaurantItem,
} from './_shared';

const INTRO_TEXT = `Hello! I'm your food recommendation assistant 🍽️

Based on your location and preferences, I'm selecting the best restaurants nearby for you...

Here are my recommendation criteria:

1. **Distance First**: Prioritizing restaurants within 15 minutes walking distance
2. **Quality Guaranteed**: Selecting only restaurants with ratings above 4.5
3. **Diverse Cuisines**: Covering Chinese, Japanese, Western, and more

Generating personalized recommendations for you...`;

const commands = ref<XAgentCommand_v0_8[]>([]);
const introText = ref('');
let textTimer: number | undefined;
let progressTimer: number | undefined;

const append = (...next: XAgentCommand_v0_8[]) => {
  commands.value = [...commands.value, ...next];
};

const progressUpdate = (percent: number): XAgentCommand_v0_8 => ({
  dataModelUpdate: {
    surfaceId: 'recommendation',
    contents: [{ key: 'progress', valueString: String(percent) }],
  },
});

const restaurantsUpdate = (restaurants: RestaurantItem[]): XAgentCommand_v0_8 => ({
  dataModelUpdate: {
    surfaceId: 'recommendation',
    contents: [{ key: 'restaurants', valueString: JSON.stringify(restaurants) }],
  },
});

const createInitialCommands = (): XAgentCommand_v0_8[] => [
  {
    surfaceUpdate: {
      surfaceId: 'recommendation',
      components: [
        {
          id: 'title',
          component: {
            Text: {
              text: { literalString: 'AI Food Recommendations' },
              variant: { literalString: 'h1' },
            },
          },
        },
        {
          id: 'progress',
          component: {
            LoadingProgress: {
              percent: { path: '/progress' },
              status: { literalString: 'active' },
            },
          },
        },
        {
          id: 'restaurant-list',
          component: {
            RestaurantList: {
              restaurants: { path: '/restaurants' },
              loadingProgress: { path: '/progress' },
              isStreaming: { path: '/isStreaming' },
            },
          },
        },
        {
          id: 'root',
          component: {
            Container: {
              children: { explicitList: ['title', 'progress', 'restaurant-list'] },
            },
          },
        },
      ],
    },
  },
  {
    dataModelUpdate: {
      surfaceId: 'recommendation',
      contents: [
        { key: 'progress', valueString: '0' },
        { key: 'isStreaming', valueString: 'true' },
        { key: 'restaurants', valueString: '[]' },
      ],
    },
  },
  { beginRendering: { surfaceId: 'recommendation', root: 'root' } },
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
      append(restaurantsUpdate(RESTAURANT_DATA.slice(0, visibleCount)));
    }
    append(progressUpdate(progress));
    if (progress >= 100) {
      if (progressTimer) window.clearInterval(progressTimer);
      append({
        dataModelUpdate: {
          surfaceId: 'recommendation',
          contents: [{ key: 'isStreaming', valueString: 'false' }],
        },
      });
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
      append(...createInitialCommands());
      startProgress();
    }
  }, 24);
};

const reload = () => {
  if (progressTimer) window.clearInterval(progressTimer);
  append(
    { deleteSurface: { surfaceId: 'recommendation' } },
    ...createInitialCommands(),
  );
  startProgress();
};

onMounted(startIntro);
onUnmounted(() => {
  if (textTimer) window.clearInterval(textTimer);
  if (progressTimer) window.clearInterval(progressTimer);
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
        Refresh Recommendations
      </button>
      <span style="color: #8c8c8c; font-size: 13px">v0.8 dataModelUpdate 驱动进度与推荐列表</span>
    </div>

    <div style="white-space: pre-wrap; line-height: 1.7; font-size: 14px; color: #595959">{{ introText }}</div>

    <XCard.Box
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
