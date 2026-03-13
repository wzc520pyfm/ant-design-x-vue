<script setup lang="ts">
defineOptions({ name: 'AXSenderAgentV2Setup' });

import { ref, watch, onUnmounted, h, type VNode } from 'vue';
import {
  AntDesignOutlined,
  ApiOutlined,
  CodeOutlined,
  EditOutlined,
  FileImageOutlined,
  RobotOutlined,
  PaperClipOutlined,
  ProfileOutlined,
  SearchOutlined,
} from '@ant-design/icons-vue';
import { Attachments, Sender, SenderHeader, SenderSwitch, type SenderProps, type AttachmentsProps } from 'ant-design-x-vue';
import { message } from 'ant-design-vue';
import type { MenuProps } from 'ant-design-vue';

const AgentInfo: Record<string, {
  icon: VNode;
  label: string;
  slotConfig: SenderProps['slotConfig'];
}> = {
  deep_search: {
    icon: h(SearchOutlined),
    label: 'Deep Search',
    slotConfig: [
      { type: 'text', value: 'Please help me search for news about ' },
      {
        type: 'select',
        key: 'search_type',
        props: {
          options: ['AI', 'Technology', 'Entertainment'],
          placeholder: 'Please select a category',
        },
      },
      { type: 'text', value: ' and summarize it into a list.' },
    ],
  },
  ai_code: {
    icon: h(CodeOutlined),
    label: 'AI Code',
    slotConfig: [
      { type: 'text', value: 'Please use ' },
      {
        type: 'select',
        key: 'code_lang',
        props: {
          options: ['JS', 'C++', 'Java'],
          placeholder: 'Please select a programming language',
        },
      },
      { type: 'text', value: ' to write a mini game.' },
    ],
  },
  ai_writing: {
    icon: h(EditOutlined),
    label: 'Writing',
    slotConfig: [
      { type: 'text', value: 'Please write an article about ' },
      {
        type: 'select',
        key: 'writing_type',
        props: {
          options: ['Campus', 'Travel', 'Reading'],
          placeholder: 'Please enter a topic',
        },
      },
      { type: 'text', value: '. The requirement is ' },
      {
        type: 'input',
        key: 'writing_num',
        props: {
          defaultValue: '800',
          placeholder: 'Please enter the number of words.',
        },
      },
      { type: 'text', value: ' words.' },
    ],
  },
};

const FileInfo: Record<string, { icon: VNode; label: string }> = {
  file_image: {
    icon: h(FileImageOutlined),
    label: 'x-image',
  },
};

const loading = ref(false);
const deepThink = ref(true);
const activeAgentKey = ref('deep_search');
const fileList = ref<AttachmentsProps['items']>([]);
const open = ref(false);
const attachmentsRef = ref<InstanceType<typeof Attachments> | null>(null);
const senderRef = ref<InstanceType<typeof Sender> | null>(null);

const agentItems: MenuProps['items'] = Object.keys(AgentInfo).map((agent) => ({
  key: agent,
  icon: AgentInfo[agent].icon,
  label: AgentInfo[agent].label,
}));

const fileItems = Object.keys(FileInfo).map((file) => ({
  key: file,
  icon: FileInfo[file].icon,
  label: FileInfo[file].label,
}));

const agentItemClick: MenuProps['onClick'] = (item) => {
  activeAgentKey.value = item.key as string;
};

const fileItemClick: MenuProps['onClick'] = (item) => {
  const { icon, label } = FileInfo[item.key as string];
  senderRef.value?.insert?.([
    {
      type: 'tag',
      key: `${item.key}_${Date.now()}`,
      props: {
        label: `${label}`,
        value: item.key,
      },
    },
  ]);
};

let timer: ReturnType<typeof setTimeout> | null = null;
watch(loading, (val) => {
  if (val) {
    timer = setTimeout(() => {
      loading.value = false;
      message.success('Send message successfully!');
    }, 3000);
  }
});
onUnmounted(() => { if (timer) clearTimeout(timer); });

const onSubmit = (v: string) => {
  loading.value = true;
  message.info(`Send message: ${v}`);
  senderRef.value?.clear?.();
};

const onCancel = () => {
  loading.value = false;
  message.error('Cancel sending!');
};

const footerRender = (actionNode: any) => actionNode;
</script>

<template>
  <a-flex
    vertical
    gap="middle"
  >
    <Sender
      ref="senderRef"
      :loading="loading"
      placeholder="Press Enter to send message"
      :suffix="false"
      :slot-config="AgentInfo[activeAgentKey].slotConfig"
      :auto-size="{ minRows: 3, maxRows: 6 }"
      @submit="onSubmit"
      @cancel="onCancel"
    >
      <template #header>
        <SenderHeader
          title="Attachments"
          :styles="{ content: { padding: 0 } }"
          :open="open"
          force-render
          @open-change="(val: boolean) => { open = val; }"
        >
          <Attachments
            ref="attachmentsRef"
            :before-upload="() => false"
            :items="fileList"
            :get-drop-container="() => senderRef?.nativeElement"
            @change="({ fileList: fl }: any) => { fileList = fl; }"
          />
        </SenderHeader>
      </template>
      <template #footer="{ node }">
        <a-flex
          justify="space-between"
          align="center"
        >
          <a-flex
            gap="small"
            align="center"
          >
            <a-button
              :style="{ fontSize: '16px' }"
              type="text"
            >
              <template #icon>
                <PaperClipOutlined />
              </template>
            </a-button>
            <SenderSwitch
              :value="deepThink"
              @change="(checked: boolean) => { deepThink = checked; }"
            >
              <template #checkedChildren>
                <div>Deep Think:<span :style="{ display: 'inline-flex', width: '28px', justifyContent: 'center', alignItems: 'center' }">on</span></div>
              </template>
              <template #unCheckedChildren>
                <div>Deep Think:<span :style="{ display: 'inline-flex', width: '28px', justifyContent: 'center', alignItems: 'center' }">off</span></div>
              </template>
              <template #icon>
                <RobotOutlined />
              </template>
            </SenderSwitch>
            <a-dropdown :menu="{ selectedKeys: [activeAgentKey], onClick: agentItemClick, items: agentItems }">
              <SenderSwitch :value="false">
                <template #icon>
                  <AntDesignOutlined />
                </template>
                Agent
              </SenderSwitch>
            </a-dropdown>
            <a-dropdown
              v-if="fileItems?.length"
              :menu="{ onClick: fileItemClick, items: fileItems }"
            >
              <SenderSwitch :value="false">
                <template #icon>
                  <ProfileOutlined />
                </template>
                Files
              </SenderSwitch>
            </a-dropdown>
          </a-flex>
          <a-flex align="center">
            <a-button
              type="text"
              :style="{ fontSize: '16px' }"
            >
              <template #icon>
                <ApiOutlined />
              </template>
            </a-button>
            <a-divider type="vertical" />
            <component :is="node" />
          </a-flex>
        </a-flex>
      </template>
    </Sender>
  </a-flex>
</template>
