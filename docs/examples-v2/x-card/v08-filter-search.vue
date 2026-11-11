<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import {
  XCard,
  type ActionPayload,
  type XAgentCommand_v0_8,
} from '@ant-design-x-vue/x-card';
import {
  ColWrapper,
  FilterContainer,
  FilterPanel,
  FilterProductList,
  type FilterState,
} from './_shared';

const HEADER_TEXT =
  'Welcome to Product Search! 🔍\n\nFind the perfect product by filtering by category, price, and rating. Results will update in real-time as you adjust filters.';

const commands = ref<XAgentCommand_v0_8[]>([]);
const sessionKey = ref(0);
let reloadTimer: number | undefined;

const append = (...next: XAgentCommand_v0_8[]) => {
  commands.value = [...commands.value, ...next];
};

const createFilterCommands = (): XAgentCommand_v0_8[] => [
  {
    surfaceUpdate: {
      surfaceId: 'filter',
      components: [
        {
          id: 'filter-panel',
          component: {
            FilterPanel: {
              selectedCategories: { path: '/filters/categories' },
              priceRange: { path: '/filters/priceRange' },
              minRating: { path: '/filters/minRating' },
              searchKeyword: { path: '/filters/searchKeyword' },
              action: {
                name: 'update_filters',
                context: [{ key: 'filters', value: { path: '/filters' } }],
              },
            },
          },
        },
        {
          id: 'product-list',
          component: {
            ProductList: { filters: { path: '/filters' } },
          },
        },
        {
          id: 'col-filter',
          component: {
            ColWrapper: { span: { literalString: '8' }, child: 'filter-panel' },
          },
        },
        {
          id: 'col-products',
          component: {
            ColWrapper: { span: { literalString: '16' }, child: 'product-list' },
          },
        },
        {
          id: 'root',
          component: {
            FilterContainer: {
              children: { explicitList: ['col-filter', 'col-products'] },
            },
          },
        },
      ],
    },
  },
  {
    dataModelUpdate: {
      surfaceId: 'filter',
      contents: [
        {
          key: 'filters',
          valueMap: [
            { key: 'categories', valueString: '[]' },
            { key: 'priceRange', valueString: '[0,1500]' },
            { key: 'minRating', valueString: '0' },
            { key: 'searchKeyword', valueString: '' },
          ],
        },
      ],
    },
  },
  { beginRendering: { surfaceId: 'filter', root: 'root' } },
];

const handleAction = (payload: ActionPayload) => {
  if (payload.name !== 'update_filters') return;
  const filters = (payload.context as Record<string, any>)?.filters as
    | FilterState
    | undefined;
  if (!filters) return;
  append({
    dataModelUpdate: {
      surfaceId: 'filter',
      contents: [
        {
          key: 'filters',
          valueMap: [
            { key: 'categories', valueString: JSON.stringify(filters.categories || []) },
            { key: 'priceRange', valueString: JSON.stringify(filters.priceRange || [0, 1500]) },
            { key: 'minRating', valueString: String(filters.minRating || 0) },
            { key: 'searchKeyword', valueString: filters.searchKeyword || '' },
          ],
        },
      ],
    },
  });
};

const reload = () => {
  if (reloadTimer) window.clearTimeout(reloadTimer);
  append({ deleteSurface: { surfaceId: 'filter' } });
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
      <span style="color: #8c8c8c; font-size: 13px">v0.8 将 filters 以 valueMap JSON 字符串写回</span>
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
        ColWrapper,
      }"
      :on-action="handleAction"
    >
      <XCard.Card id="filter" />
    </XCard.Box>
  </div>
</template>
