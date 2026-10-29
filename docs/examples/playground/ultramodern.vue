<script setup lang="tsx">
defineOptions({ name: 'AXPlaygroundUltramodern' });

import { BulbOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import { Actions, Bubble, Conversations, Sender, XProvider } from 'ant-design-x-vue';
import { Flex, message } from 'ant-design-vue';
import { XMarkdown } from '@ant-design-x-vue/x-markdown';
import '@ant-design-x-vue/x-markdown/themes/light.css';
import '@ant-design-x-vue/x-markdown/themes/dark.css';
import { ref } from 'vue';
import { useMockChat } from '../../examples-v2/_shared/use-mock-chat';
import { usePlaygroundShell } from '../../examples-v2/_shared/playground-shell';

const shell = usePlaygroundShell('640px', '0');
const deepThink = ref(true);
const chat = useMockChat((question) => [
  `**${question}**`,
  '',
  '这是 React 2.0 ultramodern 样板间的 Vue 布局：会话栏、气泡和 Sender。',
  '文档站没有模型密钥，回复由本地 mock 生成，不会请求 DeepSeek。',
].join('\n'));

chat.setConversations([
  { key: '1', label: '什么是 Ant Design X？' },
  { key: '2', label: '如何快速安装和导入组件？' },
  { key: '3', label: '新的 AGI 混合界面' },
]);

const logo = 'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original';

defineRender(() => {
  const bubbles = chat.bubbles.value;
  return (
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
                if (!bubbles.length) {
                  message.warning('当前已经是新会话');
                  return;
                }
                chat.addChat();
              },
            }}
            items={chat.conversations.value.map((item) => ({
              ...item,
              group: '今天',
            }))}
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
        </Flex>
        <Flex vertical justify="space-between" style={{ ...shell.mainStyle.value, padding: '24px', minHeight: 0 }}>
          <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {bubbles.length === 0 ? (
              <div style={{ fontSize: '32px', fontWeight: 600 }}>Ant Design X 助手</div>
            ) : (
              <Bubble.List
                style={{ width: '100%', height: '100%' }}
                items={bubbles}
                roles={{
                  user: { placement: 'end' },
                  ai: {
                    placement: 'start',
                    footer: (content: string) => (
                      <Actions items={[{ key: 'copy', actionRender: <Actions.Copy text={String(content)} /> }]} />
                    ),
                    contentRender: (content: string) => (
                      <XMarkdown className={shell.markdownClass.value} content={content} />
                    ),
                  },
                }}
              />
            )}
          </div>
          <Sender
            style={{ maxWidth: '840px', width: '100%', margin: '0 auto' }}
            suffix={false}
            value={chat.input.value}
            loading={chat.isRequesting.value}
            placeholder="点击 Enter 发送消息"
            autoSize={{ minRows: 3, maxRows: 6 }}
            onUpdate:value={(value: string) => { chat.input.value = value; }}
            onSubmit={() => chat.send()}
            onCancel={() => chat.abort()}
            footer={(actionNode, _info) => (
              <Flex justify="space-between" align="center">
                <Sender.Switch
                  value={deepThink.value}
                  icon={<BulbOutlined />}
                  onChange={(checked: boolean) => { deepThink.value = checked; }}
                >
                  深度思考
                </Sender.Switch>
                {actionNode}
              </Flex>
            )}
          />
        </Flex>
      </Flex>
    </XProvider>
  );
});
</script>
