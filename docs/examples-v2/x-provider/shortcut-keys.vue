<script setup lang="tsx">
import {
  CodeOutlined,
  FileImageOutlined,
  FileSearchOutlined,
  EditOutlined,
} from '@ant-design/icons-vue';
import { Card, Flex, Tag, Typography } from 'ant-design-vue';
import { Conversations, XProvider } from 'ant-design-x-vue';

defineOptions({ name: 'AXProviderShortcutKeys' });

defineRender(() => (
  <>
    <Flex gap={12} style={{ marginBottom: '16px' }} align="center">
      <Typography.Text>
        You can switch sessions using the shortcut key: <Tag>Alt/⌥</Tag> + <Tag>number</Tag>
      </Typography.Text>
    </Flex>
    <Card>
      <XProvider
        conversations={{
          shortcutKeys: {
            items: ['Alt', 'number'],
          },
        }}
      >
        <Conversations
          style={{ width: '200px' }}
          defaultActiveKey="write"
          items={[
            { key: 'write', label: 'Help Me Write', icon: <EditOutlined /> },
            { key: 'coding', label: 'AI Coding', icon: <CodeOutlined /> },
            { key: 'createImage', label: 'Create Image', icon: <FileImageOutlined /> },
            { key: 'deepSearch', label: 'Deep Search', icon: <FileSearchOutlined /> },
          ]}
        />
      </XProvider>
    </Card>
  </>
));
</script>
