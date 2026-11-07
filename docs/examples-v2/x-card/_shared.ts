import { defineComponent, h, onMounted, onUnmounted, ref, watch, type PropType } from 'vue';
import { useXCardField, type XCardFieldRule } from '@ant-design-x-vue/x-card';

export type Product = {
  id: number;
  name: string;
  description?: string;
  price: number;
  category: string;
  stock: number;
  tag?: string;
  rating?: number;
  tags?: string[];
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type CoffeeItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  tag?: string;
};

export type RestaurantItem = {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  priceRange: string;
  distance: string;
  tags: string[];
  description: string;
};

export type FileNode = {
  key: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  size?: number;
  modified?: string;
  language?: string;
  description?: string;
};

export type FileDetail = {
  name: string;
  path: string;
  size: number;
  modified: string;
  language: string;
  description: string;
};

export type PanelItem = {
  id: string;
  title: string;
  content: string;
};

export type FilterState = {
  categories: string[];
  priceRange: [number, number];
  minRating: number;
  searchKeyword: string;
};

export const COFFEE_LIST: CoffeeItem[] = [
  {
    id: 1,
    name: 'Latte',
    description: 'Espresso + Steamed Milk, smooth and silky',
    price: 32,
    tag: 'Hot',
  },
  {
    id: 2,
    name: 'Americano',
    description: 'Pure bitter aroma, refreshing',
    price: 25,
  },
  {
    id: 3,
    name: 'Cappuccino',
    description: 'Rich foam, classic Italian style',
    price: 30,
    tag: 'Recommended',
  },
];

export const PROGRESS_PRODUCT_BATCHES: Product[][] = [
  [
    {
      id: 1,
      name: 'Wireless Bluetooth Earphones',
      price: 299,
      category: 'Digital',
      stock: 156,
      tag: 'Hot',
    },
    {
      id: 2,
      name: 'Mechanical Keyboard',
      price: 459,
      category: 'Digital',
      stock: 89,
    },
  ],
  [
    {
      id: 3,
      name: 'Smart Watch',
      price: 1299,
      category: 'Wearable',
      stock: 45,
      tag: 'New',
    },
    {
      id: 4,
      name: 'Portable Power Bank',
      price: 99,
      category: 'Accessories',
      stock: 234,
    },
  ],
  [
    {
      id: 5,
      name: 'Noise Cancelling Headphones',
      price: 899,
      category: 'Digital',
      stock: 67,
      tag: 'Recommended',
    },
    {
      id: 6,
      name: 'Wireless Charger',
      price: 149,
      category: 'Accessories',
      stock: 178,
    },
  ],
  [
    {
      id: 7,
      name: 'Smart Speaker',
      price: 399,
      category: 'Home',
      stock: 112,
      tag: 'Hot',
    },
    {
      id: 8,
      name: 'Fitness Tracker',
      price: 199,
      category: 'Wearable',
      stock: 256,
    },
  ],
];

export const ALL_PROGRESS_PRODUCTS = PROGRESS_PRODUCT_BATCHES.flat();

export const RESTAURANT_DATA: RestaurantItem[] = [
  {
    id: 'r1',
    name: 'Jiangnan Bistro',
    cuisine: 'Jiangsu-Zhejiang',
    rating: 4.8,
    priceRange: '¥80-150',
    distance: '500m',
    tags: ['Local Cuisine', 'Elegant Ambiance'],
    description:
      'Authentic Jiangsu-Zhejiang flavors with locally sourced ingredients. Signature dishes: Braised Pork, Steamed Sea Bass.',
  },
  {
    id: 'r2',
    name: 'Sichuan House',
    cuisine: 'Sichuan',
    rating: 4.6,
    priceRange: '¥60-120',
    distance: '800m',
    tags: ['Spicy & Flavorful', 'Great Value'],
    description:
      'Authentic Sichuan cuisine, spicy and aromatic. Recommended: Boiled Fish, Mapo Tofu, Twice-cooked Pork.',
  },
  {
    id: 'r3',
    name: 'Sakura Japanese',
    cuisine: 'Japanese',
    rating: 4.9,
    priceRange: '¥150-300',
    distance: '1.2km',
    tags: ['Exquisite Cuisine', 'Perfect for Dates'],
    description:
      'Fresh sashimi, exquisite sushi, fusion of traditional and modern Japanese. Chef from Tokyo Ginza.',
  },
  {
    id: 'r4',
    name: 'Italian Garden',
    cuisine: 'Western',
    rating: 4.5,
    priceRange: '¥120-250',
    distance: '900m',
    tags: ['Romantic Atmosphere', 'Handmade Pasta'],
    description:
      'Authentic Italian flavors, handmade pasta with imported ingredients. Signature: Creamy Mushroom Pasta, Tiramisu.',
  },
];

export const PROJECT_FILES: FileNode[] = [
  {
    key: 'src',
    name: 'src',
    type: 'folder',
    children: [
      {
        key: 'src/components',
        name: 'components',
        type: 'folder',
        children: [
          {
            key: 'src/components/Button.tsx',
            name: 'Button.tsx',
            type: 'file',
            size: 2048,
            modified: '2024-01-15',
            language: 'TypeScript',
            description: 'A reusable button component with multiple variants',
          },
          {
            key: 'src/components/Card.tsx',
            name: 'Card.tsx',
            type: 'file',
            size: 3584,
            modified: '2024-01-14',
            language: 'TypeScript',
            description: 'Card component for displaying content in a container',
          },
          {
            key: 'src/components/Modal.tsx',
            name: 'Modal.tsx',
            type: 'file',
            size: 4096,
            modified: '2024-01-13',
            language: 'TypeScript',
            description: 'Modal dialog component with overlay',
          },
        ],
      },
      {
        key: 'src/hooks',
        name: 'hooks',
        type: 'folder',
        children: [
          {
            key: 'src/hooks/useAuth.ts',
            name: 'useAuth.ts',
            type: 'file',
            size: 1536,
            modified: '2024-01-12',
            language: 'TypeScript',
            description: 'Authentication hook for user login/logout',
          },
          {
            key: 'src/hooks/useTheme.ts',
            name: 'useTheme.ts',
            type: 'file',
            size: 1024,
            modified: '2024-01-11',
            language: 'TypeScript',
            description: 'Theme management hook',
          },
        ],
      },
      {
        key: 'src/App.tsx',
        name: 'App.tsx',
        type: 'file',
        size: 2560,
        modified: '2024-01-10',
        language: 'TypeScript',
        description: 'Main application entry component',
      },
      {
        key: 'src/index.tsx',
        name: 'index.tsx',
        type: 'file',
        size: 512,
        modified: '2024-01-09',
        language: 'TypeScript',
        description: 'Application bootstrap file',
      },
    ],
  },
  {
    key: 'public',
    name: 'public',
    type: 'folder',
    children: [
      {
        key: 'public/index.html',
        name: 'index.html',
        type: 'file',
        size: 768,
        modified: '2024-01-08',
        language: 'HTML',
        description: 'HTML template for the application',
      },
      {
        key: 'public/favicon.ico',
        name: 'favicon.ico',
        type: 'file',
        size: 4096,
        modified: '2024-01-07',
        language: 'Binary',
        description: 'Application favicon',
      },
    ],
  },
  {
    key: 'package.json',
    name: 'package.json',
    type: 'file',
    size: 1280,
    modified: '2024-01-16',
    language: 'JSON',
    description: 'Project dependencies and scripts configuration',
  },
  {
    key: 'README.md',
    name: 'README.md',
    type: 'file',
    size: 2048,
    modified: '2024-01-17',
    language: 'Markdown',
    description: 'Project documentation and usage guide',
  },
];

export const PANEL_DATA: PanelItem[] = [
  {
    id: 'overview',
    title: 'Project Overview',
    content:
      'This is a React-based web application built with TypeScript. It follows a component-based architecture with hooks for state management.',
  },
  {
    id: 'tech-stack',
    title: 'Tech Stack',
    content:
      '- React 18.x\n- TypeScript 5.x\n- Ant Design 5.x\n- Vite for build tooling\n- ESLint & Prettier for code quality',
  },
  {
    id: 'structure',
    title: 'Directory Structure',
    content:
      '- src/components: Reusable UI components\n- src/hooks: Custom React hooks\n- public: Static assets\n- package.json: Dependencies',
  },
];

export const SHOP_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'iPhone 15 Pro',
    description: 'A17 Pro chip, 48MP camera system',
    price: 7999,
    category: 'Electronics',
    tag: 'Hot',
    stock: 50,
  },
  {
    id: 2,
    name: 'MacBook Air M3',
    description: 'M3 chip, 15-inch Liquid Retina display',
    price: 10999,
    category: 'Electronics',
    tag: 'New',
    stock: 30,
  },
  {
    id: 3,
    name: 'AirPods Pro 2',
    description: 'Active Noise Cancellation, Adaptive Audio',
    price: 1899,
    category: 'Accessories',
    tag: 'Popular',
    stock: 100,
  },
  {
    id: 4,
    name: 'Apple Watch Ultra 2',
    description: 'The most rugged Apple Watch, titanium case',
    price: 6499,
    category: 'Wearable',
    stock: 25,
  },
  {
    id: 5,
    name: 'iPad Pro M2',
    description: 'M2 chip, 12.9-inch Liquid Retina XDR display',
    price: 9299,
    category: 'Electronics',
    tag: 'Recommended',
    stock: 40,
  },
  {
    id: 6,
    name: 'Magic Keyboard',
    description: 'Wireless, rechargeable, with Touch ID',
    price: 1999,
    category: 'Accessories',
    stock: 80,
  },
];

