<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import {
  registerCatalog,
  XCard,
  type ActionPayload,
  type XAgentCommand_v0_9,
} from '@ant-design-x-vue/x-card';
import {
  CATALOGS,
  FilterContainer,
  FilterPanel,
  FilterProductList,
  type FilterState,
} from './_shared';

registerCatalog(CATALOGS.filter);

const HEADER_TEXT =
  'Welcome to Product Search! 🔍\n\nFind the perfect product by filtering by category, price, and rating. Results will update in real-time as you adjust filters.';

const commands = ref<XAgentCommand_v0_9[]>([]);
const sessionKey = ref(0);
let reloadTimer: number | undefined;

const append = (...next: XAgentCommand_v0_9[]) => {
  commands.value = [...commands.value, ...next];
};

const createFilterCommands = (): XAgentCommand_v0_9[] => [
  {
    version: 'v0.9',
    createSurface: {
      surfaceId: 'filter',
      catalogId: 'local://filter_search_catalog.json',
    },
  },
  {
    version: 'v0.9',
    updateComponents: {
      surfaceId: 'filter',
      components: [
        {
          id: 'filter-panel',
          component: 'FilterPanel',
          selectedCategories: { path: '/filter/filters/categories' },
          priceRange: { path: '/filter/filters/priceRange' },
          minRating: { path: '/filter/filters/minRating' },
          searchKeyword: { path: '/filter/filters/searchKeyword' },
          action: {
            event: {
              name: 'update_filters',
              context: { filters: { path: '/filter/filters' } },
            },
          },
        },
        {
          id: 'product-list',
          component: 'ProductList',
          filters: { path: '/filter/filters' },
        },
        {
          id: 'root',
          component: 'FilterContainer',
          children: ['filter-panel', 'product-list'],
        },
      ],
    },
  },
  {
    version: 'v0.9',
    updateDataModel: {
      surfaceId: 'filter',
      path: '/filter',
      value: {
        filters: {
          categories: [],
          priceRange: [0, 1500],
          minRating: 0,
          searchKeyword: '',
        },
      },
    },
  },
];

const handleAction = (payload: ActionPayload) => {
  if (payload.name !== 'update_filters') return;
  const filters = (payload.context as Record<string, any>)?.filters as
    | FilterState
    | undefined;
  if (!filters) return;
  append({
    version: 'v0.9',
    updateDataModel: {
      surfaceId: 'filter',
      path: '/filter/filters',
      value: filters,
    },
  });
};

const reload = () => {
  if (reloadTimer) window.clearTimeout(reloadTimer);
  append({ version: 'v0.9', deleteSurface: { surfaceId: 'filter' } });
  reloadTimer = window.setTimeout(() => {
    commands.value = [];
    sessionKey.value += 1;
    append(...createFilterCommands());
  }, 50);
};

onMounted(() => append(...createFilterCommands()));
onUnmounted(() => {
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
        Reload
      </button>
      <span style="color: #8c8c8c; font-size: 13px">搜索、分类、价格区间和评分共同写入 /filter/filters</span>
    </div>

    <div style="white-space: pre-wrap; line-height: 1.7; font-size: 14px; color: #595959; margin-bottom: 10px">
      {{ HEADER_TEXT }}
    </div>

    <XCard.Box
      :key="sessionKey"
      :commands="commands"
      :components="{
        FilterPanel,
        ProductList: FilterProductList,
        FilterContainer,
      }"
      :on-action="handleAction"
    >
      <XCard.Card id="filter" />
    </XCard.Box>
  </div>
</template>
