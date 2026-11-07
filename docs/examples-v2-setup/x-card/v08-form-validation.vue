<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import {
  XCard,
  type ActionPayload,
  type XAgentCommand_v0_8,
} from '@ant-design-x-vue/x-card';
import { RegistrationForm, SuccessCard } from './_shared';

const HEADER_TEXT =
  'Welcome to register! 🎉\n\nPlease fill in your information to create an account. We will verify your information step by step.';

const commands = ref<XAgentCommand_v0_8[]>([]);
const headerText = ref('');
const notice = ref('');
let textTimer: number | undefined;
let resultTimer: number | undefined;

const append = (...next: XAgentCommand_v0_8[]) => {
  commands.value = [...commands.value, ...next];
};

const createRegistrationCommands = (): XAgentCommand_v0_8[] => [
  {
    surfaceUpdate: {
      surfaceId: 'registration',
      components: [
        {
          id: 'registration-form',
          component: {
            RegistrationForm: {
              step: { literalString: '0' },
              status: { path: '/status' },
              errorMessage: { path: '/errorMessage' },
              action: {
                name: 'submit_step',
                context: [{ key: 'formData', value: { path: '/formData' } }],
              },
            },
          },
        },
      ],
    },
  },
  {
    dataModelUpdate: {
      surfaceId: 'registration',
      contents: [
        { key: 'status', valueString: '' },
        { key: 'errorMessage', valueString: '' },
      ],
    },
  },
  { beginRendering: { surfaceId: 'registration', root: 'registration-form' } },
];

const createResultCommands = (formData: any): XAgentCommand_v0_8[] => [
  {
    surfaceUpdate: {
      surfaceId: 'result',
      components: [
        {
          id: 'success-card',
          component: {
            SuccessCard: {
              username: { literalString: formData?.username ?? '' },
              email: { literalString: formData?.email ?? '' },
              accountType: { literalString: formData?.accountType ?? 'personal' },
            },
          },
        },
      ],
    },
  },
  { beginRendering: { surfaceId: 'result', root: 'success-card' } },
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
      append(...createRegistrationCommands());
    }
  }, 32);
};

const handleAction = (payload: ActionPayload) => {
  if (payload.name !== 'submit_step') return;
  const formData = (payload.context as Record<string, any>)?.formData;
  if (!formData) return;

  if (!formData.submit) {
    notice.value = `Step ${formData.step} completed`;
    return;
  }

  notice.value = 'Registration successful!';
  append({ deleteSurface: { surfaceId: 'registration' } });
  if (resultTimer) window.clearTimeout(resultTimer);
  resultTimer = window.setTimeout(() => {
    append(...createResultCommands(formData.values));
  }, 300);
};

const reload = () => {
  if (resultTimer) window.clearTimeout(resultTimer);
  notice.value = '';
  append(
    { deleteSurface: { surfaceId: 'registration' } },
    { deleteSurface: { surfaceId: 'result' } },
    ...createRegistrationCommands(),
  );
};

onMounted(startHeader);
onUnmounted(() => {
  if (textTimer) window.clearInterval(textTimer);
  if (resultTimer) window.clearTimeout(resultTimer);
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
      <span style="color: #8c8c8c; font-size: 13px">v0.8 分步校验 + 结果卡片</span>
    </div>

    <div style="white-space: pre-wrap; line-height: 1.7; font-size: 14px; color: #595959">{{ headerText }}</div>
    <p v-if="notice" style="margin: 10px 0; color: #1677ff; font-size: 13px">{{ notice }}</p>

    <XCard.Box
      :commands="commands"
      :components="{ RegistrationForm, SuccessCard }"
      :on-action="handleAction"
    >
      <XCard.Card id="registration" />
      <XCard.Card id="result" />
    </XCard.Box>
  </div>
</template>