export const FILTER_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Wireless Bluetooth Earphones',
    price: 299,
    category: 'Electronics',
    stock: 156,
    tag: 'Hot',
    tags: ['Hot', 'Wireless'],
  } as Product,
  {
    id: 2,
    name: 'Mechanical Keyboard RGB',
    price: 459,
    category: 'Electronics',
    stock: 89,
    tag: 'Gaming',
    tags: ['Gaming'],
  } as Product,
  {
    id: 3,
    name: 'Smart Watch Pro',
    price: 1299,
    category: 'Wearable',
    stock: 45,
    tag: 'New',
    tags: ['New', 'Smart'],
  } as Product,
  {
    id: 4,
    name: 'Portable Power Bank',
    price: 99,
    category: 'Accessories',
    stock: 234,
    tag: 'Portable',
    tags: ['Portable'],
  } as Product,
  {
    id: 5,
    name: 'Noise Cancelling Headphones',
    price: 899,
    category: 'Electronics',
    stock: 67,
    tag: 'Premium',
    tags: ['Premium', 'Hot'],
  } as Product,
  {
    id: 6,
    name: 'Wireless Charger Pad',
    price: 149,
    category: 'Accessories',
    stock: 178,
    tag: 'Wireless',
    tags: ['Wireless'],
  } as Product,
  {
    id: 7,
    name: 'Smart Speaker Mini',
    price: 399,
    category: 'Home',
    stock: 112,
    tag: 'Smart Home',
    tags: ['Smart Home'],
  } as Product,
  {
    id: 8,
    name: 'Fitness Tracker Band',
    price: 199,
    category: 'Wearable',
    stock: 256,
    tag: 'Fitness',
    tags: ['Fitness'],
  } as Product,
  {
    id: 9,
    name: 'USB-C Hub Multiport',
    price: 249,
    category: 'Accessories',
    stock: 143,
    tag: 'Hot',
    tags: ['Hot'],
  } as Product,
  {
    id: 10,
    name: 'Gaming Mouse Pro',
    price: 399,
    category: 'Electronics',
    stock: 98,
    tag: 'Gaming',
    tags: ['Gaming', 'RGB'],
  } as Product,
];

export function toArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (typeof value === 'string' && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? (parsed as T[]) : [];
    } catch {
      return [];
    }
  }
  return [];
}

export function toObject<T extends Record<string, any>>(value: unknown, fallback: T): T {
  if (value && typeof value === 'object' && !Array.isArray(value)) return value as T;
  if (typeof value === 'string' && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed as T;
    } catch {
      return fallback;
    }
  }
  return fallback;
}

export function normalizePanels(value: unknown): PanelItem[] {
  if (Array.isArray(value)) return value as PanelItem[];
  if (value && typeof value === 'object') {
    return Object.values(value as Record<string, unknown>)
      .map((item) => {
        if (typeof item === 'string') {
          try {
            return JSON.parse(item);
          } catch {
            return null;
          }
        }
        return item;
      })
      .filter(Boolean) as PanelItem[];
  }
  return PANEL_DATA;
}

export function actionName(action: any): string | undefined {
  return action?.event?.name || action?.name;
}

export function actionContextKeys(action: any): string[] {
  const context = action?.event?.context ?? action?.context;
  if (Array.isArray(context)) {
    return context.map((item) => item?.key).filter((key): key is string => typeof key === 'string');
  }
  if (context && typeof context === 'object') return Object.keys(context);
  return [];
}

export function buildActionContext(action: any, value: unknown): Record<string, unknown> {
  return actionContextKeys(action).reduce<Record<string, unknown>>((context, key) => {
    context[key] = value;
    return context;
  }, {});
}

export function formatDate(value: unknown): string {
  if (!value) return '';
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function catalog(id: string, names: string[]) {
  return {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: id,
    catalogId: id,
    components: Object.fromEntries(names.map((name) => [name, { type: 'object' as const }])),
  };
}

export const CATALOGS = {
  coffee: catalog('local://coffee_booking_catalog.json', [
    'Text',
    'DateTimeInput',
    'BookForm',
    'ActionButton',
    'CoffeeList',
    'CoffeeResultCard',
  ]),
  form: catalog('local://form_validation_catalog.json', ['RegistrationForm', 'SuccessCard']),
  progressive: catalog('local://coffee_booking_catalog.json', [
    'ProductCard',
    'ProductContainer',
    'LoadingIndicator',
  ]),
  streaming: catalog('local://restaurant_streaming_catalog.json', [
    'Text',
    'LoadingProgress',
    'RestaurantCard',
    'RestaurantList',
    'Container',
  ]),
  nested: catalog('local://nested_interaction_catalog.json', [
    'Text',
    'FileTree',
    'FileDetailCard',
    'AccordionPanel',
    'MainContainer',
  ]),
  cart: catalog('local://cart_demo_catalog.json', [
    'ProductListCard',
    'CartCard',
    'OrderSummaryCard',
    'ColWrapper',
    'MultiCardContainer',
    'CheckoutSuccessCard',
  ]),
  filter: catalog('local://filter_search_catalog.json', [
    'FilterPanel',
    'ProductList',
    'FilterContainer',
  ]),
  action: catalog('local://action_resolve_catalog', [
    'FormCard',
    'Title',
    'FormInput',
    'SubmitButton',
  ]),
};

export const TextBlock = defineComponent({
  name: 'DemoText',
  props: {
    text: { type: String, default: '' },
    variant: { type: String, default: 'body' },
    status: { type: String, default: '' },
  },
  setup(props, { slots }) {
    return () => {
      const content = props.text || slots.default?.();
      if (!content) return null;
      const styles: Record<string, Record<string, string>> = {
        h1: { fontSize: '20px', fontWeight: '700', margin: '0 0 12px' },
        h2: { fontSize: '17px', fontWeight: '600', margin: '0 0 8px' },
        h3: { fontSize: '15px', fontWeight: '600', margin: '0 0 6px' },
        body: { fontSize: '14px', margin: '0' },
        success: {
          fontSize: '14px',
          fontWeight: '600',
          color: '#52c41a',
          margin: '4px 0 0',
          padding: '6px 10px',
          borderRadius: '8px',
          background: '#f6ffed',
          border: '1px solid #b7eb8f',
        },
      };
      return h('p', { style: styles[props.status === 'success' ? 'success' : props.variant] || styles.body }, content);
    };
  },
});

export const BookForm = defineComponent({
  name: 'BookForm',
  setup(_, { slots }) {
    return () =>
      h(
        'div',
        {
          style: {
            borderRadius: '16px',
            border: '1.5px solid #e8e8e8',
            padding: '20px 20px 16px',
            background: '#fff',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            margin: '16px 0',
            minWidth: '280px',
            maxWidth: '420px',
          },
        },
        h('div', { style: { display: 'grid', gap: '12px' } }, slots.default?.()),
      );
  },
});

export const DateTimeInput = defineComponent({
  name: 'DateTimeInput',
  props: {
    status: { type: String, default: '' },
    action: { type: Object, default: undefined },
    onAction: { type: Function, default: undefined },
  },
  setup(props) {
    const today = new Date().toISOString().slice(0, 10);
    const value = ref(today);
    return () =>
      h('label', { style: { display: 'grid', gap: '6px', fontSize: '14px' } }, [
        h('span', { style: { fontWeight: '600', color: '#262626' } }, '选择日期'),
        h('input', {
          type: 'date',
          value: value.value,
          disabled: props.status === 'success',
          style: {
            width: '100%',
            boxSizing: 'border-box',
            padding: '8px 10px',
            border: '1px solid #d9d9d9',
            borderRadius: '8px',
            background: props.status === 'success' ? '#f5f5f5' : '#fff',
          },
          onInput: (event: Event) => {
            const next = (event.target as HTMLInputElement).value;
            value.value = next;
            if (!next) return;
            const timestamp = new Date(`${next}T12:00:00`).toISOString();
            const name = actionName(props.action);
            if (name) props.onAction?.(name, buildActionContext(props.action, timestamp));
          },
        }),
      ]);
  },
});

export const CoffeeList = defineComponent({
  name: 'CoffeeList',
  props: {
    list: { type: [Array, String], default: () => COFFEE_LIST },
    description: { type: String, default: '' },
    status: { type: String, default: '' },
    action: { type: Object, default: undefined },
    onAction: { type: Function, default: undefined },
  },
  setup(props) {
    const selectedId = ref<number | null>(null);
    return () => {
      const list = toArray<CoffeeItem>(props.list);
      const coffees = list.length ? list : COFFEE_LIST;
      return h('div', { style: { display: 'grid', gap: '8px' } }, [
        props.description
          ? h('span', { style: { color: '#8c8c8c', fontSize: '13px' } }, `📋 ${props.description}`)
          : null,
        ...coffees.map((item) =>
          h(
            'button',
            {
              key: item.id,
              type: 'button',
              disabled: props.status === 'success',
              onClick: () => {
                selectedId.value = item.id;
                const name = actionName(props.action) || 'select_coffee';
                props.onAction?.(name, buildActionContext(props.action, item));
              },
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '10px 12px',
                borderRadius: '12px',
                border:
                  selectedId.value === item.id ? '1px solid #91caff' : '1px solid #f0f0f0',
                background: selectedId.value === item.id ? '#e6f4ff' : '#fafafa',
                textAlign: 'left',
                cursor: props.status === 'success' ? 'not-allowed' : 'pointer',
              },
            },
            [
              h(
                'span',
                {
                  style: {
                    width: '48px',
                    height: '48px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #6b3520 0%, #c8855a 100%)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    flexShrink: '0',
                  },
                },
                '☕',
              ),
              h('span', { style: { flex: '1', minWidth: '0' } }, [
                h('span', { style: { display: 'flex', alignItems: 'center', gap: '6px' } }, [
                  h('strong', { style: { fontSize: '14px' } }, item.name),
                  item.tag
                    ? h(
                        'span',
                        {
                          style: {
                            fontSize: '11px',
                            padding: '0 6px',
                            lineHeight: '18px',
                            borderRadius: '8px',
                            color: '#d46b08',
                            background: '#fff7e6',
                            border: '1px solid #ffd591',
                          },
                        },
                        item.tag,
                      )
                    : null,
                ]),
                h(
                  'span',
                  { style: { display: 'block', color: '#8c8c8c', fontSize: '12px', marginTop: '2px' } },
                  item.description,
                ),
              ]),
              h('strong', { style: { color: '#ff4d4f', fontSize: '15px' } }, `¥${item.price}`),
            ],
          ),
        ),
      ]);
    };
  },
});

