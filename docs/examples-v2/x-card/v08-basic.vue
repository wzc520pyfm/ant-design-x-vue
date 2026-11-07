<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import {
  XCard,
  type ActionPayload,
  type XAgentCommand_v0_8,
} from '@ant-design-x-vue/x-card';
import {
  ActionButton,
  BookForm,
  CoffeeList,
  CoffeeResultCard,
  DateTimeInput,
  TextBlock,
} from './_shared';

const HEADER_TEXT =
  'Hello! Welcome to our online booking service 🎉\n\nPlease select your preferred date and time, and we will arrange the best seat for you. We look forward to seeing you!';
const ORDER_CONFIRMATION =
  '✅ Booking confirmed! Your order has been confirmed. We look forward to seeing you!';

const commands = ref<XAgentCommand_v0_8[]>([]);
const headerText = ref('');
const confirmation = ref('');
let textTimer: number | undefined;

const append = (...next: XAgentCommand_v0_8[]) => {
  commands.value = [...commands.value, ...next];
};

const createBookingCommands = (): XAgentCommand_v0_8[] => [
  {
    surfaceUpdate: {
      surfaceId: 'booking',
      components: [
        {
          id: 'title',
          component: {
            Text: {
              text: { literalString: 'Coffee Shop Order' },
              variant: { literalString: 'h1' },
            },
          },
        },
        {
          id: 'datetime',
          component: {
            DateTimeInput: {
              status: { path: '/status' },
              action: {
                name: 'select_date',
                context: [{ key: 'time', value: { path: '/res/time' } }],
              },
            },
          },
        },
        {
          id: 'coffee_list',
          component: {
            CoffeeList: {
              description: { literalString: 'Please select your favorite coffee' },
              status: { path: '/status' },
              action: {
                name: 'select_coffee',
                context: [{ key: 'coffee', value: { path: '/res/coffee' } }],
              },
            },
          },
        },
        {
          id: 'status-text',
          component: {
            Text: {
              status: { path: '/status' },
              variant: { literalString: 'success' },
            },
          },
        },
        {
          id: 'submit-text',
          component: { Text: { text: { literalString: 'Confirm Order' } } },
        },
        {
          id: 'submit-btn',
          component: {
            ActionButton: {
              child: 'submit-text',
              variant: { literalString: 'primary' },
              status: { path: '/status' },
              res: { path: '/res' },
              action: {
                name: 'confirm_booking',
                context: [
                  { key: 'status', value: { path: '/status' } },
                  { key: 'res', value: { path: '/res' } },
                ],
              },
            },
          },
        },
        {
          id: 'root',
          component: {
            BookForm: {
              children: {
                explicitList: ['title', 'datetime', 'coffee_list', 'status-text', 'submit-btn'],
              },
            },
          },
        },
      ],
    },
  },
  {
    dataModelUpdate: {
      surfaceId: 'booking',
      contents: [
        {
          key: 'res',
          valueMap: [{ key: 'time', valueString: new Date().toISOString() }],
        },
      ],
    },
  },
  { beginRendering: { surfaceId: 'booking', root: 'root' } },
];

const createResultCommands = (res: any): XAgentCommand_v0_8[] => [
  {
    surfaceUpdate: {
      surfaceId: 'result',
      components: [
        {
          id: 'result-card',
          component: {
            CoffeeResultCard: {
              name: { literalString: res?.coffee?.name ?? '' },
              description: { literalString: res?.coffee?.description ?? '' },
              price: { literalString: String(res?.coffee?.price ?? '') },
              tag: { literalString: res?.coffee?.tag ?? '' },
              date: { literalString: res?.time ?? '' },
            },
          },
        },
        {
          id: 'root',
          component: { BookForm: { child: 'result-card' } },
        },
      ],
    },
  },
  { beginRendering: { surfaceId: 'result', root: 'root' } },
];

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
    { deleteSurface: { surfaceId: 'booking' } },
    ...createResultCommands(res),
  );
};

const reload = () => {
  confirmation.value = '';
  append(
    { deleteSurface: { surfaceId: 'booking' } },
    { deleteSurface: { surfaceId: 'result' } },
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
      <span style="color: #8c8c8c; font-size: 13px">v0.8 surfaceUpdate + dataModelUpdate + beginRendering</span>
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
