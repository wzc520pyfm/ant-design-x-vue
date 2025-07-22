<script setup lang="tsx">
import { CoffeeOutlined, FireOutlined, SmileOutlined, UserOutlined } from '@ant-design/icons-vue';
import { Attachments, BubbleList, Prompts } from 'ant-design-x-vue';
import { Button, Flex, Image, Typography } from 'ant-design-vue';
import type { BubbleListProps } from 'ant-design-x-vue';
import { ref } from 'vue';

defineOptions({ name: 'BubbleListCustom' });

const items = ref<BubbleListProps['items']>([
  // Normal
  {
    key: 0,
    role: 'ai',
    content: 'Normal message',
  },
  // Custom content
  {
    key: 1,
    role: 'ai',
    content: {
      imageUrl: 'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original',
      text: 'Ant Design X Vue',
      actionNode: <>Click Me</>,
    },
    messageRender: (content) => {
      return (
        <Flex gap="middle" align="center">
          <Image height={50} src={content?.imageUrl} />
          <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{content?.text}</span>
        </Flex>
      );
    },
  },
  // VNode
  {
    key: 2,
    role: 'ai',
    id: 'message_id_2',
    content: <Typography.Text type="danger">VNode message</Typography.Text>,
  },
  // Role: suggestion
  {
    key: 3,
    role: 'suggestion',
    content: [
      {
        key: '6',
        icon: <CoffeeOutlined style={{ color: '#964B00' }} />,
        description: 'How to rest effectively after long hours of work?',
      },
      {
        key: '7',
        icon: <SmileOutlined style={{ color: '#FAAD14' }} />,
        description: 'What are the secrets to maintaining a positive mindset?',
      },
      {
        key: '8',
        icon: <FireOutlined style={{ color: '#FF4D4F' }} />,
        description: 'How to stay calm under immense pressure?',
      },
    ],
  },
  // Role: file
  {
    key: 4,
    role: 'file',
    content: [
      {
        uid: '1',
        name: 'excel-file.xlsx',
        size: 111111,
        description: 'Checking the data',
      },
      {
        uid: '2',
        name: 'word-file.docx',
        size: 222222,
        status: 'uploading',
        percent: 23,
      },
    ],
  },
]);

const roles: BubbleListProps['roles'] = {
  ai: {
    placement: 'start',
    typing: true,
    avatar: { icon: <UserOutlined />, style: { background: '#fde3cf' } },
    footer: (content, { key }) => {
      if (content?.actionNode) {
        return (
          <Button
            onClick={() => {
              items.value = (items.value as any[]).map((item) => {
                if (item.key === key) {
                  return {
                    ...item,
                    content: {
                      ...item?.content,
                      actionNode: <>🎉 Happy Ant Design X !</>,
                    },
                  };
                }
                return item;
              });
            }}
            type="text"
          >
            {content?.actionNode}
          </Button>
        );
      }
      return null;
    },
  },
  suggestion: {
    placement: 'start',
    avatar: { icon: <UserOutlined />, style: { visibility: 'hidden' } },
    variant: 'borderless',
    messageRender: (items) => <Prompts vertical items={items as any} />,
  },
  file: {
    placement: 'start',
    avatar: { icon: <UserOutlined />, style: { visibility: 'hidden' } },
    variant: 'borderless',
    messageRender: (items) => (
      <Flex vertical gap="middle">
        {(items as any[]).map((item) => (
          <Attachments.FileCard key={item.uid} item={item} />
        ))}
      </Flex>
    ),
  },
};

defineRender(() => {
  return (
    <BubbleList
      roles={roles}
      items={items.value}
    />
  )
});
</script>
