<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import {
  registerCatalog,
  XCard,
  type ActionPayload,
  type XAgentCommand_v0_9,
} from '@ant-design-x-vue/x-card';
import { CATALOGS, RegistrationForm, SuccessCard } from './_shared';

registerCatalog(CATALOGS.form);

const HEADER_TEXT =
  'Welcome to register! 🎉\n\nPlease fill in your information to create an account. We will verify your information step by step.';

const commands = ref<XAgentCommand_v0_9[]>([]);
const headerText = ref('');
const notice = ref('');
const sessionKey = ref(0);
let textTimer: number | undefined;
let resultTimer: number | undefined;
let reloadTimer: number | undefined;

const append = (...next: XAgentCommand_v0_9[]) => {
  commands.value = [...commands.value, ...next];
};

const createRegistrationCommands = (): XAgentCommand_v0_9[] => [
  {
    version: 'v0.9',
    createSurface: {
      surfaceId: 'registration',
      catalogId: 'local://form_validation_catalog.json',
    },
  },
  {
    version: 'v0.9',
    updateComponents: {
      surfaceId: 'registration',
      components: [
        {
          id: 'root',
          component: 'RegistrationForm',
          step: 0,
          status: { path: '/registration/status' },
          errorMessage: { path: '/registration/errorMessage' },
          action: {
            event: {
              name: 'submit_step',
              context: { formData: { path: '/registration/formData' } },
            },
          },
        },
      ],
    },
  },
  {
    version: 'v0.9',
    updateDataModel: {
      surfaceId: 'registration',
      path: '/registration',
      value: { status: '', errorMessage: '' },
    },
  },
];

const createResultCommands = (formData: any): XAgentCommand_v0_9[] => [
  {
    version: 'v0.9',
    createSurface: {
      surfaceId: 'result',
      catalogId: 'local://form_validation_catalog.json',
    },
  },
  {
    version: 'v0.9',
    updateComponents: {
      surfaceId: 'result',
      components: [
        {
          id: 'root',
          component: 'SuccessCard',
          username: formData?.username,
          email: formData?.email,
          accountType: formData?.accountType ?? 'personal',
        },
      ],
    },
  },
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
  append({ version: 'v0.9', deleteSurface: { surfaceId: 'registration' } });
  if (resultTimer) window.clearTimeout(resultTimer);
  resultTimer = window.setTimeout(() => {
    append(...createResultCommands(formData.values));
  }, 300);
};

const reload = () => {
  if (textTimer) window.clearInterval(textTimer);
  if (resultTimer) window.clearTimeout(resultTimer);
  if (reloadTimer) window.clearTimeout(reloadTimer);
  notice.value = '';
  headerText.value = '';
  append(
    { version: 'v0.9', deleteSurface: { surfaceId: 'registration' } },
    { version: 'v0.9', deleteSurface: { surfaceId: 'result' } },
  );
  reloadTimer = window.setTimeout(() => {
    commands.value = [];
    sessionKey.value += 1;
    startHeader();
  }, 50);
};

onMounted(startHeader);
onUnmounted(() => {
  if (textTimer) window.clearInterval(textTimer);
  if (resultTimer) window.clearTimeout(resultTimer);
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
      <span style="color: #8c8c8c; font-size: 13px">逐步校验信息，最后生成注册结果卡片</span>
    </div>

    <div style="white-space: pre-wrap; line-height: 1.7; font-size: 14px; color: #595959">{{ headerText }}</div>
    <p v-if="notice" style="margin: 10px 0; color: #1677ff; font-size: 13px">{{ notice }}</p>

    <XCard.Box
      :key="sessionKey"
      :commands="commands"
      :components="{ RegistrationForm, SuccessCard }"
      :on-action="handleAction"
    >
      <XCard.Card id="registration" />
      <XCard.Card id="result" />
    </XCard.Box>
  </div>
</template>
