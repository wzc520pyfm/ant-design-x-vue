<script setup lang="tsx">
defineOptions({ name: 'AXBubbleSemanticListCustomV2' });

import { ref } from 'vue';
import { FrownOutlined, SmileOutlined, SyncOutlined } from '@ant-design/icons-vue';
import { Bubble, type RoleType } from 'ant-design-x-vue';
import { Button, Flex, Spin } from 'ant-design-vue';

const listRef = ref<InstanceType<typeof Bubble.List> | null>(null);

const roles: RoleType = {
  ai: {
    placement: 'start',
    typing: { effect: 'typing', step: 5, interval: 20 },
    loadingRender: () => (
      <Flex align="center" gap="small">
        <Spin size="small" />
        Custom loading...
      </Flex>
    ),
  },
  user: {
    placement: 'end',
  },
};

defineRender(() => (
  <Bubble.List
    ref={listRef}
    style={{ height: '500px' }}
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
        content: '',
      },
    ]}
  />
));
</script>