export const ActionButton = defineComponent({
  name: 'ActionButton',
  props: {
    action: { type: Object, default: undefined },
    status: { type: String, default: '' },
    res: { type: [Object, String], default: undefined },
    variant: { type: String, default: '' },
    onAction: { type: Function, default: undefined },
  },
  setup(props, { slots }) {
    return () => {
      const res = toObject<Record<string, any>>(props.res, {});
      const disabled = props.status === 'success';
      return h(
        'button',
        {
          type: 'button',
          disabled,
          onClick: () => {
            const name = actionName(props.action);
            if (!name) return;
            const context =
              !res.time || !res.coffee
                ? { status: 'error', errorMessage: 'Please select date and coffee first' }
                : { status: 'success', res };
            props.onAction?.(name, context);
          },
          style: {
            width: '100%',
            padding: '9px 14px',
            border: props.variant === 'primary' ? '0' : '1px solid #d9d9d9',
            borderRadius: '8px',
            color: props.variant === 'primary' ? '#fff' : '#262626',
            background: disabled ? '#d9d9d9' : props.variant === 'primary' ? '#1677ff' : '#fff',
            cursor: disabled ? 'not-allowed' : 'pointer',
            fontSize: '14px',
          },
        },
        slots.default?.() || 'Confirm Order',
      );
    };
  },
});

export const CoffeeResultCard = defineComponent({
  name: 'CoffeeResultCard',
  props: {
    name: { type: String, default: '' },
    description: { type: String, default: '' },
    price: { type: [Number, String], default: '' },
    tag: { type: String, default: '' },
    date: { type: String, default: '' },
  },
  setup(props) {
    return () =>
      h(
        'div',
        {
          style: {
            border: '1px solid #b7eb8f',
            background: 'linear-gradient(135deg, #f6ffed 0%, #fff 100%)',
            borderRadius: '16px',
            padding: '18px',
          },
        },
        [
          h('div', { style: { display: 'flex', alignItems: 'center', gap: '12px' } }, [
            h(
              'span',
              {
                style: {
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #6b3520 0%, #c8855a 100%)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                },
              },
              '☕',
            ),
            h('div', { style: { flex: '1' } }, [
              h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } }, [
                h('h3', { style: { margin: '0', fontSize: '18px' } }, props.name),
                props.tag
                  ? h(
                      'span',
                      {
                        style: {
                          fontSize: '11px',
                          padding: '0 6px',
                          borderRadius: '8px',
                          color: '#d46b08',
                          background: '#fff7e6',
                          border: '1px solid #ffd591',
                        },
                      },
                      props.tag,
                    )
                  : null,
              ]),
              h('p', { style: { margin: '4px 0 0', color: '#8c8c8c', fontSize: '13px' } }, props.description),
            ]),
          ]),
          h('div', { style: { display: 'flex', justifyContent: 'space-between', marginTop: '16px' } }, [
            h('span', { style: { color: '#8c8c8c', fontSize: '13px' } }, '预订时间'),
            h('strong', { style: { fontSize: '13px' } }, formatDate(props.date)),
          ]),
          h('div', { style: { display: 'flex', justifyContent: 'space-between', marginTop: '8px' } }, [
            h('span', { style: { color: '#8c8c8c', fontSize: '13px' } }, '金额'),
            h('strong', { style: { color: '#ff4d4f' } }, `¥${props.price}`),
          ]),
        ],
      );
  },
});

export const LoadingIndicator = defineComponent({
  name: 'LoadingIndicator',
  props: {
    progress: { type: [Number, String], default: 0 },
    total: { type: [Number, String], default: 100 },
    loading: { type: [Boolean, String], default: false },
  },
  setup(props) {
    return () => {
      const progress = Number(props.progress) || 0;
      const total = Number(props.total) || 1;
      const loading = props.loading === true || props.loading === 'true';
      const percent = Math.min(100, Math.round((progress / total) * 100));
      return h(
        'div',
        {
          style: {
            padding: '14px 18px',
            background: '#fff',
            borderRadius: '12px',
            border: '1px solid #e8e8e8',
          },
        },
        [
          h('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' } }, [
            h('span', { style: { fontSize: '14px', fontWeight: '500' } }, loading ? '正在加载商品…' : '加载完成'),
            h('span', { style: { color: '#8c8c8c', fontSize: '12px' } }, `${progress}/${total} products`),
          ]),
          h(
            'div',
            { style: { height: '7px', background: '#f0f0f0', borderRadius: '999px', overflow: 'hidden' } },
            h('div', {
              style: {
                width: `${percent}%`,
                height: '100%',
                borderRadius: '999px',
                background: loading ? 'linear-gradient(90deg, #108ee9, #87d068)' : '#52c41a',
                transition: 'width 0.3s ease',
              },
            }),
          ),
        ],
      );
    };
  },
});

export const ProductCard = defineComponent({
  name: 'ProductCard',
  props: {
    name: { type: String, default: '' },
    price: { type: [Number, String], default: 0 },
    category: { type: String, default: '' },
    stock: { type: [Number, String], default: 0 },
    tag: { type: String, default: '' },
    index: { type: [Number, String], default: 0 },
  },
  setup(props) {
    const visible = ref(false);
    let timer: number | undefined;
    onMounted(() => {
      timer = window.setTimeout(() => {
        visible.value = true;
      }, (Number(props.index) || 0) * 120);
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
            padding: '16px',
            background: '#fff',
            opacity: visible.value ? '1' : '0',
            transform: visible.value ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          },
        },
        [
          h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } }, [
            h('strong', { style: { flex: '1', fontSize: '16px', lineHeight: '22px' } }, props.name),
            props.tag
              ? h(
                  'span',
                  {
                    style: {
                      fontSize: '11px',
                      padding: '0 8px',
                      lineHeight: '20px',
                      borderRadius: '8px',
                      color: '#d46b08',
                      background: '#fff7e6',
                      border: '1px solid #ffd591',
                    },
                  },
                  props.tag,
                )
              : null,
          ]),
          h(
            'div',
            { style: { color: '#ff4d4f', fontSize: '20px', fontWeight: '700', margin: '8px 0' } },
            `¥${props.price}`,
          ),
          h('div', { style: { display: 'flex', justifyContent: 'space-between', color: '#8c8c8c', fontSize: '12px' } }, [
            h('span', props.category),
            h('span', `Stock: ${props.stock}`),
          ]),
        ],
      );
  },
});

export const ProductContainer = defineComponent({
  name: 'ProductContainer',
  setup(_, { slots }) {
    return () =>
      h(
        'div',
        {
          style: {
            borderRadius: '16px',
            border: '1px solid #e8e8e8',
            padding: '20px',
            background: '#fafafa',
          },
        },
        h(
          'div',
          { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' } },
          slots.default?.(),
        ),
      );
  },
});

export const LoadingProgress = defineComponent({
  name: 'LoadingProgress',
  props: {
    percent: { type: [Number, String], default: 0 },
    status: { type: String, default: 'active' },
    text: { type: String, default: 'Loading recommendations...' },
  },
  setup(props) {
    return () => {
      const percent = Math.max(0, Math.min(100, Number(props.percent) || 0));
      return h(
        'div',
        {
          style: {
            padding: '14px 18px',
            background: '#fff',
            borderRadius: '12px',
            border: '1px solid #f0f0f0',
            marginBottom: '16px',
          },
        },
        [
          h('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' } }, [
            h('span', { style: { color: '#8c8c8c', fontSize: '13px' } }, props.text),
            h('strong', { style: { fontSize: '13px' } }, `${Math.round(percent)}%`),
          ]),
          h(
            'div',
            { style: { height: '8px', background: '#f0f0f0', borderRadius: '999px', overflow: 'hidden' } },
            h('div', {
              style: {
                width: `${percent}%`,
                height: '100%',
                background:
                  props.status === 'success'
                    ? '#52c41a'
                    : 'linear-gradient(90deg, #108ee9 0%, #87d068 100%)',
                borderRadius: '999px',
                transition: 'width 0.25s ease',
              },
            }),
          ),
        ],
      );
    };
  },
});

