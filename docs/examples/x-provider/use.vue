<script setup lang="tsx">
import { AlipayCircleOutlined, BulbOutlined, CheckCircleOutlined, GithubOutlined, LoadingOutlined, SmileOutlined, UserOutlined } from '@ant-design/icons-vue';
import { Card, Divider, Flex, Radio, Typography } from 'ant-design-vue';
import { Bubble, Conversations, Prompts, Sender, Suggestion, ThoughtChain, XProvider, type XProviderProps } from 'ant-design-x-vue';
import { ref } from 'vue';

defineOptions({ name: 'AXProviderUse' });

const value = ref('');
const direction = ref<XProviderProps['direction']>('ltr');

defineRender(() => {
  return (
    <div>
      <Flex gap={12} style={{ marginBottom: '16px' }} align="center">
        <Typography.Text>Direction:</Typography.Text>
        <Radio.Group value={direction.value} onChange={(e) => direction.value = e.target.value}>
          <Radio.Button value="ltr">LTR</Radio.Button>
          <Radio.Button value="rtl">RTL</Radio.Button>
        </Radio.Group>
      </Flex>
      <Card>
        <XProvider direction={direction.value}>
          <Flex style={{ height: '500px' }} gap={12}>
            <Conversations
              style={{ width: '200px' }}
              defaultActiveKey="1"
              items={[
                {
                  key: '1',
                  label: 'Conversation - 1',
                  icon: <GithubOutlined />,
                },
                {
                  key: '2',
                  label: 'Conversation - 2',
                  icon: <AlipayCircleOutlined />,
                },
              ]}
            />
            <Divider type="vertical" style={{ height: '100%' }} />
            <Flex vertical style={{ flex: 1 }} gap={8}>
              <Bubble.List
                style={{ flex: 1 }}
                items={[
                  {
                    key: '1',
                    placement: 'end',
                    content: 'Hello Ant Design X!',
                    avatar: { icon: <UserOutlined /> },
                  },
                  {
                    key: '2',
                    content: 'Hello World!',
                  },
                  {
                    key: '3',
                    content: '',
                    loading: true,
                  },
                ]}
              />
              <Prompts
                items={[
                  {
                    key: '1',
                    icon: <BulbOutlined style={{ color: '#FFD700' }} />,
                    label: 'Ignite Your Creativity',
                  },
                  {
                    key: '2',
                    icon: <SmileOutlined style={{ color: '#52C41A' }} />,
                    label: 'Tell me a Joke',
                  },
                ]}
              />
              <Suggestion
                items={[{ label: 'Write a report', value: 'report' }]}
                children={({ onTrigger, onKeyDown }) => {
                  return (
                    <Sender
                      value={value.value}
                      onChange={(nextVal) => {
                        if (nextVal === '/') {
                          onTrigger();
                        } else if (!nextVal) {
                          onTrigger(false);
                        }
                        value.value = nextVal;
                      }}
                      onKeyDown={onKeyDown}
                      placeholder='Type "/" to trigger suggestion'
                    />
                  );
                }}
              />
            </Flex>
            <Divider type="vertical" style={{ height: '100%' }} />
            <ThoughtChain
              style={{ width: '200px' }}
              items={[
                {
                  title: 'Hello Ant Design X!',
                  status: 'success',
                  description: 'status: success',
                  icon: <CheckCircleOutlined />,
                  content: 'Ant Design X help you build AI chat/platform app as ready-to-use 📦.',
                },
                {
                  title: 'Hello World!',
                  status: 'success',
                  description: 'status: success',
                  icon: <CheckCircleOutlined />,
                },
                {
                  title: 'Pending...',
                  status: 'pending',
                  description: 'status: pending',
                  icon: <LoadingOutlined />,
                },
              ]}
            />
          </Flex>
        </XProvider>
      </Card>
    </div>
  )
})
</script>
