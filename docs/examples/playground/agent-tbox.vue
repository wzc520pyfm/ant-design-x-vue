<script setup lang="tsx">
defineOptions({ name: 'AXPlaygroundAgentTbox' });

import {
  AppstoreOutlined,
  DeleteOutlined,
  EllipsisOutlined,
  FileSearchOutlined,
  HeartOutlined,
  QuestionCircleOutlined,
  ScheduleOutlined,
  ShareAltOutlined,
  SmileOutlined,
} from '@ant-design/icons-vue';
import {
  Bubble,
  Conversations,
  Prompts,
  Sender,
  Think,
  ThoughtChain,
  Welcome,
  XProvider,
} from 'ant-design-x-vue';
import { Avatar, Button, Flex, Space, message } from 'ant-design-vue';
import { XMarkdown } from '@ant-design-x-vue/x-markdown';
import '@ant-design-x-vue/x-markdown/themes/light.css';
import '@ant-design-x-vue/x-markdown/themes/dark.css';
import { computed } from 'vue';
import { useMockChat } from '../../examples-v2/_shared/use-mock-chat';
import { usePlaygroundShell } from '../../examples-v2/_shared/playground-shell';

const shell = usePlaygroundShell('720px', '16px');
const chat = useMockChat((question) => [
  `关于 **${question}**：`,
  '',
  '这里对齐 React 2.0 百宝箱样板间的版面：Welcome、提示词、思考和思维链。',
  '`tbox-nodejs-sdk` 只能在 Node 里跑，文档页用本地回复代替真实百宝箱会话。',
].join('\n'));

chat.setConversations([
  { key: '1', label: '什么是百宝箱 Tbox.cn?' },
  { key: '2', label: '百宝箱可以做什么?' },
]);

const logo = 'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original';
const welcomeIcon = 'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp';

const hotTopics = {
  key: '1',
  label: '最热话题',
  children: [
    { key: '1-1', description: '什么是百宝箱 Tbox.cn?', icon: <span style={{ color: '#f93a4a', fontWeight: 700 }}>1</span> },
    { key: '1-2', description: '百宝箱可以做什么?', icon: <span style={{ color: '#ff6565', fontWeight: 700 }}>2</span> },
  ],
};
const designGuide = {
  key: '2',
  label: '设计指南',
  children: [
    { key: '2-1', icon: <HeartOutlined />, label: '意图', description: 'AI 理解用户需求并提供解决方案' },
    { key: '2-2', icon: <SmileOutlined />, label: '角色', description: 'AI 的公众形象' },
  ],
};
const senderPrompts = [
  { key: '1', description: '动态', icon: <ScheduleOutlined /> },
  { key: '2', description: '组件', icon: <AppstoreOutlined /> },
  { key: '3', description: '指南', icon: <FileSearchOutlined /> },
  { key: '4', description: '教程', icon: <AppstoreOutlined /> },
];

const chain = computed(() => [
  { key: 'running', title: chat.isRequesting.value ? '正在调用模型' : '大模型执行完成', status: (chat.isRequesting.value ? 'loading' : 'success') as 'loading' | 'success' },
]);

const cardStyle = {
  flex: '1 1 0',
  minWidth: 0,
  backgroundImage: 'linear-gradient(123deg, #e5f4ff 0%, #efe7ff 100%)',
  borderRadius: '12px',
  border: 'none',
};