export const RestaurantCard = defineComponent({
  name: 'RestaurantCard',
  props: {
    restaurant: { type: Object as PropType<RestaurantItem>, default: undefined },
    index: { type: [Number, String], default: 0 },
  },
  setup(props) {
    const visible = ref(false);
    let timer: number | undefined;
    onMounted(() => {
      timer = window.setTimeout(() => {
        visible.value = true;
      }, (Number(props.index) || 0) * 150);
    });
    onUnmounted(() => {
      if (timer) window.clearTimeout(timer);
    });
    return () => {
      if (!props.restaurant) return null;
      const item = props.restaurant;
      const stars = Array.from({ length: 5 }, (_, index) =>
        h('span', { key: index, style: { color: index < Math.round(item.rating) ? '#faad14' : '#f0f0f0' } }, '★'),
      );
      return h(
        'div',
        {
          style: {
            display: 'flex',
            gap: '14px',
            padding: '16px 18px',
            borderRadius: '12px',
            background: '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            marginBottom: '12px',
            opacity: visible.value ? '1' : '0',
            transform: visible.value ? 'translateY(0)' : 'translateY(16px)',
            transition: 'all 0.35s ease-out',
          },
        },
        [
          h(
            'span',
            {
              style: {
                width: '58px',
                height: '58px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '27px',
                flexShrink: '0',
              },
            },
            '🍽️',
          ),
          h('div', { style: { flex: '1', minWidth: '0' } }, [
            h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } }, [
              h('strong', { style: { fontSize: '16px' } }, item.name),
              h(
                'span',
                {
                  style: {
                    fontSize: '11px',
                    padding: '0 7px',
                    lineHeight: '20px',
                    borderRadius: '6px',
                    color: '#1677ff',
                    background: '#e6f4ff',
                  },
                },
                item.cuisine,
              ),
            ]),
            h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', margin: '5px 0' } }, [
              h('span', { style: { display: 'flex', fontSize: '12px' } }, stars),
              h('span', { style: { color: '#faad14', fontSize: '13px' } }, String(item.rating)),
              h('span', { style: { color: '#8c8c8c', fontSize: '12px' } }, item.distance),
              h('span', { style: { color: '#52c41a', fontSize: '13px' } }, item.priceRange),
            ]),
            h(
              'p',
              {
                style: {
                  margin: '0 0 7px',
                  color: '#8c8c8c',
                  fontSize: '12px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                },
              },
              item.description,
            ),
            h(
              'div',
              { style: { display: 'flex', flexWrap: 'wrap', gap: '5px' } },
              item.tags.map((tag) =>
                h(
                  'span',
                  {
                    key: tag,
                    style: { fontSize: '11px', padding: '1px 6px', borderRadius: '6px', background: '#f5f5f5' },
                  },
                  tag,
                ),
              ),
            ),
          ]),
        ],
      );
    };
  },
});

export const RestaurantList = defineComponent({
  name: 'RestaurantList',
  props: {
    restaurants: { type: [Array, String], default: (): any[] => [] },
    loadingProgress: { type: [Number, String], default: 0 },
    isStreaming: { type: [Boolean, String], default: false },
  },
  setup(props) {
    return () => {
      const restaurants = toArray<RestaurantItem>(props.restaurants);
      const progress = Number(props.loadingProgress) || 0;
      const streaming = props.isStreaming === true || props.isStreaming === 'true';
      const visible = streaming
        ? restaurants.slice(0, Math.ceil((progress / 100) * restaurants.length))
        : restaurants;
      return h('div', [
        streaming && progress < 100
          ? h(LoadingProgress, {
              percent: progress,
              text: 'AI is selecting recommendations for you...',
            })
          : null,
        ...visible.map((item, index) => h(RestaurantCard, { key: item.id, restaurant: item, index })),
        !streaming && restaurants.length
          ? h(
              'div',
              { style: { textAlign: 'center', padding: '12px 0', color: '#8c8c8c', fontSize: '12px' } },
              `✅ Recommended ${restaurants.length} restaurants for you`,
            )
          : null,
      ]);
    };
  },
});

export const StreamContainer = defineComponent({
  name: 'StreamContainer',
  setup(_, { slots }) {
    return () =>
      h(
        'div',
        {
          style: {
            borderRadius: '16px',
            border: '1.5px solid #e8e8e8',
            padding: '20px 20px 16px',
            background: '#fff',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            margin: '16px 0',
            minWidth: '320px',
            maxWidth: '560px',
          },
        },
        slots.default?.(),
      );
  },
});

export const FileTreeNode: any = defineComponent({
  name: 'FileTreeNode',
  props: {
    node: { type: Object as PropType<FileNode>, required: true },
    level: { type: Number, default: 0 },
    selectedKey: { type: String, default: '' },
    onFileClick: { type: Function, default: undefined },
  },
  setup(props) {
    const expanded = ref(false);
    return () => {
      const node = props.node;
      const folder = node.type === 'folder';
      const selected = props.selectedKey === node.key;
      return h('div', [
        h(
          'div',
          {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 8px',
              marginLeft: `${props.level * 12}px`,
              borderRadius: '6px',
              cursor: 'pointer',
              background: selected ? '#e6f4ff' : 'transparent',
              borderLeft: `3px solid ${selected ? '#1677ff' : 'transparent'}`,
              transition: 'all 0.2s',
            },
            onClick: () => {
              if (folder) expanded.value = !expanded.value;
              else props.onFileClick?.(node);
            },
          },
          [
            h('span', { style: { color: folder ? '#faad14' : '#1677ff' } }, folder ? (expanded.value ? '📂' : '📁') : '📄'),
            h('span', { style: { flex: '1', fontSize: '13px' } }, node.name),
            folder && node.children
              ? h('span', { style: { color: '#8c8c8c', fontSize: '11px' } }, String(node.children.length))
              : null,
          ],
        ),
        folder && expanded.value && node.children
          ? h(
              'div',
              node.children.map((child) =>
                h(FileTreeNode, {
                  key: child.key,
                  node: child,
                  level: props.level + 1,
                  selectedKey: props.selectedKey,
                  onFileClick: props.onFileClick,
                }),
              ),
            )
          : null,
      ]);
    };
  },
});

export const FileTree = defineComponent({
  name: 'FileTree',
  props: {
    files: { type: [Array, String], default: () => PROJECT_FILES },
    selectedFile: { type: [Object, String], default: undefined },
    action: { type: Object, default: undefined },
    onAction: { type: Function, default: undefined },
  },
  setup(props) {
    return () => {
      const files = toArray<FileNode>(props.files);
      const tree = files.length ? files : PROJECT_FILES;
      const selected = toObject<FileDetail>(props.selectedFile, {} as FileDetail);
      const handleFileClick = (file: FileNode) => {
        const detail: FileDetail = {
          name: file.name,
          path: file.key,
          size: file.size || 0,
          modified: file.modified || '',
          language: file.language || 'Unknown',
          description: file.description || '',
        };
        const name = actionName(props.action) || 'select_file';
        props.onAction?.(name, buildActionContext(props.action, detail));
      };
      return h(
        'div',
        {
          style: {
            borderRadius: '12px',
            border: '1px solid #e8e8e8',
            background: '#fff',
            maxHeight: '400px',
            overflow: 'auto',
            padding: '12px 8px',
          },
        },
        tree.map((node) =>
          h(FileTreeNode, {
            key: node.key,
            node,
            level: 0,
            selectedKey: selected.path || '',
            onFileClick: handleFileClick,
          }),
        ),
      );
    };
  },
});

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function languageColor(language: string) {
  return (
    {
      TypeScript: '#3178c6',
      JavaScript: '#f7df1e',
      HTML: '#e34c26',
      JSON: '#292929',
      Markdown: '#083fa1',
    }[language] || '#666'
  );
}

export const FileDetailCard = defineComponent({
  name: 'FileDetailCard',
  props: {
    file: { type: [Object, String], default: undefined },
  },
  setup(props) {
    return () => {
      const file = toObject<FileDetail>(props.file, {} as FileDetail);
      if (!file?.name) return null;
      return h(
        'div',
        {
          style: {
            borderRadius: '12px',
            border: '1px solid #e8e8e8',
            background: '#fff',
            padding: '16px',
          },
        },
        [
          h('div', { style: { display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '12px' } }, [
            h('span', { style: { color: '#1677ff' } }, '📄'),
            h('strong', file.name),
          ]),
          h('div', { style: { display: 'grid', gap: '10px' } }, [
            h('div', [
              h('span', { style: { display: 'block', color: '#8c8c8c', fontSize: '12px' } }, 'Path'),
              h('code', { style: { fontSize: '13px' } }, file.path),
            ]),
            h('div', { style: { display: 'flex', gap: '24px' } }, [
              h('div', [
                h('span', { style: { display: 'block', color: '#8c8c8c', fontSize: '12px' } }, 'Size'),
                h('span', { style: { fontSize: '13px' } }, formatSize(Number(file.size) || 0)),
              ]),
              h('div', [
                h('span', { style: { display: 'block', color: '#8c8c8c', fontSize: '12px' } }, 'Modified'),
                h('span', { style: { fontSize: '13px' } }, file.modified),
              ]),
            ]),
            h('div', [
              h('span', { style: { display: 'block', color: '#8c8c8c', fontSize: '12px', marginBottom: '4px' } }, 'Language'),
              h(
                'span',
                {
                  style: {
                    display: 'inline-block',
                    padding: '1px 8px',
                    borderRadius: '6px',
                    color: '#fff',
                    background: languageColor(file.language),
                    fontSize: '12px',
                  },
                },
                file.language,
              ),
            ]),
            file.description
              ? h('div', [
                  h('span', { style: { display: 'block', color: '#8c8c8c', fontSize: '12px' } }, 'Description'),
                  h('span', { style: { fontSize: '13px' } }, file.description),
                ])
              : null,
          ]),
        ],
      );
    };
  },
});

