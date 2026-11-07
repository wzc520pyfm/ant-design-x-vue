<script setup lang="ts">
import { defineComponent, h, ref } from 'vue';
import { registerCatalog, XCard, type ActionPayload, type XAgentCommand_v0_9 } from '@ant-design-x-vue/x-card';

type Product = { id: number; name: string; price: number };
type CartItem = { product: Product; quantity: number };

const products: Product[] = [
  { id: 1, name: 'iPhone 15 Pro', price: 7999 },
  { id: 2, name: 'AirPods Pro 2', price: 1899 },
  { id: 3, name: 'Magic Keyboard', price: 1999 },
];

registerCatalog({
  $id: 'local://multi-card',
  catalogId: 'local://multi-card',
  components: {
    Row: { type: 'object' },
    ProductList: { type: 'object' },
    Cart: { type: 'object' },
  },
});

const Row = defineComponent({
  name: 'Row',
  setup(_, { slots }) {
    return () =>
      h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' } }, slots.default?.());
  },
});

const ProductList = defineComponent({
  name: 'ProductList',
  props: {
    items: { type: Array, default: () => [] },
    cart: { type: Array, default: () => [] },
    action: { type: Object, default: undefined },
    onAction: { type: Function, default: undefined },
  },
  setup(props) {
    return () =>
      h('div', { style: { border: '1px solid #eee', borderRadius: '12px', padding: '12px' } }, [
        h('h4', { style: { margin: '0 0 8px' } }, `商品（${(props.items as Product[]).length}）`),
        ...(props.items as Product[]).map((product) => {
          const qty = (props.cart as CartItem[]).find((c) => c.product.id === product.id)?.quantity || 0;
          return h('div', { key: product.id, style: { display: 'flex', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' } }, [
            h('span', `${product.name} · ¥${product.price}`),
            h(
              'button',
              {
                type: 'button',
                onClick: () => props.onAction?.(props.action?.event?.name || 'add_to_cart', { product }),
              },
              qty ? `再加一件（${qty}）` : '加入购物车',
            ),
          ]);
        }),
      ]);
  },
});

const Cart = defineComponent({
  name: 'Cart',
  props: {
    cart: { type: Array, default: () => [] },
    removeAction: { type: Object, default: undefined },
    onAction: { type: Function, default: undefined },
  },
  setup(props) {
    return () => {
      const cart = props.cart as CartItem[];
      const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      return h('div', { style: { border: '1px solid #eee', borderRadius: '12px', padding: '12px' } }, [
        h('h4', { style: { margin: '0 0 8px' } }, '购物车'),
        cart.length
          ? cart.map((item) =>
              h('div', { key: item.product.id, style: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' } }, [
                h('span', `${item.product.name} × ${item.quantity}`),
                h(
                  'button',
                  {
                    type: 'button',
                    onClick: () => props.onAction?.(props.removeAction?.event?.name || 'remove_from_cart', { productId: item.product.id }),
                  },
                  '移除',
                ),
              ]),
            )
          : h('p', { style: { margin: 0, color: '#999' } }, '购物车是空的'),
        h('p', { style: { margin: '12px 0 0', fontWeight: 600 } }, `合计 ¥${total.toLocaleString()}`),
      ]);
    };
  },
});

const commands = ref<XAgentCommand_v0_9[]>([
  { version: 'v0.9', createSurface: { surfaceId: 'shop', catalogId: 'local://multi-card' } },
  {
    version: 'v0.9',
    updateComponents: {
      surfaceId: 'shop',
      components: [
        { id: 'root', component: 'Row', children: ['products', 'cart'] },
        {
          id: 'products',
          component: 'ProductList',
          items: { path: '/products' },
          cart: { path: '/cart' },
          action: { event: { name: 'add_to_cart', context: { product: {} } } },
        },
        {
          id: 'cart',
          component: 'Cart',
          cart: { path: '/cart' },
          removeAction: { event: { name: 'remove_from_cart', context: { productId: {} } } },
        },
      ],
    },
  },
  { version: 'v0.9', updateDataModel: { surfaceId: 'shop', path: '/', value: { products, cart: [] } } },
]);

const handleAction = (payload: ActionPayload) => {
  cartState.value = applyCartAction(cartState.value, payload);
  commands.value = [
    ...commands.value,
    { version: 'v0.9', updateDataModel: { surfaceId: 'shop', path: '/cart', value: cartState.value } },
  ];
};

const cartState = ref<CartItem[]>([]);

function applyCartAction(cart: CartItem[], payload: ActionPayload): CartItem[] {
  if (payload.name === 'add_to_cart') {
    const product = payload.context.product as Product;
    if (!product) return cart;
    const existing = cart.find((item) => item.product.id === product.id);
    if (existing) {
      return cart.map((item) => (item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    }
    return [...cart, { product, quantity: 1 }];
  }
  if (payload.name === 'remove_from_cart') {
    return cart.filter((item) => item.product.id !== payload.context.productId);
  }
  return cart;
}
</script>

<template>
  <XCard.Box :commands="commands" :components="{ Row, ProductList, Cart }" :on-action="handleAction">
    <XCard.Card id="shop" />
  </XCard.Box>
</template>
