<script setup lang="tsx">
import { FrownOutlined, SmileOutlined, SyncOutlined, UserOutlined } from '@ant-design/icons-vue';
import { BubbleList } from 'ant-design-x-vue';
import { Button, Flex, Space, Spin } from 'ant-design-vue';
import type { BubbleListProps } from 'ant-design-x-vue';
import { ref } from 'vue';

defineOptions({ name: 'BubbleCustom' });

const roles: BubbleListProps['roles'] = {
  ai: {
    placement: 'start',
    avatar: { icon: <UserOutlined />, style: { background: '#fde3cf' } },
    typing: { step: 5, interval: 20 },
    style: {
      maxWidth: '600px',
      marginInlineEnd: '44px',
    },
    styles: {
      footer: {
        width: '100%',
      },
    },
    loadingRender: () => (
      <Space>
        <Spin size="small" />
        Custom loading...
      </Space>
    ),
  },
  user: {
    placement: 'end',
    avatar: { icon: <UserOutlined />, style: { background: '#87d068' } },
  },
};

// const listRef = useTemplateRef<InstanceType<typeof BubbleList>>(null);
const listRef = ref<InstanceType<typeof BubbleList>>(null);

defineRender(() => {
  return (
    <BubbleList
      ref={listRef}
      style={{ maxHeight: '300px' }}
      roles={roles}
      items={[
        {
          key: 'welcome',
          role: 'ai',
          content: 'Mock welcome content. '.repeat(10),
          footer: (
            <Flex>
              <Button
                size="small"
                type="text"
                icon={<SyncOutlined />}
                style={{ marginInlineEnd: 'auto' }}
              />
              <Button size="small" type="text" icon={<SmileOutlined />} />
              <Button size="small" type="text" icon={<FrownOutlined />} />
            </Flex>
          ),
        },
        {
          key: 'ask',
          role: 'user',
          content: 'Mock user content.',
        },
        {
          key: 'ai',
          role: 'ai',
          loading: true,
        },
      ]}
    />
  )
});
</script>