export const AccordionPanel = defineComponent({
  name: 'AccordionPanel',
  props: {
    panels: { type: [Array, Object, String], default: () => PANEL_DATA },
  },
  setup(props, { slots }) {
    const activeKey = ref('overview');
    return () => {
      const panels = normalizePanels(props.panels);
      return h('div', { style: { display: 'grid', gap: '8px' } }, [
        ...panels.map((panel) => {
          const active = activeKey.value === panel.id;
          return h(
            'div',
            {
              key: panel.id,
              style: {
                border: '1px solid #f0f0f0',
                borderRadius: '8px',
                overflow: 'hidden',
                background: '#fff',
              },
            },
            [
              h(
                'button',
                {
                  type: 'button',
                  onClick: () => {
                    activeKey.value = active ? '' : panel.id;
                  },
                  style: {
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 12px',
                    border: '0',
                    background: '#fafafa',
                    cursor: 'pointer',
                    textAlign: 'left',
                  },
                },
                [
                  h('span', { style: { color: '#52c41a' } }, '✓'),
                  h('strong', { style: { flex: '1', fontSize: '13px' } }, panel.title),
                  h('span', { style: { color: '#8c8c8c' } }, active ? '−' : '+'),
                ],
              ),
              active
                ? h(
                    'div',
                    {
                      style: {
                        padding: '12px',
                        fontSize: '13px',
                        whiteSpace: 'pre-wrap',
                        color: '#595959',
                      },
                    },
                    panel.content,
                  )
                : null,
            ],
          );
        }),
        slots.default?.(),
      ]);
    };
  },
});

export const MainContainer = defineComponent({
  name: 'MainContainer',
  setup(_, { slots }) {
    return () =>
      h(
        'div',
        {
          style: {
            borderRadius: '16px',
            border: '1.5px solid #e8e8e8',
            padding: '20px',
            background: '#fff',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            margin: '16px 0',
            display: 'grid',
            gap: '16px',
          },
        },
        slots.default?.(),
      );
  },
});

function normalizeFilters(
  selectedCategories: unknown,
  priceRange: unknown,
  minRating: unknown,
  searchKeyword: unknown,
): FilterState {
  const range = toArray<number>(priceRange);
  return {
    categories: toArray<string>(selectedCategories),
    priceRange: range.length >= 2 ? [Number(range[0]), Number(range[1])] : [0, 1500],
    minRating: Number(minRating) || 0,
    searchKeyword: typeof searchKeyword === 'string' ? searchKeyword : '',
  };
}

const FILTER_CATEGORIES = ['Electronics', 'Wearable', 'Accessories', 'Home'];

export const FilterPanel = defineComponent({
  name: 'FilterPanel',
  props: {
    selectedCategories: { type: [Array, String], default: (): any[] => [] },
    priceRange: { type: [Array, String], default: (): any[] => [0, 1500] },
    minRating: { type: [Number, String], default: 0 },
    searchKeyword: { type: String, default: '' },
    action: { type: Object, default: undefined },
    onAction: { type: Function, default: undefined },
  },
  setup(props) {
    const emit = (patch: Partial<FilterState>) => {
      const next = {
        ...normalizeFilters(
          props.selectedCategories,
          props.priceRange,
          props.minRating,
          props.searchKeyword,
        ),
        ...patch,
      };
      const name = actionName(props.action) || 'update_filters';
      props.onAction?.(name, buildActionContext(props.action, next));
    };
    return () => {
      const filters = normalizeFilters(
        props.selectedCategories,
        props.priceRange,
        props.minRating,
        props.searchKeyword,
      );
      const setCategory = (category: string, checked: boolean) => {
        const next = checked
          ? filters.categories.includes(category)
            ? filters.categories
            : [...filters.categories, category]
          : filters.categories.filter((item) => item !== category);
        emit({ categories: next });
      };
      return h(
        'div',
        {
          style: {
            border: '1px solid #f0f0f0',
            borderRadius: '12px',
            padding: '16px',
            background: '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          },
        },
        [
          h('h3', { style: { margin: '0 0 16px', fontSize: '15px' } }, '🔍 Filters'),
          h('div', { style: { display: 'grid', gap: '18px' } }, [
            h('label', { style: { display: 'grid', gap: '6px', fontSize: '13px' } }, [
              h('strong', 'Search'),
              h('input', {
                value: filters.searchKeyword,
                placeholder: 'Search products...',
                onInput: (event: Event) =>
                  emit({ searchKeyword: (event.target as HTMLInputElement).value }),
                style: {
                  padding: '7px 9px',
                  border: '1px solid #d9d9d9',
                  borderRadius: '7px',
                },
              }),
            ]),
            h('div', [
              h('strong', { style: { display: 'block', marginBottom: '8px', fontSize: '13px' } }, 'Category'),
              h(
                'div',
                { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' } },
                FILTER_CATEGORIES.map((category) =>
                  h('label', { key: category, style: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' } }, [
                    h('input', {
                      type: 'checkbox',
                      checked: filters.categories.includes(category),
                      onChange: (event: Event) =>
                        setCategory(category, (event.target as HTMLInputElement).checked),
                    }),
                    category,
                  ]),
                ),
              ),
            ]),
            h('div', [
              h(
                'strong',
                { style: { display: 'block', marginBottom: '8px', fontSize: '13px' } },
                `Price Range: ¥${filters.priceRange[0]} - ¥${filters.priceRange[1]}`,
              ),
              h('div', { style: { display: 'grid', gap: '6px' } }, [
                h('input', {
                  type: 'range',
                  min: 0,
                  max: 1500,
                  step: 50,
                  value: filters.priceRange[0],
                  onInput: (event: Event) => {
                    const min = Number((event.target as HTMLInputElement).value);
                    emit({ priceRange: [Math.min(min, filters.priceRange[1]), filters.priceRange[1]] });
                  },
                }),
                h('input', {
                  type: 'range',
                  min: 0,
                  max: 1500,
                  step: 50,
                  value: filters.priceRange[1],
                  onInput: (event: Event) => {
                    const max = Number((event.target as HTMLInputElement).value);
                    emit({ priceRange: [filters.priceRange[0], Math.max(max, filters.priceRange[0])] });
                  },
                }),
              ]),
            ]),
            h('div', [
              h('strong', { style: { display: 'block', marginBottom: '8px', fontSize: '13px' } }, 'Minimum Rating'),
              h('div', { style: { display: 'flex', alignItems: 'center', gap: '6px' } }, [
                ...Array.from({ length: 5 }, (_, index) => {
                  const star = index + 1;
                  const active = star <= filters.minRating;
                  return h(
                    'button',
                    {
                      key: star,
                      type: 'button',
                      onClick: () => emit({ minRating: filters.minRating === star ? 0 : star }),
                      style: {
                        border: '0',
                        background: 'transparent',
                        padding: '0',
                        cursor: 'pointer',
                        fontSize: '20px',
                        color: active ? '#faad14' : '#d9d9d9',
                      },
                    },
                    '★',
                  );
                }),
                h(
                  'span',
                  { style: { color: '#8c8c8c', fontSize: '12px', marginLeft: '4px' } },
                  filters.minRating > 0 ? `${filters.minRating}+ stars` : 'All ratings',
                ),
              ]),
            ]),
          ]),
        ],
      );
    };
  },
});

export const FilterProductList = defineComponent({
  name: 'ProductList',
  props: {
    products: { type: [Array, String], default: () => FILTER_PRODUCTS },
    filters: { type: [Object, String], default: undefined },
  },
  setup(props) {
    const loading = ref(false);
    const appliedFilters = ref<FilterState>(
      normalizeFilters(undefined, undefined, undefined, undefined),
    );
    let timer: number | undefined;

    const readFilters = () => {
      const filters = toObject<Record<string, unknown>>(props.filters, {});
      return normalizeFilters(
        filters.categories,
        filters.priceRange,
        filters.minRating,
        filters.searchKeyword,
      );
    };

    watch(
      () => props.filters,
      () => {
        loading.value = true;
        if (timer) window.clearTimeout(timer);
        timer = window.setTimeout(() => {
          appliedFilters.value = readFilters();
          loading.value = false;
        }, 300);
      },
      { deep: true },
    );

    onMounted(() => {
      appliedFilters.value = readFilters();
    });

    onUnmounted(() => {
      if (timer) window.clearTimeout(timer);
    });

    return () => {
      const products = toArray<Product>(props.products);
      const source = products.length ? products : FILTER_PRODUCTS;
      const filters = appliedFilters.value;
      const keyword = filters.searchKeyword.toLowerCase();
      const result = source.filter((product) => {
        const tags = (product as any).tags as string[] | undefined;
        const hitKeyword =
          !keyword ||
          product.name.toLowerCase().includes(keyword) ||
          product.category.toLowerCase().includes(keyword) ||
          (tags || []).some((tag) => tag.toLowerCase().includes(keyword));
        const hitCategory =
          filters.categories.length === 0 || filters.categories.includes(product.category);
        const hitPrice =
          product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
        const hitRating = !filters.minRating || (Number(product.rating) || 0) >= filters.minRating;
        return hitKeyword && hitCategory && hitPrice && hitRating;
      });

      return h('div', [
        h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' } }, [
          h('strong', 'Results:'),
          h(
            'span',
            {
              style: {
                padding: '1px 8px',
                borderRadius: '999px',
                color: '#1677ff',
                background: '#e6f4ff',
                fontSize: '12px',
              },
            },
            `${result.length} products`,
          ),
          loading ? h('span', { style: { color: '#8c8c8c', fontSize: '12px' } }, '筛选中…') : null,
        ]),
        result.length
          ? h(
              'div',
              { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '14px' } },
              result.map((product) =>
                h(
                  'div',
                  {
                    key: product.id,
                    style: {
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: '1px solid #f0f0f0',
                      background: '#fff',
                    },
                  },
                  [
                    h(
                      'div',
                      {
                        style: {
                          height: '90px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          fontSize: '40px',
                        },
                      },
                      '📦',
                    ),
                    h('div', { style: { padding: '12px' } }, [
                      h('strong', { style: { display: 'block', fontSize: '14px' } }, product.name),
                      h(
                        'div',
                        { style: { display: 'flex', flexWrap: 'wrap', gap: '4px', margin: '6px 0' } },
                        (((product as any).tags as string[]) || []).map((tag) =>
                          h(
                            'span',
                            {
                              key: tag,
                              style: { fontSize: '10px', padding: '0 5px', borderRadius: '4px', background: '#f5f5f5' },
                            },
                            tag,
                          ),
                        ),
                      ),
                      h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }, [
                        h('strong', { style: { color: '#1890ff', fontSize: '16px' } }, `¥${product.price}`),
                        h(
                          'span',
                          { style: { color: '#faad14', fontSize: '11px' } },
                          `${'★'.repeat(Math.round((product as any).rating || 0))} ${(product as any).rating}`,
                        ),
                      ]),
                      h(
                        'span',
                        { style: { display: 'block', marginTop: '4px', color: '#8c8c8c', fontSize: '11px' } },
                        `Stock: ${product.stock}`,
                      ),
                    ]),
                  ],
                ),
              ),
            )
          : h('div', { style: { textAlign: 'center', padding: '50px 20px' } }, [
              h('div', { style: { fontSize: '56px', marginBottom: '10px' } }, '🔍'),
              h('h3', { style: { margin: '0 0 6px' } }, 'No products found'),
              h('span', { style: { color: '#8c8c8c' } }, 'Try adjusting your filters'),
            ]),
      ]);
    };
  },
});

