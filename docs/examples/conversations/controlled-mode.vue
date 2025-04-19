<script setup lang="tsx">
import { Button, Flex, theme } from 'ant-design-vue';
import { Conversations, type ConversationsProps } from 'ant-design-x-vue';
import { computed, ref } from 'vue';

defineOptions({ name: 'AXConversationsControlledMode' });

const items: ConversationsProps['items'] = Array.from({ length: 3 }).map((_, index) => ({
  key: `item${index + 1}`,
  label: `Conversation Item ${index + 1}`,
}));

const activeKey = ref('item1');
const updateActiveKey = (v: string) => activeKey.value = v;
const { token } = theme.useToken();

// Customize the style of the container
const style = computed(() => ({
  width: '256px',
  background: token.value.colorBgContainer,
  borderRadius: token.value.borderRadius,
}));

defineRender(() => {
  return (
    <Flex vertical gap="small" align="flex-start">
      <Conversations
        activeKey={activeKey.value}
        onActiveChange={(v) => updateActiveKey(v)}
        items={items}
        style={style.value}
      />

      <Flex gap="small">
        <Button
          onClick={() => {
            updateActiveKey('item1');
          }}
        >
          Active First
        </Button>
        <Button
          onClick={() => {
            updateActiveKey('item3');
          }}
        >
          Active Last
        </Button>
      </Flex>
    </Flex>
  )
});
</script>
