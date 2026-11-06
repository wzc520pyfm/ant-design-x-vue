<script setup lang="ts">
import { defineComponent, h, ref } from 'vue';
import { registerCatalog, XCard, type ActionPayload, type XAgentCommand_v0_9 } from '@ant-design-x-vue/x-card';

type Product = { id: number; name: string; category: string; price: number; rating: number };
type Filters = { keyword: string; category: string };

const allProducts: Product[] = [
  { id: 1, name: '无线耳机', category: 'Electronics', price: 299, rating: 4.5 },
  { id: 2, name: '机械键盘', category: 'Electronics', price: 459, rating: 4.8 },
  { id: 3, name: '智能手表', category: 'Wearable', price: 1299, rating: 4.7 },
  { id: 4, name: '充电宝', category: 'Accessories', price: 99, rating: 4.2 },
  { id: 5, name: '降噪耳机', category: 'Electronics', price: 899, rating: 4.9 },
  { id: 6, name: '无线充', category: 'Accessories', price: 149, rating: 4.3 },
];

registerCatalog({
  $id: 'local://filter-search',
  catalogId: 'local://filter-search',
  components: {
    Layout: { type: 'object' },
    FilterPanel: { type: 'object' },
    ProductList: { type: 'object' },
  },
});

const Layout = defineComponent({
  name: 'Layout',
  setup(_, { slots }) {
    return () =>
      h('div', { style: { display: 'grid', gridTemplateColumns: '220px 1fr', gap: '16px' } }, slots.default?.());
  },
});

const FilterPanel = defineComponent({
  name: 'FilterPanel',
  props: {
    filters: { type: Object, default: () => ({ keyword: '', category: '' }) },
    action: { type: Object, default: undefined },
    onAction: { type: Function, default: undefined },
  },
  setup(props) {
    const emit = (next: Filters) => {
      props.onAction?.(props.action?.event?.name || 'update_filters', { filters: next });
    };
    return () => {
      const filters = props.filters as Filters;
      return h('div', { style: { display: 'grid', gap: '10px', alignContent: 'start' } }, [
        h('input', {
          value: filters.keyword,
          placeholder: '搜索商品…',
          style: { padding: '6px 8px', border: '1px solid #d9d9d9', borderRadius: '6px' },
          onInput: (e: Event) => emit({ ...filters, keyword: (e.target as HTMLInputElement).value }),
        }),
        h(
          'select',
          {
            value: filters.category,
            style: { padding: '6px 8px', border: '1px solid #d9d9d9', borderRadius: '6px' },
            onChange: (e: Event) => emit({ ...filters, category: (e.target as HTMLSelectElement).value }),
          },
          [
            h('option', { value: '' }, '全部分类'),
            h('option', { value: 'Electronics' }, 'Electronics'),
            h('option', { value: 'Wearable' }, 'Wearable'),
            h('option', { value: 'Accessories' }, 'Accessories'),
          ],
        ),
      ]);
    };
  },
});

const ProductList = defineComponent({
  name: 'ProductList',
  props: {
    products: { type: Array, default: () => [] },
    filters: { type: Object, default: () => ({ keyword: '', category: '' }) },
  },
  setup(props) {
    return () => {
      const filters = props.filters as Filters;
      const keyword = (filters.keyword || '').toLowerCase();
      const result = (props.products as Product[]).filter((item) => {
        const hitKeyword = !keyword || item.name.toLowerCase().includes(keyword) || item.category.toLowerCase().includes(keyword);
        const hitCategory = !filters.category || item.category === filters.category;
        return hitKeyword && hitCategory;
      });
      return h('div', [
        h('p', { style: { margin: '0 0 8px' } }, `结果：${result.length}`),
        ...result.map((item) =>
          h('div', { key: item.id, style: { padding: '8px 0', borderBottom: '1px solid #f0f0f0' } }, [
            h('strong', item.name),
            h('span', { style: { marginLeft: '8px', color: '#1677ff' } }, `¥${item.price}`),
            h('span', { style: { marginLeft: '8px', color: '#999' } }, `${item.category} · ${item.rating}`),
          ]),
        ),
        result.length ? null : h('p', { style: { color: '#999' } }, '没有匹配的商品'),
      ]);
    };
  },
});

const commands = ref<XAgentCommand_v0_9[]>([
  { version: 'v0.9', createSurface: { surfaceId: 'filter', catalogId: 'local://filter-search' } },
  {
    version: 'v0.9',
    updateComponents: {
      surfaceId: 'filter',
      components: [
        { id: 'root', component: 'Layout', children: ['panel', 'list'] },
        {
          id: 'panel',
          component: 'FilterPanel',
          filters: { path: '/filters' },
          action: { event: { name: 'update_filters', context: { filters: { path: '/filters' } } } },
        },
        { id: 'list', component: 'ProductList', products: { path: '/products' }, filters: { path: '/filters' } },
      ],
    },
  },
  {
    version: 'v0.9',
    updateDataModel: {
      surfaceId: 'filter',
      path: '/',
      value: { products: allProducts, filters: { keyword: '', category: '' } },
    },
  },
]);

const handleAction = (payload: ActionPayload) => {
  if (payload.name !== 'update_filters') return;
  commands.value = [
    ...commands.value,
    { version: 'v0.9', updateDataModel: { surfaceId: 'filter', path: '/filters', value: payload.context.filters } },
  ];
};
</script>

<template>
  <XCard.Box :commands="commands" :components="{ Layout, FilterPanel, ProductList }" :on-action="handleAction">
    <XCard.Card id="filter" />
  </XCard.Box>
</template>