defineRender(() => (
  <XProvider>
    <Flex style={shell.shellStyle.value}>
      <Flex vertical style={{ ...shell.sideStyle.value, width: '280px', padding: '0 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '24px 0', padding: '0 12px' }}>
          <img src={logo} width={24} height={24} alt="logo" draggable={false} />
          <span style={{ fontWeight: 700, fontSize: '16px' }}>Ant Design X</span>
        </div>
        <Conversations
          style={{ flex: 1 }}
          creation={{
            onClick: () => {
              if (!chat.bubbles.value.length) {
                message.warning('当前已经是新会话');
                return;
              }
              chat.addChat();
            },
          }}
          items={chat.conversations.value.map((item) => ({ ...item, group: '今天' }))}
          activeKey={chat.activeConversationKey.value}
          onActiveChange={(key: string) => chat.setActiveConversationKey(key)}
          groupable
          menu={(conversation) => ({
            items: [
              {
                key: 'delete',
                label: '删除',
                icon: <DeleteOutlined />,
                danger: true,
                onClick: () => {
                  const next = chat.conversations.value.filter((item) => item.key !== conversation.key);
                  chat.setConversations(next);
                  if (conversation.key === chat.activeConversationKey.value) {
                    chat.setActiveConversationKey(next[0]?.key || '');
                  }
                },
              },
            ],
          })}
        />
        <div style={{ height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Avatar size={24} />
          <Button type="text" icon={<QuestionCircleOutlined />} />
        </div>
      </Flex>
      <Flex vertical gap={12} style={{ ...shell.mainStyle.value, overflow: 'auto' }}>
        {chat.bubbles.value.length === 0 ? (
          <Flex vertical gap={16} align="center" style={{ width: '100%' }}>
            <Welcome
              variant="borderless"
              icon={welcomeIcon}
              title="你好， 我是 Ant Design X & 百宝箱智能体"
              description="基于 Ant Design 的 AGI 产品界面解决方案，打造更卓越的智能视觉体验。百宝箱 Node SDK 未打进文档页，这里保留同样的欢迎与提示布局。"
              extra={(
                <Space>
                  <Button icon={<ShareAltOutlined />} />
                  <Button icon={<EllipsisOutlined />} />
                </Space>
              )}
            />
            <Flex gap={16} style={{ width: '100%' }}>
              <Prompts
                class="ax-tbox-prompts"
                items={[hotTopics]}
                styles={{ item: cardStyle, subItem: { padding: 0, background: 'transparent', maxWidth: '100%' } }}
                onItemClick={(info: { data: { description?: string } }) => chat.send(String(info.data.description || ''))}
              />
              <Prompts
                class="ax-tbox-prompts"
                items={[designGuide]}
                styles={{ item: cardStyle, subItem: { background: 'rgba(255,255,255,0.65)', maxWidth: '100%' } }}
                onItemClick={(info: { data: { description?: string } }) => chat.send(String(info.data.description || ''))}
              />
            </Flex>
          </Flex>
        ) : (
          <>
            <Think title={chat.isRequesting.value ? '深度思考中' : '深度思考完成'} loading={chat.isRequesting.value}>
              真实百宝箱流式推理不在浏览器里。这一块标出思考面板的位置。
            </Think>
            <ThoughtChain items={chain.value} />
            <Bubble.List
              style={{ minHeight: '220px' }}
              items={chat.bubbles.value}
              roles={{
                user: { placement: 'end' },
                ai: {
                  placement: 'start',
                  contentRender: (content: string) => (
                    <XMarkdown className={shell.markdownClass.value} content={content} />
                  ),
                },
              }}
            />
          </>
        )}
        <Prompts
          items={senderPrompts}
          onItemClick={(info: { data: { description?: string } }) => chat.send(String(info.data.description || ''))}
          styles={{ item: { padding: '6px 12px' } }}
        />
        <Sender
          value={chat.input.value}
          loading={chat.isRequesting.value}
          placeholder="向我提问吧"
          onUpdate:value={(value: string) => { chat.input.value = value; }}
          onSubmit={() => chat.send()}
          onCancel={() => chat.abort()}
        />
      </Flex>
    </Flex>
  </XProvider>
));
</script>

<style>
.ax-tbox-prompts .ant-prompts-label {
  color: rgba(0, 0, 0, 0.88) !important;
}
.ax-tbox-prompts .ant-prompts-desc,
.ax-tbox-prompts .ant-prompts-icon {
  color: rgba(0, 0, 0, 0.65) !important;
}
</style>
