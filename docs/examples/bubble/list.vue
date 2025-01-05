<script setup lang="tsx">
import { UserOutlined } from '@ant-design/icons-vue';
import { BubbleList } from 'ant-design-x-vue';
import { Button, Flex } from 'ant-design-vue';
import type { BubbleListProps } from 'ant-design-x-vue';
import { ref } from 'vue';

defineOptions({ name: 'BubbleList' });

const roles: BubbleListProps['roles'] = {
  ai: {
    placement: 'start',
    avatar: { icon: <UserOutlined />, style: { background: '#fde3cf' } },
    typing: { step: 5, interval: 20 },
    style: {
      maxWidth: '600px',
    },
  },
  user: {
    placement: 'end',
    avatar: { icon: <UserOutlined />, style: { background: '#87d068' } },
  },
};

const count = ref<number>(3);

// const listRef = useTemplateRef<InstanceType<typeof BubbleList>>(null);
const listRef = ref<InstanceType<typeof BubbleList>>(null);

defineRender(() => {
  return (
    <Flex vertical gap="small">
      <Flex gap="small" style={{ alignSelf: 'flex-end' }}>
        <Button
          onClick={() => {
            count.value = count.value + 1;
          }}
        >
          Add Bubble
        </Button>

        <Button
          onClick={() => {
            listRef.value?.scrollTo({ key: 0, block: 'nearest' });
          }}
        >
          Scroll To First
        </Button>
      </Flex>

      <BubbleList
        ref={listRef}
        style={{ maxHeight: '300px' }}
        roles={roles}
        items={Array.from({ length: count.value }).map((_, i) => {
          const isAI = !!(i % 2);
          const content = isAI ? 'Mock AI content. '.repeat(20) : 'Mock user content.';

          return {
            key: i,
            role: isAI ? 'ai' : 'user',
            content,
          };
        })}
      />
    </Flex>
  )
});
</script>
