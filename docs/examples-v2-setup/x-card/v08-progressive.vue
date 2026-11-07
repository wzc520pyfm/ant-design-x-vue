<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import {
  XCard,
  type XAgentCommand_v0_8,
} from '@ant-design-x-vue/x-card';
import {
  ALL_PROGRESS_PRODUCTS,
  LoadingIndicator,
  ProductCard,
  ProductContainer,
  PROGRESS_PRODUCT_BATCHES,
  type Product,
} from './_shared';

const WELCOME_TEXT =
  '🎉 Welcome to the progressive product showcase!\n\nProduct data will be loaded in batches, 2 products at a time. You can observe how components are displayed progressively.';
const COMPLETE_TEXT = '✅ All products loaded! Total 8 products loaded.';

const commands = ref<XAgentCommand_v0_8[]>([]);
const headerText = ref('');
const footerText = ref('');
const sessionKey = ref(0);
let headerTimer: number | undefined;
let footerTimer: number | undefined;
let batchTimer: number | undefined;
let reloadTimer: number | undefined;

const append = (...next: XAgentCommand_v0_8[]) => {
  commands.value = [...commands.value, ...next];
};

const updateLoading = (progress: number, loading: boolean): XAgentCommand_v0_8 => ({
  surfaceUpdate: {
    surfaceId: 'loading-indicator',
    components: [
      {
        id: 'root',
        component: {
          LoadingIndicator: {
            progress: { literalString: String(progress) },
            total: { literalString: String(ALL_PROGRESS_PRODUCTS.length) },
            loading: { literalString: String(loading) },
          },
        },
      },
    ],
  },
});

const updateProducts = (products: Product[]): XAgentCommand_v0_8 => ({
  surfaceUpdate: {
    surfaceId: 'progressive-demo',
    components: [
      ...products.map((product, index) => ({
        id: `product-${product.id}`,
        component: {
          ProductCard: {
            name: { literalString: product.name },
            price: { literalString: String(product.price) },
            category: { literalString: product.category },
            stock: { literalString: String(product.stock) },
            tag: product.tag ? { literalString: product.tag } : undefined,
            index: { literalString: String(index) },
          },
        },
      })),
      {
        id: 'root',
        component: {
          ProductContainer: {
            children: { explicitList: products.map((product) => `product-${product.id}`) },
          },
        },
      },
    ],
  },
});

const createInitialCommands = (): XAgentCommand_v0_8[] => [
  {
    surfaceUpdate: {
      surfaceId: 'loading-indicator',
      components: [
        {
          id: 'root',
          component: {
            LoadingIndicator: {
              progress: { literalString: '0' },
              total: { literalString: String(ALL_PROGRESS_PRODUCTS.length) },
              loading: { literalString: 'true' },
            },
          },
        },
      ],
    },
  },
  { beginRendering: { surfaceId: 'loading-indicator', root: 'root' } },
  updateProducts([]),
  { beginRendering: { surfaceId: 'progressive-demo', root: 'root' } },
];

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

const startHeader = () => {
  if (headerTimer) window.clearInterval(headerTimer);
  headerText.value = '';
  let index = 0;
  headerTimer = window.setInterval(() => {
    index = Math.min(index + 3, WELCOME_TEXT.length);
    headerText.value = WELCOME_TEXT.slice(0, index);
    if (index >= WELCOME_TEXT.length) {
      if (headerTimer) window.clearInterval(headerTimer);
      append(...createInitialCommands());
      startBatches();
    }
  }, 32);
};

const reload = () => {
  if (headerTimer) window.clearInterval(headerTimer);
  if (batchTimer) window.clearTimeout(batchTimer);
  if (footerTimer) window.clearInterval(footerTimer);
  if (reloadTimer) window.clearTimeout(reloadTimer);
  footerText.value = '';
  headerText.value = '';
  append(
    { deleteSurface: { surfaceId: 'loading-indicator' } },
    { deleteSurface: { surfaceId: 'progressive-demo' } },
  );
  reloadTimer = window.setTimeout(() => {
    commands.value = [];
    sessionKey.value += 1;
    startHeader();
  }, 50);
};

onMounted(startHeader);
onUnmounted(() => {
  if (headerTimer) window.clearInterval(headerTimer);
  if (footerTimer) window.clearInterval(footerTimer);
  if (batchTimer) window.clearTimeout(batchTimer);
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
      <span style="color: #8c8c8c; font-size: 13px">v0.8 surfaceUpdate 渐进更新两个 Surface</span>
    </div>

    <div style="white-space: pre-wrap; line-height: 1.7; font-size: 14px; color: #595959">{{ headerText }}</div>

    <XCard.Box
      :key="sessionKey"
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