export const FilterContainer = defineComponent({
  name: 'FilterContainer',
  setup(_, { slots }) {
    return () =>
      h(
        'div',
        {
          style: {
            borderRadius: '16px',
            border: '1.5px solid #e8e8e8',
            padding: '20px',
            background: '#fff',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            minWidth: '600px',
          },
        },
        h('div', { style: { display: 'grid', gridTemplateColumns: '260px minmax(0, 1fr)', gap: '20px' } }, slots.default?.()),
      );
  },
});

function productEmoji(category: string) {
  if (category === 'Electronics') return '📱';
  if (category === 'Accessories') return '🎧';
  if (category === 'Wearable') return '⌚';
  return '📦';
}

export const ProductListCard = defineComponent({
  name: 'ProductListCard',
  props: {
    products: { type: [Array, String], default: () => SHOP_PRODUCTS },
    cart: { type: [Array, String], default: (): any[] => [] },
    action: { type: Object, default: undefined },
    onAction: { type: Function, default: undefined },
  },
  setup(props) {
    return () => {
      const products = toArray<Product>(props.products);
      const source = products.length ? products : SHOP_PRODUCTS;
      const cart = toArray<CartItem>(props.cart);
      const quantity = (productId: number) =>
        cart.find((item) => item.product.id === productId)?.quantity || 0;
      return h(
        'div',
        {
          style: {
            border: '1px solid #f0f0f0',
            borderRadius: '12px',
            padding: '14px',
            background: '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          },
        },
        [
          h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' } }, [
            h('span', '📦'),
            h('strong', { style: { flex: '1' } }, 'Product List'),
            h('span', { style: { color: '#8c8c8c', fontSize: '12px' } }, `${source.length} items`),
          ]),
          h(
            'div',
            { style: { display: 'grid', gap: '8px', maxHeight: '430px', overflow: 'auto' } },
            source.map((product) => {
              const count = quantity(product.id);
              return h(
                'div',
                {
                  key: product.id,
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 0',
                    borderBottom: '1px solid #f5f5f5',
                  },
                },
                [
                  h(
                    'span',
                    {
                      style: {
                        width: '48px',
                        height: '48px',
                        borderRadius: '11px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '22px',
                        flexShrink: '0',
                      },
                    },
                    productEmoji(product.category),
                  ),
                  h('div', { style: { flex: '1', minWidth: '0' } }, [
                    h('div', { style: { display: 'flex', alignItems: 'center', gap: '5px' } }, [
                      h(
                        'strong',
                        { style: { fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } },
                        product.name,
                      ),
                      product.tag
                        ? h(
                            'span',
                            {
                              style: {
                                color: '#d46b08',
                                background: '#fff7e6',
                                borderRadius: '5px',
                                padding: '0 5px',
                                fontSize: '10px',
                              },
                            },
                            product.tag,
                          )
                        : null,
                    ]),
                    h(
                      'span',
                      {
                        style: {
                          display: 'block',
                          color: '#8c8c8c',
                          fontSize: '11px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        },
                      },
                      product.description,
                    ),
                  ]),
                  h('div', { style: { textAlign: 'right', flexShrink: '0' } }, [
                    h('strong', { style: { display: 'block', color: '#1890ff', fontSize: '14px' } }, `¥${product.price.toLocaleString()}`),
                    h(
                      'button',
                      {
                        type: 'button',
                        onClick: () => {
                          const name = actionName(props.action) || 'add_to_cart';
                          props.onAction?.(name, { product });
                        },
                        style: {
                          marginTop: '4px',
                          minWidth: '68px',
                          padding: '4px 8px',
                          border: count > 0 ? '1px solid #d9d9d9' : '0',
                          borderRadius: '6px',
                          background: count > 0 ? '#fff' : '#1677ff',
                          color: count > 0 ? '#262626' : '#fff',
                          cursor: 'pointer',
                          fontSize: '12px',
                        },
                      },
                      count > 0 ? `+1 (${count})` : 'Add',
                    ),
                  ]),
                ],
              );
            }),
          ),
        ],
      );
    };
  },
});

export const CartCard = defineComponent({
  name: 'CartCard',
  props: {
    cart: { type: [Array, String], default: (): any[] => [] },
    updateAction: { type: Object, default: undefined },
    removeAction: { type: Object, default: undefined },
    onAction: { type: Function, default: undefined },
  },
  setup(props) {
    return () => {
      const cart = toArray<CartItem>(props.cart);
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      return h(
        'div',
        {
          style: {
            border: '1px solid #f0f0f0',
            borderRadius: '12px',
            padding: '14px',
            background: '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          },
        },
        [
          h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' } }, [
            h('span', '🛒'),
            h('strong', { style: { flex: '1' } }, 'Shopping Cart'),
            h('span', { style: { color: '#8c8c8c', fontSize: '12px' } }, `${totalItems} items`),
          ]),
          cart.length
            ? h(
                'div',
                { style: { maxHeight: '340px', overflow: 'auto' } },
                cart.map((item) =>
                  h(
                    'div',
                    {
                      key: item.product.id,
                      style: {
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '9px 0',
                        borderBottom: '1px solid #f5f5f5',
                      },
                    },
                    [
                      h('span', { style: { fontSize: '17px' } }, productEmoji(item.product.category)),
                      h('div', { style: { flex: '1', minWidth: '0' } }, [
                        h(
                          'strong',
                          { style: { display: 'block', fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } },
                          item.product.name,
                        ),
                        h('span', { style: { color: '#8c8c8c', fontSize: '11px' } }, `¥${item.product.price.toLocaleString()} x ${item.quantity}`),
                      ]),
                      h('input', {
                        type: 'number',
                        min: 1,
                        max: item.product.stock,
                        value: item.quantity,
                        onChange: (event: Event) => {
                          const quantity = Math.max(1, Number((event.target as HTMLInputElement).value) || 1);
                          const name = actionName(props.updateAction) || 'update_quantity';
                          props.onAction?.(name, { productId: item.product.id, quantity });
                        },
                        style: { width: '52px', padding: '3px', border: '1px solid #d9d9d9', borderRadius: '5px' },
                      }),
                      h(
                        'button',
                        {
                          type: 'button',
                          onClick: () => {
                            const name = actionName(props.removeAction) || 'remove_from_cart';
                            props.onAction?.(name, { productId: item.product.id });
                          },
                          style: {
                            border: '1px solid #ffccc7',
                            borderRadius: '5px',
                            background: '#fff',
                            color: '#ff4d4f',
                            cursor: 'pointer',
                            padding: '3px 6px',
                          },
                        },
                        '删除',
                      ),
                    ],
                  ),
                ),
              )
            : h('div', { style: { textAlign: 'center', padding: '40px 0', color: '#bfbfbf' } }, [
                h('div', { style: { fontSize: '42px' } }, '🛒'),
                h('span', { style: { fontSize: '12px' } }, 'Cart is empty'),
              ]),
          h('div', { style: { display: 'flex', justifyContent: 'space-between', paddingTop: '12px' } }, [
            h('strong', 'Subtotal:'),
            h('strong', { style: { color: '#1890ff' } }, `¥${subtotal.toLocaleString()}`),
          ]),
        ],
      );
    };
  },
});

