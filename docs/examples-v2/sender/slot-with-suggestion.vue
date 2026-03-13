<script setup lang="tsx">
defineOptions({ name: 'AXSenderSlotWithSuggestionV2' });

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
import { Attachments, Sender, Suggestion, type SenderProps, type AttachmentsProps } from 'ant-design-x-vue';
import { Button, Divider, Dropdown, Flex, message } from 'ant-design-vue';
import type { MenuProps } from 'ant-design-vue';

const SenderSwitch = Sender.Switch;

const AgentInfo: Record<string, {
  icon: VNode;
  label: string;
  slotConfig: SenderProps['slotConfig'];
}> = {
  deep_search: {
    icon: <SearchOutlined />,
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
    icon: <CodeOutlined />,
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
    icon: <EditOutlined />,
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

const IconStyle = { fontSize: '16px' };
const SwitchTextStyle = {
  display: 'inline-flex',
  width: '28px',
  justifyContent: 'center',
  alignItems: 'center',
};

const FileInfo: Record<string, { icon: VNode; label: string }> = {
  file_image: {
    icon: <FileImageOutlined />,
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
        label: (
          <Flex gap="small">
            {icon}
            {label}
          </Flex>
        ),
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

const senderHeader = () => (
  <Sender.Header
    title="Attachments"
    styles={{ content: { padding: 0 } }}
    open={open.value}
    onOpenChange={(val: boolean) => { open.value = val; }}
    forceRender
  >
    <Attachments
      ref={attachmentsRef}
      beforeUpload={() => false}
      items={fileList.value}
      onChange={({ fileList: fl }: any) => { fileList.value = fl; }}
      getDropContainer={() => senderRef.value?.nativeElement}
    />
  </Sender.Header>
);

const suggestions = [
  { label: 'Write a report', value: 'report' },
  { label: 'Draw a picture', value: 'draw' },
  {
    label: 'Check some knowledge',
    value: 'knowledge',
    icon: <RobotOutlined />,
    children: [
      { label: 'About React', value: 'react' },
      { label: 'About Ant Design', value: 'antd' },
    ],
  },
];

defineRender(() => (
  <Flex vertical gap="middle">
    <Suggestion
      items={suggestions}
      onSelect={() => {
        senderRef.value?.insert?.(
          [{
            type: 'input',
            key: `partner_2_${Date.now()}`,
            props: { placeholder: 'Enter a name' },
          }],
          'cursor',
          '@',
        );
      }}
    >
      {{
        default: ({ onTrigger }: any) => (
          <Sender
            loading={loading.value}
            ref={senderRef}
            placeholder="Press Enter to send message"
            header={senderHeader()}
            footer={(actionNode, _info) => (
              <Flex justify="space-between" align="center">
                <Flex gap="small" align="center">
                  <Button style={IconStyle} type="text" icon={<PaperClipOutlined />} />
                  <SenderSwitch
                    value={deepThink.value}
                    checkedChildren={
                      <div>
                        Deep Think:<span style={SwitchTextStyle}>on</span>
                      </div>
                    }
                    unCheckedChildren={
                      <div>
                        Deep Think:<span style={SwitchTextStyle}>off</span>
                      </div>
                    }
                    onChange={(checked: boolean) => { deepThink.value = checked; }}
                    icon={<RobotOutlined />}
                  />
                  <Dropdown
                    menu={{
                      selectedKeys: [activeAgentKey.value],
                      onClick: agentItemClick,
                      items: agentItems,
                    }}
                  >
                    <SenderSwitch value={false} icon={<AntDesignOutlined />}>
                      Agent
                    </SenderSwitch>
                  </Dropdown>
                  {fileItems?.length ? (
                    <Dropdown menu={{ onClick: fileItemClick, items: fileItems }}>
                      <SenderSwitch value={false} icon={<ProfileOutlined />}>
                        Files
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
            )}
            onKeyDown={(e) => {
              if (e.key === '@') {
                onTrigger();
              } else {
                onTrigger(false);
              }
            }}
            suffix={false}
            onSubmit={(v) => {
              loading.value = true;
              message.info(`Send message: ${v}`);
              senderRef.value?.clear?.();
            }}
            onCancel={() => {
              loading.value = false;
              message.error('Cancel sending!');
            }}
            slotConfig={AgentInfo[activeAgentKey.value].slotConfig}
            autoSize={{ minRows: 3, maxRows: 6 }}
          />
        ),
      }}
    </Suggestion>
  </Flex>
));
</script>
