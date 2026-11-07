<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import {
  registerCatalog,
  XCard,
  type ActionPayload,
  type XAgentCommand_v0_9,
} from '@ant-design-x-vue/x-card';
import {
  CATALOGS,
  FormCard,
  FormInput,
  SubmitButton,
  Title,
} from './_shared';

registerCatalog(CATALOGS.action);

const commands = ref<XAgentCommand_v0_9[]>([]);
const logs = ref<string[]>([]);
const resolvedTip = ref('');
const sessionKey = ref(0);
let reloadTimer: number | undefined;

const append = (...next: XAgentCommand_v0_9[]) => {
  commands.value = [...commands.value, ...next];
};

const createFormCommands = (): XAgentCommand_v0_9[] => [
  {
    version: 'v0.9',
    createSurface: {
      surfaceId: 'form',
      catalogId: 'local://action_resolve_catalog',
    },
  },
  {
    version: 'v0.9',
    updateComponents: {
      surfaceId: 'form',
      components: [
        { id: 'title', component: 'Title', text: '用户注册表单', variant: 'h2' },
        {
          id: 'username-input',
          component: 'FormInput',
          label: '用户名',
          action: {
            event: {
              name: 'agent:send_context_text',
              context: {
                username: { path: '/form/username', label: '用户名' },
              },
            },
          },
        },
        {
          id: 'email-input',
          component: 'FormInput',
          label: '邮箱',
          action: {
            event: {
              name: 'agent:send_context_text',
              context: {
                email: { path: '/form/email', label: '邮箱' },
              },
            },
          },
        },
        {
          id: 'submit-btn',
          component: 'SubmitButton',
          text: '提交表单',
          action: {
            event: {
              name: 'agent:send_context_text',
              context: {
                username: { path: '/form/username', label: '用户名' },
                email: { path: '/form/email', label: '邮箱' },
              },
            },
          },
        },
        {
          id: 'root',
          component: 'FormCard',
          children: ['title', 'username-input', 'email-input', 'submit-btn'],
        },
      ],
    },
  },
  {
    version: 'v0.9',
    updateDataModel: {
      surfaceId: 'form',
      path: '/form',
      value: { username: '', email: '' },
    },
  },
];

const handleAction = (payload: ActionPayload) => {
  const log = `[${payload.name}]\n${JSON.stringify(payload.context, null, 2)}`;
  logs.value = [log, ...logs.value].slice(0, 4);
  resolvedTip.value = Object.values(payload.context || {}).some(
    (value) => value && typeof value === 'object' && 'value' in value,
  )
    ? 'Path 引用已自动解析为实际值'
    : '';
};

const reset = () => {
  if (reloadTimer) window.clearTimeout(reloadTimer);
  logs.value = [];
  resolvedTip.value = '';
  append({ version: 'v0.9', deleteSurface: { surfaceId: 'form' } });
  reloadTimer = window.setTimeout(() => {
    commands.value = [];
    sessionKey.value += 1;
    append(...createFormCommands());
  }, 50);
};

onMounted(() => append(...createFormCommands()));
onUnmounted(() => {
  if (reloadTimer) window.clearTimeout(reloadTimer);
});
</script>

<template>
  <div>
    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px">
      <button
        type="button"
        style="padding: 7px 13px; border: 0; border-radius: 7px; background: #fff; border: 1px solid #d9d9d9; cursor: pointer"
        @click="reset"
      >
        重置
      </button>
      <span style="color: #8c8c8c; font-size: 13px">填写表单后点击提交，观察 onAction 回调中 context 的变化</span>
    </div>

    <XCard.Box
      :key="sessionKey"
      :commands="commands"
      :components="{ FormCard, Title, FormInput, SubmitButton }"
      :on-action="handleAction"
    >
      <XCard.Card id="form" />
    </XCard.Box>

    <p v-if="resolvedTip" style="margin: 12px 0 0; color: #52c41a; font-size: 13px">
      {{ resolvedTip }}
    </p>
    <div style="margin-top: 16px">
      <strong style="font-size: 13px">onAction 回调日志（path 引用已解析）：</strong>
      <div
        v-if="logs.length"
        style="margin-top: 8px; max-height: 220px; overflow: auto; border: 1px solid #f0f0f0; border-radius: 8px"
      >
        <pre
          v-for="(log, index) in logs"
          :key="index"
          style="margin: 0; padding: 10px 12px; border-bottom: 1px solid #f5f5f5; font-size: 12px; white-space: pre-wrap"
        >{{ log }}</pre>
      </div>
      <p v-else style="color: #8c8c8c; font-size: 13px">暂无日志，请填写表单后提交</p>
    </div>
  </div>
</template>
