<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import {
  registerCatalog,
  XCard,
  type ActionPayload,
  type XAgentCommand_v0_9,
} from '@ant-design-x-vue/x-card';
import {
  ActionButton,
  BookForm,
  CATALOGS,
  CoffeeList,
  CoffeeResultCard,
  COFFEE_LIST,
  DateTimeInput,
  TextBlock,
} from './_shared';

registerCatalog(CATALOGS.coffee);

const HEADER_TEXT =
  'Hello! Welcome to our online booking service 🎉\n\nPlease select your preferred date and time, and we will arrange the best seat for you. We look forward to seeing you!';
const ORDER_CONFIRMATION =
  '✅ Booking confirmed! Your order has been confirmed. We look forward to seeing you!';

const commands = ref<XAgentCommand_v0_9[]>([]);
const headerText = ref('');
const confirmation = ref('');
let textTimer: number | undefined;

const append = (...next: XAgentCommand_v0_9[]) => {
  commands.value = [...commands.value, ...next];
};

const createBookingCommands = (): XAgentCommand_v0_9[] => [
  {
    version: 'v0.9',
    createSurface: {
      surfaceId: 'booking',
      catalogId: 'local://coffee_booking_catalog.json',
    },
  },
  {
    version: 'v0.9',
    updateComponents: {
      surfaceId: 'booking',
      components: [
        { id: 'title', component: 'Text', text: 'Coffee Shop Order', variant: 'h1' },
        {
          id: 'datetime',
          component: 'DateTimeInput',
          status: { path: '/booking/status' },
          action: {
            event: {
              name: 'select_date',
              context: { time: { path: '/booking/res/time' } },
            },
          },
        },
        {
          id: 'coffee_list',
          component: 'CoffeeList',
          list: { path: '/booking/list/data' },
          description: { path: '/booking/list/description' },
          status: { path: '/booking/status' },
          action: {
            event: {
              name: 'select_coffee',
              context: { coffee: { path: '/booking/res/coffee' } },
            },
          },
        },
        { id: 'status-text', component: 'Text', status: { path: '/booking/status' }, variant: 'success' },
        { id: 'submit-text', component: 'Text', text: 'Confirm Order' },
        {
          id: 'submit-btn',
          component: 'ActionButton',
          child: 'submit-text',
          variant: 'primary',
          status: { path: '/booking/status' },
          res: { path: '/booking/res' },
          action: {
            event: {
              name: 'confirm_booking',
              context: {
                status: { path: '/booking/status' },
                res: { path: '/booking/res' },
              },
            },
          },
        },
        {
          id: 'root',
          component: 'BookForm',
          children: ['title', 'datetime', 'coffee_list', 'status-text', 'submit-btn'],
        },
      ],
    },
  },
  {
    version: 'v0.9',
    updateDataModel: {
      surfaceId: 'booking',
      path: '/booking',
      value: {
        res: { time: new Date().toISOString() },
        list: {
          description: 'Coffee List',
          data: COFFEE_LIST,
        },
      },
    },
  },
];

const createResultCommand = (res: any): XAgentCommand_v0_9 => ({
  version: 'v0.9',
  updateComponents: {
    surfaceId: 'result',
    components: [
      {
        id: 'result-card',
        component: 'CoffeeResultCard',
        name: res?.coffee?.name,
        description: res?.coffee?.description,
        price: res?.coffee?.price,
        tag: res?.coffee?.tag,
        date: res?.time,
      },
      { id: 'root', component: 'BookForm', children: ['result-card'] },
    ],
  },
});

const startHeader = () => {
  if (textTimer) window.clearInterval(textTimer);
  headerText.value = '';
  let index = 0;
  textTimer = window.setInterval(() => {
    index = Math.min(index + 3, HEADER_TEXT.length);
    headerText.value = HEADER_TEXT.slice(0, index);
    if (index >= HEADER_TEXT.length) {
      if (textTimer) window.clearInterval(textTimer);
      append(...createBookingCommands());
    }
  }, 32);
};

const handleAction = (payload: ActionPayload) => {
  if (payload.name !== 'confirm_booking') return;
  const { res, status } = (payload.context || {}) as Record<string, any>;
  if (status !== 'success' || !res) return;

  confirmation.value = ORDER_CONFIRMATION;
  append(
    { version: 'v0.9', deleteSurface: { surfaceId: 'booking' } },
    {
      version: 'v0.9',
      createSurface: {
        surfaceId: 'result',
        catalogId: 'local://coffee_booking_catalog.json',
      },
    },
    createResultCommand(res),
  );
};

const reload = () => {
  confirmation.value = '';
  append(
    { version: 'v0.9', deleteSurface: { surfaceId: 'booking' } },
    { version: 'v0.9', deleteSurface: { surfaceId: 'result' } },
    ...createBookingCommands(),
  );
};

onMounted(startHeader);
onUnmounted(() => {
  if (textTimer) window.clearInterval(textTimer);
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
      <span style="color: #8c8c8c; font-size: 13px">选择日期和咖啡后确认订单</span>
    </div>

    <div style="white-space: pre-wrap; line-height: 1.7; font-size: 14px; color: #595959">{{ headerText }}</div>
    <p v-if="confirmation" style="margin: 10px 0; color: #52c41a; font-weight: 600">{{ confirmation }}</p>

    <XCard.Box
      :commands="commands"
      :components="{ Text: TextBlock, DateTimeInput, BookForm, ActionButton, CoffeeList, CoffeeResultCard }"
      :on-action="handleAction"
    >
      <XCard.Card id="booking" />
      <XCard.Card id="result" />
    </XCard.Box>
  </div>
</template>
