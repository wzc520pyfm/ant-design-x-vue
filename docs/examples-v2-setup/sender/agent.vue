<script setup lang="ts">
defineOptions({ name: 'AXSenderAgentV2Setup' });

import { ref, watch, onUnmounted, h, computed, type VNode } from 'vue';
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
import { Sender, SenderSwitch, type SenderProps } from 'ant-design-x-vue';
import { message } from 'ant-design-vue';
import type { MenuProps } from 'ant-design-vue';

type AgentEntry = {
  icon: VNode;
  label: string;
  zh_label: string;
  skill: SenderProps['skill'];
  zh_skill: SenderProps['skill'];
  slotConfig: SenderProps['slotConfig'];
  zh_slotConfig: SenderProps['slotConfig'];
};

const AgentInfo: Record<string, AgentEntry> = {
  deep_search: {
    icon: h(SearchOutlined),
    label: 'Deep Search',
    zh_label: '深度搜索',
    skill: { value: 'deepSearch', title: 'Deep Search', closable: true },
    zh_skill: { value: 'deepSearch', title: '深度搜索', closable: true },
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
      { type: 'text', key: '', value: 'Please help me search for news about ' },
    ],
    zh_slotConfig: [
      { type: 'text', value: '请帮我搜索关于' },
      {
        type: 'select',
        key: 'search_type',
        props: {
          options: ['AI', '技术', '娱乐'],
          placeholder: '请选择一个类别',
        },
      },
      { type: 'text', key: '', value: '的新闻。' },
    ],
  },
  ai_code: {
    icon: h(CodeOutlined),
    label: 'AI Code',
    zh_label: '写代码',
    skill: { value: 'aiCode', title: 'Code Assistant', closable: true },
    zh_skill: { value: 'aiCode', title: '代码助手', closable: true },
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
    zh_slotConfig: [
      { type: 'text', value: '请使用' },
      {
        type: 'select',
        key: 'code_lang',
        props: {
          options: ['JS', 'C++', 'Java'],
          placeholder: '请选择一个编程语言',
        },
      },
      { type: 'text', value: '写一个小游戏。' },
    ],
  },
  ai_writing: {
    icon: h(EditOutlined),
    label: 'Writing',
    zh_label: '帮我写作',
    skill: { value: 'writing', title: 'Writing Assistant', closable: true },
    zh_skill: { value: 'writing', title: '写作助手', closable: true },
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
        type: 'content',
        key: 'writing_num',
        props: {
          defaultValue: '800',
          placeholder: '[Please enter the number of words]',
        },
      },
      { type: 'text', value: ' words.' },
    ],
    zh_slotConfig: [
      { type: 'text', value: '请帮我写一篇关于' },
      {
        type: 'select',
        key: 'writing_type',
        props: {
          options: ['校园', '旅行', '阅读'],
          placeholder: '请输入主题',
        },
      },
      { type: 'text', value: '的文章。要求是' },
      {
        type: 'content',
        key: 'writing_num',
        props: {
          defaultValue: '800',
          placeholder: '[请输入字数]',
        },
      },
      { type: 'text', value: '字。' },
    ],
  },
};

const FileInfo: Record<string, { icon: VNode; label: string; zh_label: string }> = {
  file_image: {
    icon: h(FileImageOutlined),
    label: 'x-image',
    zh_label: 'x-图片',
  },
};

const loading = ref(false);
const deepThink = ref(true);
const activeAgentKey = ref('ai_writing');
const slotConfigState = ref(
  JSON.parse(JSON.stringify(AgentInfo[activeAgentKey.value])) as AgentEntry,
);
const senderRef = ref<InstanceType<typeof Sender> | null>(null);
const senderZhRef = ref<InstanceType<typeof Sender> | null>(null);

const agentItems: MenuProps['items'] = Object.keys(AgentInfo).map((agent) => ({
  key: agent,
  icon: AgentInfo[agent].icon,
  label: AgentInfo[agent].label,
}));

const zhAgentItems: MenuProps['items'] = Object.keys(AgentInfo).map((agent) => ({
  key: agent,
  icon: AgentInfo[agent].icon,
  label: AgentInfo[agent].zh_label,
}));

