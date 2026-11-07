<script setup lang="ts">
import { onMounted, ref } from 'vue';
import {
  XCard,
  type ActionPayload,
  type XAgentCommand_v0_8,
} from '@ant-design-x-vue/x-card';
import {
  CartCard,
  CheckoutSuccessCard,
  ColWrapper,
  MultiCardContainer,
  OrderSummaryCard,
  ProductListCard,
  SHOP_PRODUCTS,
  type CartItem,
  type Product,
} from './_shared';

const HEADER_TEXT =
  'Welcome to Smart Shopping Cart! 🛒\n\nBrowse products, add them to your cart, and see real-time price calculations. Experience the power of multi-surface collaboration!';

const commands = ref<XAgentCommand_v0_8[]>([]);
const cart = ref<CartItem[]>([]);

const append = (...next: XAgentCommand_v0_8[]) => {
  commands.value = [...commands.value, ...next];
};

const cartUpdate = (): XAgentCommand_v0_8 => ({
  dataModelUpdate: {
    surfaceId: 'shop',
    contents: [{ key: 'cart', valueString: JSON.stringify(cart.value) }],
  },
});

const createShopCommands = (): XAgentCommand_v0_8[] => [
  {
    surfaceUpdate: {
      surfaceId: 'shop',
      components: [
        {
          id: 'product-list-card',
          component: {
            ProductListCard: {
              products: { path: '/products' },
              cart: { path: '/cart' },
              action: {
                name: 'add_to_cart',
                context: [{ key: 'product', value: { path: '/addedProduct' } }],
              },
            },
          },
        },
        {
          id: 'cart-card',
          component: {
            CartCard: {
              cart: { path: '/cart' },
              updateAction: {
                name: 'update_quantity',
                context: [
                  { key: 'productId', value: { path: '/updateProductId' } },
                  { key: 'quantity', value: { path: '/updateQuantity' } },
                ],
              },
              removeAction: {
                name: 'remove_from_cart',
                context: [{ key: 'productId', value: { path: '/removeProductId' } }],
              },
            },
          },
        },
        {
          id: 'order-summary-card',
          component: {
            OrderSummaryCard: {
              cart: { path: '/cart' },
              checkoutAction: {
                name: 'checkout',
                context: [{ key: 'orderData', value: { path: '/orderData' } }],
              },
            },
          },
        },
        {
          id: 'col-products',
          component: {
            ColWrapper: { span: { literalString: '8' }, child: 'product-list-card' },
          },
        },
        {
          id: 'col-cart',
          component: {
            ColWrapper: { span: { literalString: '8' }, child: 'cart-card' },
          },
        },
        {
          id: 'col-summary',
          component: {
            ColWrapper: { span: { literalString: '8' }, child: 'order-summary-card' },
          },
        },
        {
          id: 'root',
          component: {
            MultiCardContainer: {
              children: {
                explicitList: ['col-products', 'col-cart', 'col-summary'],
              },
            },
          },
        },
      ],
    },
  },
  {
    dataModelUpdate: {
      surfaceId: 'shop',
      contents: [
        { key: 'products', valueString: JSON.stringify(SHOP_PRODUCTS) },
        { key: 'cart', valueString: '[]' },
      ],
    },
  },
  { beginRendering: { surfaceId: 'shop', root: 'root' } },
];

const createCheckoutSuccess = (total: number, itemCount: number): XAgentCommand_v0_8[] => {
  const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`;
  return [
    {
      surfaceUpdate: {
        surfaceId: 'checkout-success',
        components: [
          {
            id: 'success-card',
            component: {
              CheckoutSuccessCard: {
                total: { literalString: String(total) },
                itemCount: { literalString: String(itemCount) },
                orderNumber: { literalString: orderNumber },
              },
            },
          },
        ],
      },
    },
    { beginRendering: { surfaceId: 'checkout-success', root: 'success-card' } },
  ];
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
      append(cartUpdate());
      break;
    }
    case 'update_quantity': {
      const { productId, quantity } = context;
      if (!productId || !quantity) return;
      cart.value = cart.value.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item,
      );
      append(cartUpdate());
      break;
    }
    case 'remove_from_cart': {
      const { productId } = context;
      if (!productId) return;
      cart.value = cart.value.filter((item) => item.product.id !== productId);
      append(cartUpdate());
      break;
    }
    case 'checkout': {
      const total = Number(context.total) || 0;
      const itemCount = Number(context.itemCount) || 0;
      cart.value = [];
      append(
        { deleteSurface: { surfaceId: 'shop' } },
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
  cart.value = [];
  append(
    { deleteSurface: { surfaceId: 'shop' } },
    { deleteSurface: { surfaceId: 'checkout-success' } },
    ...createShopCommands(),
  );
};

onMounted(() => append(...createShopCommands()));
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
      <span style="color: #8c8c8c; font-size: 13px">v0.8 JSON 字符串 + dataModelUpdate 同步三张卡片</span>
    </div>

    <div style="white-space: pre-wrap; line-height: 1.7; font-size: 14px; color: #595959; margin-bottom: 10px">
      {{ HEADER_TEXT }}
    </div>

    <XCard.Box
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
