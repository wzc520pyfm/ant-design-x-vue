<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import {
  registerCatalog,
  XCard,
  type ActionPayload,
  type XAgentCommand_v0_9,
} from '@ant-design-x-vue/x-card';
import {
  CartCard,
  CATALOGS,
  CheckoutSuccessCard,
  ColWrapper,
  MultiCardContainer,
  OrderSummaryCard,
  ProductListCard,
  SHOP_PRODUCTS,
  type CartItem,
  type Product,
} from './_shared';

registerCatalog(CATALOGS.cart);

const HEADER_TEXT =
  'Welcome to Smart Shopping Cart! 🛒\n\nBrowse products, add them to your cart, and see real-time price calculations. Experience the power of multi-surface collaboration!';

const commands = ref<XAgentCommand_v0_9[]>([]);
const cart = ref<CartItem[]>([]);
const sessionKey = ref(0);
let reloadTimer: number | undefined;

const append = (...next: XAgentCommand_v0_9[]) => {
  commands.value = [...commands.value, ...next];
};

const createShopCommands = (): XAgentCommand_v0_9[] => [
  {
    version: 'v0.9',
    createSurface: {
      surfaceId: 'shop',
      catalogId: 'local://cart_demo_catalog.json',
    },
  },
  {
    version: 'v0.9',
    updateComponents: {
      surfaceId: 'shop',
      components: [
        {
          id: 'product-list-card',
          component: 'ProductListCard',
          products: { path: '/products' },
          cart: { path: '/cart' },
          action: {
            event: { name: 'add_to_cart', context: { product: {} } },
          },
        },
        {
          id: 'cart-card',
          component: 'CartCard',
          cart: { path: '/cart' },
          updateAction: {
            event: { name: 'update_quantity', context: { productId: {}, quantity: {} } },
          },
          removeAction: {
            event: { name: 'remove_from_cart', context: { productId: {} } },
          },
        },
        {
          id: 'order-summary-card',
          component: 'OrderSummaryCard',
          cart: { path: '/cart' },
          checkoutAction: {
            event: { name: 'checkout', context: { orderData: {} } },
          },
        },
        { id: 'col-products', component: 'ColWrapper', span: 8, children: ['product-list-card'] },
        { id: 'col-cart', component: 'ColWrapper', span: 8, children: ['cart-card'] },
        { id: 'col-summary', component: 'ColWrapper', span: 8, children: ['order-summary-card'] },
        {
          id: 'root',
          component: 'MultiCardContainer',
          children: ['col-products', 'col-cart', 'col-summary'],
        },
      ],
    },
  },
  {
    version: 'v0.9',
    updateDataModel: {
      surfaceId: 'shop',
      path: '/',
      value: { products: SHOP_PRODUCTS, cart: [] },
    },
  },
];

const createCheckoutSuccess = (total: number, itemCount: number): XAgentCommand_v0_9[] => {
  const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`;
  return [
    {
      version: 'v0.9',
      createSurface: {
        surfaceId: 'checkout-success',
        catalogId: 'local://cart_demo_catalog.json',
      },
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'checkout-success',
        components: [
          {
            id: 'root',
            component: 'CheckoutSuccessCard',
            total,
            itemCount,
            orderNumber,
          },
        ],
      },
    },
  ];
};

const syncCart = () => {
  append({
    version: 'v0.9',
    updateDataModel: {
      surfaceId: 'shop',
      path: '/cart',
      value: cart.value,
    },
  });
};

const handleAction = (payload: ActionPayload) => {
  const context = (payload.context || {}) as Record<string, any>;
  switch (payload.name) {
    case 'add_to_cart': {
      const product = context.product as Product | undefined;
      if (!product) return;
      const existing = cart.value.find((item) => item.product.id === product.id);
      cart.value = existing
        ? cart.value.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          )
        : [...cart.value, { product, quantity: 1 }];
      syncCart();
      break;
    }
    case 'update_quantity': {
      const { productId, quantity } = context;
      if (!productId || !quantity) return;
      cart.value = cart.value.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item,
      );
      syncCart();
      break;
    }
    case 'remove_from_cart': {
      const { productId } = context;
      if (!productId) return;
      cart.value = cart.value.filter((item) => item.product.id !== productId);
      syncCart();
      break;
    }
    case 'checkout': {
      const total = Number(context.total) || 0;
      const itemCount = Number(context.itemCount) || 0;
      cart.value = [];
      append(
        { version: 'v0.9', deleteSurface: { surfaceId: 'shop' } },
        ...createCheckoutSuccess(total, itemCount),
      );
      break;
    }
    case 'restart_demo': {
      reload();
      break;
    }
  }
};

const reload = () => {
  if (reloadTimer) window.clearTimeout(reloadTimer);
  cart.value = [];
  append(
    { version: 'v0.9', deleteSurface: { surfaceId: 'shop' } },
    { version: 'v0.9', deleteSurface: { surfaceId: 'checkout-success' } },
  );
  reloadTimer = window.setTimeout(() => {
    commands.value = [];
    sessionKey.value += 1;
    append(...createShopCommands());
  }, 50);
};

onMounted(() => append(...createShopCommands()));
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
      <span style="color: #8c8c8c; font-size: 13px">商品、购物车、订单摘要共享同一份 /cart 数据</span>
    </div>

    <div style="white-space: pre-wrap; line-height: 1.7; font-size: 14px; color: #595959; margin-bottom: 10px">
      {{ HEADER_TEXT }}
    </div>

    <XCard.Box
      :key="sessionKey"
      :commands="commands"
      :components="{
        ProductListCard,
        CartCard,
        OrderSummaryCard,
        ColWrapper,
        MultiCardContainer,
        CheckoutSuccessCard,
      }"
      :on-action="handleAction"
    >
      <XCard.Card id="shop" />
      <XCard.Card id="checkout-success" />
    </XCard.Box>
  </div>
</template>
