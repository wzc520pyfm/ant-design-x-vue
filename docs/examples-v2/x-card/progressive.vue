<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import {
  registerCatalog,
  XCard,
  type XAgentCommand_v0_9,
} from '@ant-design-x-vue/x-card';
import {
  ALL_PROGRESS_PRODUCTS,
  CATALOGS,
  LoadingIndicator,
  ProductCard,
  ProductContainer,
  PROGRESS_PRODUCT_BATCHES,
  type Product,
} from './_shared';

registerCatalog(CATALOGS.progressive);

const WELCOME_TEXT =
  '🎉 Welcome to the progressive product showcase!\n\nProduct data will be loaded in batches, 2 products at a time. You can observe how components are displayed progressively.';
const COMPLETE_TEXT = '✅ All products loaded! Total 8 products loaded.';

const commands = ref<XAgentCommand_v0_9[]>([]);
const headerText = ref('');
const footerText = ref('');
let headerTimer: number | undefined;
let footerTimer: number | undefined;
let batchTimer: number | undefined;

const append = (...next: XAgentCommand_v0_9[]) => {
  commands.value = [...commands.value, ...next];
};

const createLoadingCommands = (progress: number, loading: boolean): XAgentCommand_v0_9[] => [
  {
    version: 'v0.9',
    createSurface: {
      surfaceId: 'loading-indicator',
      catalogId: 'local://coffee_booking_catalog.json',
    },
  },
  {
    version: 'v0.9',
    updateComponents: {
      surfaceId: 'loading-indicator',
      components: [
        {
          id: 'root',
          component: 'LoadingIndicator',
          progress,
          total: ALL_PROGRESS_PRODUCTS.length,
          loading,
        },
      ],
    },
  },
];

const updateLoading = (progress: number, loading: boolean): XAgentCommand_v0_9 => ({
  version: 'v0.9',
  updateComponents: {
    surfaceId: 'loading-indicator',
    components: [
      {
        id: 'root',
        component: 'LoadingIndicator',
        progress,
        total: ALL_PROGRESS_PRODUCTS.length,
        loading,
      },
    ],
  },
});

const updateProducts = (products: Product[]): XAgentCommand_v0_9 => ({
  version: 'v0.9',
  updateComponents: {
    surfaceId: 'progressive-demo',
    components: [
      ...products.map((product, index) => ({
        id: `product-${product.id}`,
        component: 'ProductCard',
        name: product.name,
        price: product.price,
        category: product.category,
        stock: product.stock,
        tag: product.tag,
        index,
      })),
      {
        id: 'root',
        component: 'ProductContainer',
        children: products.map((product) => `product-${product.id}`),
      },
    ],
  },
});

const streamFooter = () => {
  if (footerTimer) window.clearInterval(footerTimer);
  footerText.value = '';
  let index = 0;
  footerTimer = window.setInterval(() => {
    index = Math.min(index + 2, COMPLETE_TEXT.length);
    footerText.value = COMPLETE_TEXT.slice(0, index);
    if (index >= COMPLETE_TEXT.length && footerTimer) window.clearInterval(footerTimer);
  }, 28);
};

const startBatches = () => {
  let batchIndex = 0;
  const loaded: Product[] = [];

  const loadNext = () => {
    if (batchIndex >= PROGRESS_PRODUCT_BATCHES.length) {
      append(updateLoading(ALL_PROGRESS_PRODUCTS.length, false));
      streamFooter();
      return;
    }

    loaded.push(...PROGRESS_PRODUCT_BATCHES[batchIndex]);
    append(updateLoading(loaded.length, batchIndex < PROGRESS_PRODUCT_BATCHES.length - 1));
    batchTimer = window.setTimeout(() => {
      append(updateProducts([...loaded]));
      batchIndex += 1;
      batchTimer = window.setTimeout(loadNext, 550);
    }, 50);
  };

  loadNext();
};

const startFlow = () => {
  if (headerTimer) window.clearInterval(headerTimer);
  headerText.value = '';
  let index = 0;
  headerTimer = window.setInterval(() => {
    index = Math.min(index + 3, WELCOME_TEXT.length);
    headerText.value = WELCOME_TEXT.slice(0, index);
    if (index >= WELCOME_TEXT.length) {
      if (headerTimer) window.clearInterval(headerTimer);
      append(
        ...createLoadingCommands(0, true),
        {
          version: 'v0.9',
          createSurface: {
            surfaceId: 'progressive-demo',
            catalogId: 'local://coffee_booking_catalog.json',
          },
        },
      );
      startBatches();
    }
  }, 32);
};

const reload = () => {
  if (batchTimer) window.clearTimeout(batchTimer);
  if (footerTimer) window.clearInterval(footerTimer);
  footerText.value = '';
  append(
    { version: 'v0.9', deleteSurface: { surfaceId: 'loading-indicator' } },
    { version: 'v0.9', deleteSurface: { surfaceId: 'progressive-demo' } },
    ...createLoadingCommands(0, true),
    {
      version: 'v0.9',
      createSurface: {
        surfaceId: 'progressive-demo',
        catalogId: 'local://coffee_booking_catalog.json',
      },
    },
  );
  startBatches();
};

onMounted(startFlow);
onUnmounted(() => {
  if (headerTimer) window.clearInterval(headerTimer);
  if (footerTimer) window.clearInterval(footerTimer);
  if (batchTimer) window.clearTimeout(batchTimer);
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
      <span style="color: #8c8c8c; font-size: 13px">每批 2 个商品，通过 updateComponents 渐进追加</span>
    </div>

    <div style="white-space: pre-wrap; line-height: 1.7; font-size: 14px; color: #595959">{{ headerText }}</div>

    <XCard.Box
      :commands="commands"
      :components="{ ProductCard, ProductContainer, LoadingIndicator }"
    >
      <XCard.Card id="loading-indicator" />
      <XCard.Card id="progressive-demo" />
    </XCard.Box>

    <div
      v-if="footerText"
      style="white-space: pre-wrap; line-height: 1.7; font-size: 14px; color: #52c41a; margin-top: 10px"
    >
      {{ footerText }}
    </div>
  </div>
</template>