export const OrderSummaryCard = defineComponent({
  name: 'OrderSummaryCard',
  props: {
    cart: { type: [Array, String], default: (): any[] => [] },
    checkoutAction: { type: Object, default: undefined },
    onAction: { type: Function, default: undefined },
  },
  setup(props) {
    return () => {
      const cart = toArray<CartItem>(props.cart);
      const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      const discount = subtotal >= 10000 ? subtotal * 0.1 : subtotal >= 5000 ? subtotal * 0.05 : 0;
      const discountRate = subtotal >= 10000 ? '10%' : subtotal >= 5000 ? '5%' : '0%';
      const shipping = subtotal >= 1000 ? 0 : 15;
      const total = subtotal - discount + shipping;
      return h(
        'div',
        {
          style: {
            border: '1px solid #f0f0f0',
            borderRadius: '12px',
            padding: '14px',
            background: 'linear-gradient(180deg, #fafafa 0%, #fff 100%)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          },
        },
        [
          h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' } }, [
            h('span', '📋'),
            h('strong', 'Order Summary'),
          ]),
          h('div', { style: { display: 'grid', gap: '9px', fontSize: '13px' } }, [
            h('div', { style: { display: 'flex', justifyContent: 'space-between' } }, [
              h('span', { style: { color: '#8c8c8c' } }, 'Items:'),
              h('span', `${totalItems} items`),
            ]),
            h('div', { style: { display: 'flex', justifyContent: 'space-between' } }, [
              h('span', { style: { color: '#8c8c8c' } }, 'Subtotal:'),
              h('span', `¥${subtotal.toLocaleString()}`),
            ]),
            h('div', { style: { height: '1px', background: '#f0f0f0' } }),
            h('div', { style: { display: 'flex', justifyContent: 'space-between' } }, [
              h('span', { style: { color: '#8c8c8c' } }, ['Discount: ', discount > 0 ? `(${discountRate} off)` : '']),
              h('span', { style: { color: '#52c41a' } }, `-¥${discount.toLocaleString()}`),
            ]),
            h('div', { style: { display: 'flex', justifyContent: 'space-between' } }, [
              h('span', { style: { color: '#8c8c8c' } }, 'Shipping:'),
              h('span', { style: { color: shipping === 0 ? '#52c41a' : '#262626' } }, shipping === 0 ? 'Free' : `¥${shipping}`),
            ]),
            h('div', { style: { height: '1px', background: '#f0f0f0' } }),
            h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }, [
              h('strong', 'Total:'),
              h('strong', { style: { color: '#ff4d4f', fontSize: '20px' } }, `¥${total.toLocaleString()}`),
            ]),
            subtotal < 5000
              ? h(
                  'div',
                  { style: { padding: '7px 9px', background: '#fff7e6', borderRadius: '7px', color: '#d46b08', fontSize: '11px' } },
                  `💡 Spend ¥${(5000 - subtotal).toLocaleString()} more for 5% off!`,
                )
              : subtotal < 10000
                ? h(
                    'div',
                    { style: { padding: '7px 9px', background: '#fff7e6', borderRadius: '7px', color: '#d46b08', fontSize: '11px' } },
                    `💡 Spend ¥${(10000 - subtotal).toLocaleString()} more for 10% off!`,
                  )
                : h(
                    'div',
                    { style: { padding: '7px 9px', background: '#f6ffed', borderRadius: '7px', color: '#52c41a', fontSize: '11px' } },
                    "🎉 You've got the maximum discount!",
                  ),
            h(
              'button',
              {
                type: 'button',
                disabled: cart.length === 0,
                onClick: () => {
                  const name = actionName(props.checkoutAction) || 'checkout';
                  props.onAction?.(name, { cart, subtotal, discount, shipping, total, itemCount: totalItems });
                },
                style: {
                  marginTop: '8px',
                  padding: '10px 14px',
                  border: '0',
                  borderRadius: '8px',
                  background: cart.length ? '#1677ff' : '#d9d9d9',
                  color: '#fff',
                  cursor: cart.length ? 'pointer' : 'not-allowed',
                  fontSize: '14px',
                },
              },
              `Checkout (¥${total.toLocaleString()})`,
            ),
          ]),
        ],
      );
    };
  },
});

export const MultiCardContainer = defineComponent({
  name: 'MultiCardContainer',
  setup(_, { slots }) {
    return () =>
      h(
        'div',
        {
          style: {
            borderRadius: '16px',
            border: '1.5px solid #e8e8e8',
            padding: '20px',
            background: '#fff',
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
          },
        },
        h(
          'div',
          { style: { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '16px', alignItems: 'stretch' } },
          slots.default?.(),
        ),
      );
  },
});

export const ColWrapper = defineComponent({
  name: 'ColWrapper',
  setup(_, { slots }) {
    return () => h('div', { style: { minWidth: '0' } }, slots.default?.());
  },
});

export const CheckoutSuccessCard = defineComponent({
  name: 'CheckoutSuccessCard',
  props: {
    total: { type: [Number, String], default: 0 },
    itemCount: { type: [Number, String], default: 0 },
    orderNumber: { type: String, default: '' },
    onAction: { type: Function, default: undefined },
  },
  setup(props) {
    return () =>
      h(
        'div',
        {
          style: {
            maxWidth: '400px',
            margin: '0 auto',
            borderRadius: '16px',
            padding: '26px 22px',
            background: 'linear-gradient(145deg, #52c41a 0%, #73d13d 100%)',
            boxShadow: '0 8px 24px rgba(82,196,26,0.35)',
            color: '#fff',
            textAlign: 'center',
          },
        },
        [
          h(
            'div',
            {
              style: {
                width: '72px',
                height: '72px',
                margin: '0 auto 14px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '36px',
              },
            },
            '✅',
          ),
          h('h3', { style: { margin: '0 0 6px', fontSize: '21px' } }, 'Order Placed!'),
          h('p', { style: { margin: '0 0 20px', color: 'rgba(255,255,255,0.85)' } }, 'Thank you for your purchase!'),
          h(
            'div',
            { style: { padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.15)', marginBottom: '16px' } },
            [
              h('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '7px' } }, [
                h('span', { style: { color: 'rgba(255,255,255,0.75)' } }, 'Order Number:'),
                h('strong', props.orderNumber),
              ]),
              h('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '7px' } }, [
                h('span', { style: { color: 'rgba(255,255,255,0.75)' } }, 'Items:'),
                h('span', `${props.itemCount} items`),
              ]),
              h('div', { style: { display: 'flex', justifyContent: 'space-between' } }, [
                h('span', { style: { color: 'rgba(255,255,255,0.75)' } }, 'Total:'),
                h('strong', { style: { fontSize: '18px' } }, `¥${Number(props.total).toLocaleString()}`),
              ]),
            ],
          ),
          h(
            'button',
            {
              type: 'button',
              onClick: () => props.onAction?.('restart_demo', {}),
              style: {
                padding: '9px 18px',
                border: '1px solid rgba(255,255,255,0.8)',
                borderRadius: '8px',
                background: 'transparent',
                color: '#fff',
                cursor: 'pointer',
              },
            },
            'Continue Shopping',
          ),
        ],
      );
  },
});