const fileItems = Object.keys(FileInfo).map((file) => ({
  key: file,
  icon: FileInfo[file].icon,
  label: FileInfo[file].label,
}));

const zhFileItems = Object.keys(FileInfo).map((file) => ({
  key: file,
  icon: FileInfo[file].icon,
  label: FileInfo[file].zh_label,
}));

const agentItemClick: MenuProps['onClick'] = (item) => {
  activeAgentKey.value = item.key as string;
  try {
    slotConfigState.value = JSON.parse(JSON.stringify(AgentInfo[item.key as string]));
  } catch (error) {
    console.error(error);
  }
};

const fileItemClick = (item: { key: string | number }, type?: string) => {
  const key = String(item.key);
  const { label, zh_label } = FileInfo[key];
  const display = type === 'zh' ? zh_label : label;
  const sender = type !== 'zh' ? senderRef.value : senderZhRef.value;
  sender?.insert?.([
    {
      type: 'tag',
      key: `${key}_${Date.now()}`,
      props: {
        label: display as any,
        value: key,
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
onUnmounted(() => {
  if (timer) clearTimeout(timer);
});

const onSubmitEn = (v: string, _slot?: any, skill?: SenderProps['skill']) => {
  loading.value = true;
  message.info(`Send message: ${skill?.value} | ${v}`);
  senderRef.value?.clear?.();
};

const onSubmitZh = (v: string, _slot?: any, skill?: SenderProps['skill']) => {
  loading.value = true;
  message.info(`Send message: ${skill?.value} | ${v}`);
  senderZhRef.value?.clear?.();
};

const onCancel = () => {
  loading.value = false;
  message.error('Cancel sending!');
};

const switchTextStyle = {
  display: 'inline-flex',
  width: '28px',
  justifyContent: 'center',
  alignItems: 'center',
};

const thinkLabelStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  whiteSpace: 'nowrap',
};
</script>

<template>
  <a-flex
    vertical
    gap="middle"
  >
    <Sender
      ref="senderRef"
      :loading="loading"
      :skill="slotConfigState.skill"
      placeholder="Press Enter to send message"
      :suffix="false"
      :slot-config="slotConfigState.slotConfig"
      :auto-size="{ minRows: 3, maxRows: 6 }"
      @submit="onSubmitEn"
      @cancel="onCancel"
    >
      <template #footer="{ ori }">
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
                <span :style="thinkLabelStyle">Deep Think:<span :style="switchTextStyle">on</span></span>
              </template>
              <template #unCheckedChildren>
                <span :style="thinkLabelStyle">Deep Think:<span :style="switchTextStyle">off</span></span>
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
              :menu="{ onClick: (item: any) => fileItemClick(item), items: fileItems }"
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
            <component :is="ori" />
          </a-flex>
        </a-flex>
      </template>
    </Sender>

    <Sender
      ref="senderZhRef"
      :loading="loading"
      :skill="slotConfigState.zh_skill"
      placeholder=""
      :suffix="false"
      :slot-config="slotConfigState.zh_slotConfig"
      :auto-size="{ minRows: 3, maxRows: 6 }"
      @submit="onSubmitZh"
      @cancel="onCancel"
    >
      <template #footer="{ ori }">
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
                <span :style="thinkLabelStyle">深度搜索：<span :style="switchTextStyle">开启</span></span>
              </template>
              <template #unCheckedChildren>
                <span :style="thinkLabelStyle">深度搜索：<span :style="switchTextStyle">关闭</span></span>
              </template>
              <template #icon>
                <RobotOutlined />
              </template>
            </SenderSwitch>
            <a-dropdown :menu="{ selectedKeys: [activeAgentKey], onClick: agentItemClick, items: zhAgentItems }">
              <SenderSwitch :value="false">
                <template #icon>
                  <AntDesignOutlined />
                </template>
                功能应用
              </SenderSwitch>
            </a-dropdown>
            <a-dropdown
              v-if="zhFileItems?.length"
              :menu="{ onClick: (item: any) => fileItemClick(item, 'zh'), items: zhFileItems }"
            >
              <SenderSwitch :value="false">
                <template #icon>
                  <ProfileOutlined />
                </template>
                文件引用
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
            <component :is="ori" />
          </a-flex>
        </a-flex>
      </template>
    </Sender>
  </a-flex>
</template>
