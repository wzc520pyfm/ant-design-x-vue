<script setup lang="tsx">
defineOptions({ name: 'AXSenderAgentV2' });

import { ref, watch, onUnmounted, type VNode } from 'vue';
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
import { Sender, type SenderProps } from 'ant-design-x-vue';
import { Button, Divider, Dropdown, Flex, message } from 'ant-design-vue';
import type { MenuProps } from 'ant-design-vue';

const SenderSwitch = Sender.Switch;

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
    icon: <SearchOutlined />,
    label: 'Deep Search',
    zh_label: '深度搜索',
    skill: {
      value: 'deepSearch',
      title: 'Deep Search',
      closable: true,
    },
    zh_skill: {
      value: 'deepSearch',
      title: '深度搜索',
      closable: true,
    },
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
    icon: <CodeOutlined />,
    label: 'AI Code',
    zh_label: '写代码',
    skill: {
      value: 'aiCode',
      title: 'Code Assistant',
      closable: true,
    },
    zh_skill: {
      value: 'aiCode',
      title: '代码助手',
      closable: true,
    },
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
    icon: <EditOutlined />,
    label: 'Writing',
    zh_label: '帮我写作',
    skill: {
      value: 'writing',
      title: 'Writing Assistant',
      closable: true,
    },
    zh_skill: {
      value: 'writing',
      title: '写作助手',
      closable: true,
    },
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

const IconStyle = { fontSize: '16px' };

const SwitchTextStyle = {
  display: 'inline-flex',
  width: '28px',
  justifyContent: 'center',
  alignItems: 'center',
};

const ThinkLabelStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  whiteSpace: 'nowrap',
};

const FileInfo: Record<string, { icon: VNode; label: string; zh_label: string }> = {
  file_image: {
    icon: <FileImageOutlined />,
    label: 'x-image',
    zh_label: 'x-图片',
  },
};

const loading = ref(false);
const deepThink = ref(true);
const activeAgentKey = ref('ai_writing');
const slotConfigState = ref(JSON.parse(JSON.stringify(AgentInfo[activeAgentKey.value])) as AgentEntry);
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
  const { icon, label, zh_label } = FileInfo[key];
  const display = type === 'zh' ? zh_label : label;
  const sender = type !== 'zh' ? senderRef.value : senderZhRef.value;
  sender?.insert?.([
    {
      type: 'tag',
      key: `${key}_${Date.now()}`,
      props: {
        label: (
          <Flex style={{ display: 'inline-flex' }} gap="small">
            {icon}
            {display}
          </Flex>
        ),
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
onUnmounted(() => { if (timer) clearTimeout(timer); });

const footerCommon = (
  actionNode: VNode,
  opts: {
    agentMenuItems: MenuProps['items'];
    fileMenuItems: typeof fileItems;
    onFileClick: (item: { key: string | number }) => void;
    thinkOn: VNode;
    thinkOff: VNode;
    agentLabel: string;
    filesLabel: string;
  },
) => (
  <Flex justify="space-between" align="center">
    <Flex gap="small" align="center">
      <Button style={IconStyle} type="text" icon={<PaperClipOutlined />} />
      <SenderSwitch
        value={deepThink.value}
        checkedChildren={opts.thinkOn}
        unCheckedChildren={opts.thinkOff}
        onChange={(checked: boolean) => { deepThink.value = checked; }}
        icon={<RobotOutlined />}
      />
      <Dropdown
        menu={{
          selectedKeys: [activeAgentKey.value],
          onClick: agentItemClick,
          items: opts.agentMenuItems,
        }}
      >
        <SenderSwitch value={false} icon={<AntDesignOutlined />}>
          {opts.agentLabel}
        </SenderSwitch>
      </Dropdown>
      {opts.fileMenuItems?.length ? (
        <Dropdown menu={{ onClick: opts.onFileClick as any, items: opts.fileMenuItems }}>
          <SenderSwitch value={false} icon={<ProfileOutlined />}>
            {opts.filesLabel}
          </SenderSwitch>
        </Dropdown>
      ) : null}
    </Flex>
    <Flex align="center">
      <Button type="text" style={IconStyle} icon={<ApiOutlined />} />
      <Divider type="vertical" />
      {actionNode}
    </Flex>
  </Flex>
);

defineRender(() => (
  <Flex vertical gap="middle">
    <Sender
      loading={loading.value}
      ref={senderRef}
      skill={slotConfigState.value.skill}
      placeholder="Press Enter to send message"
      footer={(actionNode, _info) => footerCommon(actionNode as VNode, {
        agentMenuItems: agentItems,
        fileMenuItems: fileItems,
        onFileClick: (item) => fileItemClick(item),
        thinkOn: (
          <span style={ThinkLabelStyle}>
            Deep Think:<span style={SwitchTextStyle}>on</span>
          </span>
        ),
        thinkOff: (
          <span style={ThinkLabelStyle}>
            Deep Think:<span style={SwitchTextStyle}>off</span>
          </span>
        ),
        agentLabel: 'Agent',
        filesLabel: 'Files',
      })}
      suffix={false}
      onSubmit={(v, _slot, skill) => {
        loading.value = true;
        message.info(`Send message: ${skill?.value} | ${v}`);
        senderRef.value?.clear?.();
      }}
      onCancel={() => {
        loading.value = false;
        message.error('Cancel sending!');
      }}
      slotConfig={slotConfigState.value.slotConfig}
      autoSize={{ minRows: 3, maxRows: 6 }}
    />
    <Sender
      loading={loading.value}
      ref={senderZhRef}
      skill={slotConfigState.value.zh_skill}
      placeholder=""
      footer={(actionNode, _info) => footerCommon(actionNode as VNode, {
        agentMenuItems: zhAgentItems,
        fileMenuItems: zhFileItems,
        onFileClick: (item) => fileItemClick(item, 'zh'),
        thinkOn: (
          <span style={ThinkLabelStyle}>
            深度搜索：<span style={SwitchTextStyle}>开启</span>
          </span>
        ),
        thinkOff: (
          <span style={ThinkLabelStyle}>
            深度搜索：<span style={SwitchTextStyle}>关闭</span>
          </span>
        ),
        agentLabel: '功能应用',
        filesLabel: '文件引用',
      })}
      suffix={false}
      onSubmit={(v, _slot, skill) => {
        loading.value = true;
        message.info(`Send message: ${skill?.value} | ${v}`);
        senderZhRef.value?.clear?.();
      }}
      onCancel={() => {
        loading.value = false;
        message.error('Cancel sending!');
      }}
      slotConfig={slotConfigState.value.zh_slotConfig}
      autoSize={{ minRows: 3, maxRows: 6 }}
    />
  </Flex>
));
</script>