export const RegistrationForm = defineComponent({
  name: 'RegistrationForm',
  props: {
    step: { type: [Number, String], default: 0 },
    status: { type: String, default: '' },
    errorMessage: { type: String, default: '' },
    action: { type: Object, default: undefined },
    onAction: { type: Function, default: undefined },
    onDataChange: { type: Function, default: undefined },
  },
  setup(props) {
    const currentStep = ref(Number(props.step) || 0);
    const completed = ref(false);

    watch(
      () => props.step,
      (step) => {
        currentStep.value = Number(step) || 0;
      },
    );

    const makeField = (path: string, rules: XCardFieldRule[], initialValue = '') =>
      useXCardField({
        path,
        initialValue,
        rules,
        onDataChange: (dataPath: string, value: unknown) => props.onDataChange?.(dataPath, value),
      });

    const username = makeField('/registration/formData/username', [
      { required: true, message: '请输入用户名' },
      { minLength: 3, message: '用户名至少 3 个字符' },
      { pattern: /^[a-zA-Z0-9_]+$/, message: '只能包含字母、数字和下划线' },
    ]);
    const email = makeField('/registration/formData/email', [
      { required: true, message: '请输入邮箱' },
      { pattern: /.+@.+\..+/, message: '邮箱格式不正确' },
    ]);
    const password = makeField('/registration/formData/password', [
      { required: true, message: '请输入密码' },
      { minLength: 8, message: '密码至少 8 个字符' },
      {
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        message: '必须包含大写字母、小写字母和数字',
      },
    ]);
    const confirmPassword = makeField(
      '/registration/formData/confirmPassword',
      [
        { required: true, message: '请确认密码' },
        {
          validator: (value: unknown) =>
            value === password.value.value ? undefined : '两次输入的密码不一致',
        },
      ],
    );
    const accountType = makeField('/registration/formData/accountType', [
      { required: true, message: '请选择账户类型' },
    ], 'personal');

    const values = () => ({
      username: username.value.value,
      email: email.value.value,
      password: password.value.value,
      confirmPassword: confirmPassword.value.value,
      accountType: accountType.value.value || 'personal',
    });

    const emitStep = (step: number, final = false) => {
      const name = actionName(props.action);
      if (!name) return;
      const formData = { step, values: values(), ...(final ? { submit: true } : {}) };
      props.onAction?.(name, buildActionContext(props.action, formData));
    };

    const goNext = () => {
      const fields =
        currentStep.value === 0
          ? [username, email]
          : [password, confirmPassword, accountType];
      const valid = fields.map((field) => field.validate()).every(Boolean);
      if (!valid) return;

      if (currentStep.value === 1) {
        completed.value = true;
        currentStep.value = 2;
        emitStep(2, true);
      } else {
        const nextStep = currentStep.value + 1;
        emitStep(nextStep);
        currentStep.value = nextStep;
      }
    };

    const inputStyle = {
      width: '100%',
      boxSizing: 'border-box',
      padding: '8px 10px',
      border: '1px solid #d9d9d9',
      borderRadius: '8px',
    } as const;

    const renderField = (
      label: string,
      field: ReturnType<typeof makeField>,
      type = 'text',
      placeholder = '',
    ) =>
      h('label', { style: { display: 'grid', gap: '5px', fontSize: '13px' } }, [
        h('span', { style: { fontWeight: '600' } }, label),
        h('input', {
          type,
          value: field.value.value,
          placeholder,
          onInput: (event: Event) => field.setValue((event.target as HTMLInputElement).value),
          style: inputStyle,
        }),
        field.error.value
          ? h('span', { style: { color: '#ff4d4f', fontSize: '11px' } }, field.error.value)
          : null,
      ]);

    const steps = [
      ['Basic Info', 'Username & Email'],
      ['Security', 'Password'],
      ['Complete', 'Account Created'],
    ];

    return () =>
      h(
        'div',
        {
          style: {
            borderRadius: '16px',
            border: '1.5px solid #e8e8e8',
            padding: '22px',
            background: '#fff',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            minWidth: '480px',
            maxWidth: '620px',
          },
        },
        [
          h(
            'div',
            { style: { display: 'flex', alignItems: 'center', marginBottom: '22px' } },
            steps.map(([title, description], index) => {
              const active = index === currentStep.value;
              const finished = index < currentStep.value;
              return h('div', { key: title, style: { flex: '1', textAlign: 'center', position: 'relative' } }, [
                h(
                  'span',
                  {
                    style: {
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: active || finished ? '#1677ff' : '#f0f0f0',
                      color: active || finished ? '#fff' : '#8c8c8c',
                      fontSize: '13px',
                      marginBottom: '5px',
                    },
                  },
                  finished ? '✓' : String(index + 1),
                ),
                h('strong', { style: { display: 'block', fontSize: '12px' } }, title),
                h('span', { style: { color: '#8c8c8c', fontSize: '10px' } }, description),
              ]);
            }),
          ),
          props.status === 'error' && props.errorMessage
            ? h(
                'div',
                {
                  style: {
                    padding: '11px 14px',
                    marginBottom: '14px',
                    borderRadius: '8px',
                    background: '#fff2f0',
                    border: '1px solid #ffccc7',
                    color: '#ff4d4f',
                    fontSize: '13px',
                  },
                },
                props.errorMessage,
              )
            : null,
          currentStep.value === 0
            ? h('div', { style: { display: 'grid', gap: '13px' } }, [
                renderField('Username', username, 'text', 'Enter username'),
                renderField('Email', email, 'email', 'Enter email'),
              ])
            : currentStep.value === 1
              ? h('div', { style: { display: 'grid', gap: '13px' } }, [
                  renderField('Password', password, 'password', 'Enter password'),
                  renderField('Confirm Password', confirmPassword, 'password', 'Confirm password'),
                  h('label', { style: { display: 'grid', gap: '5px', fontSize: '13px' } }, [
                    h('span', { style: { fontWeight: '600' } }, 'Account Type'),
                    h(
                      'select',
                      {
                        value: accountType.value.value || 'personal',
                        onChange: (event: Event) =>
                          accountType.setValue((event.target as HTMLSelectElement).value),
                        style: inputStyle,
                      },
                      [
                        h('option', { value: 'personal' }, 'Personal'),
                        h('option', { value: 'business' }, 'Business'),
                        h('option', { value: 'developer' }, 'Developer'),
                      ],
                    ),
                    accountType.error.value
                      ? h('span', { style: { color: '#ff4d4f', fontSize: '11px' } }, accountType.error.value)
                      : null,
                  ]),
                ])
              : h(
                  'div',
                  {
                    style: {
                      textAlign: 'center',
                      padding: '36px 20px',
                      background: '#f6ffed',
                      borderRadius: '12px',
                      border: '1px solid #b7eb8f',
                    },
                  },
                  [
                    h('div', { style: { fontSize: '46px', marginBottom: '12px' } }, '✅'),
                    h('h3', { style: { margin: '0 0 6px', color: '#52c41a' } }, 'Registration Successful!'),
                    h('span', { style: { color: '#8c8c8c' } }, 'Your account has been created successfully.'),
                  ],
                ),
          currentStep.value < 2
            ? h('div', { style: { display: 'flex', justifyContent: 'space-between', marginTop: '22px' } }, [
                h(
                  'button',
                  {
                    type: 'button',
                    disabled: currentStep.value === 0,
                    onClick: () => {
                      currentStep.value = Math.max(0, currentStep.value - 1);
                    },
                    style: {
                      padding: '8px 16px',
                      border: '1px solid #d9d9d9',
                      borderRadius: '8px',
                      background: currentStep.value === 0 ? '#f5f5f5' : '#fff',
                      color: currentStep.value === 0 ? '#bfbfbf' : '#262626',
                      cursor: currentStep.value === 0 ? 'not-allowed' : 'pointer',
                    },
                  },
                  'Previous',
                ),
                h(
                  'button',
                  {
                    type: 'button',
                    onClick: goNext,
                    style: {
                      padding: '8px 18px',
                      border: '0',
                      borderRadius: '8px',
                      background: props.status === 'loading' ? '#91caff' : '#1677ff',
                      color: '#fff',
                      cursor: props.status === 'loading' ? 'wait' : 'pointer',
                    },
                  },
                  props.status === 'loading' ? 'Submitting…' : currentStep.value === 1 ? 'Submit' : 'Next',
                ),
              ])
            : completed.value
              ? h('div', { style: { marginTop: '14px', textAlign: 'center', color: '#52c41a', fontSize: '13px' } }, '表单已提交，正在生成结果卡片…')
              : null,
        ],
      );
  },
});

export const SuccessCard = defineComponent({
  name: 'SuccessCard',
  props: {
    username: { type: String, default: '' },
    email: { type: String, default: '' },
    accountType: { type: String, default: 'personal' },
  },
  setup(props) {
    return () =>
      h(
        'div',
        {
          style: {
            borderRadius: '16px',
            border: '1.5px solid #52c41a',
            padding: '24px',
            background: 'linear-gradient(135deg, #f6ffed 0%, #fff 100%)',
            boxShadow: '0 2px 12px rgba(82,196,26,0.15)',
            minWidth: '400px',
            maxWidth: '500px',
          },
        },
        [
          h('div', { style: { textAlign: 'center', marginBottom: '22px' } }, [
            h('div', { style: { fontSize: '52px', marginBottom: '12px' } }, '🎉'),
            h('h2', { style: { margin: '0 0 6px', color: '#52c41a' } }, `Welcome, ${props.username || 'there'}!`),
            h('span', { style: { color: '#8c8c8c' } }, 'Your account has been created successfully.'),
          ]),
          h(
            'div',
            { style: { background: '#fff', borderRadius: '12px', padding: '16px 20px', marginBottom: '16px', display: 'grid', gap: '10px' } },
            [
              h('div', { style: { display: 'flex', justifyContent: 'space-between' } }, [
                h('span', { style: { color: '#8c8c8c' } }, 'Email:'),
                h('strong', props.email),
              ]),
              h('div', { style: { display: 'flex', justifyContent: 'space-between' } }, [
                h('span', { style: { color: '#8c8c8c' } }, 'Account Type:'),
                h('strong', { style: { textTransform: 'capitalize' } }, props.accountType),
              ]),
            ],
          ),
          h(
            'button',
            {
              type: 'button',
              style: {
                width: '100%',
                padding: '10px 14px',
                border: '0',
                borderRadius: '8px',
                background: '#1677ff',
                color: '#fff',
              },
            },
            'Start Exploring',
          ),
        ],
      );
  },
});

export const FormCard = defineComponent({
  name: 'FormCard',
  setup(_, { slots }) {
    return () =>
      h(
        'div',
        {
          style: {
            padding: '18px',
            borderRadius: '10px',
            border: '1px solid #e8e8e8',
            background: '#fff',
            maxWidth: '380px',
          },
        },
        h('div', { style: { display: 'grid', gap: '12px' } }, slots.default?.()),
      );
  },
});

export const Title = defineComponent({
  name: 'Title',
  props: {
    text: { type: String, default: '' },
    variant: { type: String, default: '' },
  },
  setup(props) {
    return () =>
      props.variant === 'h2'
        ? h('h3', { style: { margin: '0', fontSize: '20px' } }, props.text)
        : h('span', props.text);
  },
});

export const FormInput = defineComponent({
  name: 'FormInput',
  props: {
    label: { type: String, default: '' },
    action: { type: Object, default: undefined },
    onAction: { type: Function, default: undefined },
  },
  setup(props) {
    const value = ref('');
    return () =>
      h('label', { style: { display: 'grid', gap: '5px', fontSize: '13px' } }, [
        h('strong', props.label),
        h('textarea', {
          value: value.value,
          rows: 2,
          placeholder: `请输入${props.label}`,
          onInput: (event: Event) => {
            const next = (event.target as HTMLTextAreaElement).value;
            value.value = next;
            const name = actionName(props.action);
            if (name) props.onAction?.(name, buildActionContext(props.action, next));
          },
          style: {
            width: '100%',
            boxSizing: 'border-box',
            padding: '7px 9px',
            border: '1px solid #d9d9d9',
            borderRadius: '7px',
            resize: 'vertical',
          },
        }),
      ]);
  },
});

export const SubmitButton = defineComponent({
  name: 'SubmitButton',
  props: {
    text: { type: String, default: '提交' },
    action: { type: Object, default: undefined },
    onAction: { type: Function, default: undefined },
  },
  setup(props) {
    return () =>
      h(
        'button',
        {
          type: 'button',
          onClick: () => {
            const name = actionName(props.action);
            if (name) props.onAction?.(name, {});
          },
          style: {
            width: '100%',
            padding: '8px 12px',
            border: '0',
            borderRadius: '7px',
            background: '#1677ff',
            color: '#fff',
            cursor: 'pointer',
          },
        },
        props.text,
      );
  },
});
