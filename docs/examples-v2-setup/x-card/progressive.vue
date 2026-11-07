<script setup lang="ts">
import { defineComponent, h, onMounted, onUnmounted, ref } from 'vue';
import { registerCatalog, XCard, type XAgentCommand_v0_9 } from '@ant-design-x-vue/x-card';

type Product = { id: number; name: string; price: number; tag?: string };

const batches: Product[][] = [
  [{ id: 1, name: '无线耳机', price: 299, tag: 'Hot' }, { id: 2, name: '机械键盘', price: 459 }],
  [{ id: 3, name: '智能手表', price: 1299, tag: 'New' }, { id: 4, name: '充电宝', price: 99 }],
  [{ id: 5, name: '降噪耳机', price: 899, tag: '推荐' }, { id: 6, name: '无线充', price: 149 }],
];

registerCatalog({
  $id: 'local://progressive',
  catalogId: 'local://progressive',
  components: {
    Shell: { type: 'object' },
    LoadingIndicator: { type: 'object' },
    ProductCard: { type: 'object' },
    ProductContainer: { type: 'object' },
  },
});

const Shell = defineComponent({
  name: 'Shell',
  setup(_, { slots }) {
    return () => h('div', { style: { display: 'grid', gap: '12px' } }, slots.default?.());
  },
});

const LoadingIndicator = defineComponent({
  name: 'LoadingIndicator',
  props: { progress: { type: Number, default: 0 }, total: { type: Number, default: 6 }, loading: { type: Boolean, default: false } },
  setup(props) {
    return () =>
      h('div', { style: { padding: '10px 12px', border: '1px solid #eee', borderRadius: '10px' } }, [
        h('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '6px' } }, [
          h('span', props.loading ? '正在加载商品…' : '加载完成'),
          h('span', { style: { color: '#999' } }, `${props.progress}/${props.total}`),
        ]),
        h('div', { style: { height: '6px', background: '#f0f0f0', borderRadius: '999px' } }, [
          h('div', {
            style: {
              width: `${Math.round((props.progress / props.total) * 100)}%`,
              height: '100%',
              borderRadius: '999px',
              background: props.loading ? '#1677ff' : '#52c41a',
              transition: 'width 0.3s ease',
            },
          }),
        ]),
      ]);
  },
});

const ProductCard = defineComponent({
  name: 'ProductCard',
  props: {
    name: { type: String, default: '' },
    price: { type: Number, default: 0 },
    tag: { type: String, default: '' },
    index: { type: Number, default: 0 },
  },
  setup(props) {
    const visible = ref(false);
    let timer: number | undefined;
    onMounted(() => {
      timer = window.setTimeout(() => {
        visible.value = true;
      }, props.index * 120);
    });
    onUnmounted(() => {
      if (timer) window.clearTimeout(timer);
    });
    return () =>
      h(
        'div',
        {
          style: {
            border: '1px solid #f0f0f0',
            borderRadius: '12px',
            padding: '12px',
            opacity: visible.value ? 1 : 0,
            transform: visible.value ? 'translateY(0)' : 'translateY(12px)',
            transition: 'all 0.35s ease',
          },
        },
        [
          h('div', [h('strong', props.name), props.tag ? h('span', { style: { marginLeft: '8px', color: '#d46b08' } }, props.tag) : null]),
          h('div', { style: { color: '#ff4d4f', fontWeight: 600, marginTop: '6px' } }, `¥${props.price}`),
        ],
      );
  },
});

const ProductContainer = defineComponent({
  name: 'ProductContainer',
  setup(_, { slots }) {
    return () =>
      h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' } }, slots.default?.());
  },
});

const commands = ref<XAgentCommand_v0_9[]>([
  { version: 'v0.9', createSurface: { surfaceId: 'progressive', catalogId: 'local://progressive' } },
  {
    version: 'v0.9',
    updateComponents: {
      surfaceId: 'progressive',
      components: [
        { id: 'root', component: 'Shell', children: ['progress', 'list'] },
        { id: 'progress', component: 'LoadingIndicator', progress: 0, total: 6, loading: true },
        { id: 'list', component: 'ProductContainer', children: [] },
      ],
    },
  },
]);

let timer: number | undefined;
onMounted(() => {
  const loaded: Product[] = [];
  let batch = 0;
  timer = window.setInterval(() => {
    if (batch >= batches.length) {
      window.clearInterval(timer);
      return;
    }
    loaded.push(...batches[batch]);
    batch += 1;
    const done = batch >= batches.length;
    commands.value = [
      ...commands.value,
      {
        version: 'v0.9',
        updateComponents: {
          surfaceId: 'progressive',
          components: [
            { id: 'root', component: 'Shell', children: ['progress', 'list'] },
            { id: 'progress', component: 'LoadingIndicator', progress: loaded.length, total: 6, loading: !done },
            ...loaded.map((product, index) => ({
              id: `product-${product.id}`,
              component: 'ProductCard',
              name: product.name,
              price: product.price,
              tag: product.tag,
              index,
            })),
            { id: 'list', component: 'ProductContainer', children: loaded.map((product) => `product-${product.id}`) },
          ],
        },
      },
    ];
  }, 700);
});

onUnmounted(() => {
  if (timer) window.clearInterval(timer);
});
</script>

<template>
  <XCard.Box :commands="commands" :components="{ Shell, LoadingIndicator, ProductCard, ProductContainer }">
    <XCard.Card id="progressive" />
  </XCard.Box>
</template>
