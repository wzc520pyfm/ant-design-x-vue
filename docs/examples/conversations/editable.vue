<script setup lang="tsx">
import { EditOutlined } from '@ant-design/icons-vue';
import { Button, Flex, Input, theme } from 'ant-design-vue';
import { Conversations } from 'ant-design-x-vue';
import type { ConversationsProps } from 'ant-design-x-vue';
import { computed, ref } from 'vue';

defineOptions({ name: 'AXConversationsEditable' });

const EditableItem = (props: { index: number }) => {
  const editing = ref(false);
  const label = ref(`Conversation Item ${props.index + 1}`)

  return (
    <Flex justify="space-between" align="center" style={{ width: '100%' }}>
      {
        editing.value
        ? <Input
            v-model:value={label.value}
            onBlur={() => editing.value = false}
            onPressEnter={() => editing.value = false}
          />
        : <>
            <span>{label.value}</span>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => editing.value = true}
            />
          </>
      }
    </Flex>
  )
}

const items: ConversationsProps['items'] = Array.from({ length: 4 }).map((_, index) => ({
  key: `item${index + 1}`,
  label: <EditableItem index={index} />,
  disabled: index === 3,
}));

const { token } = theme.useToken();

// Customize the style of the container
const style = computed(() => ({
  width: '256px',
  background: token.value.colorBgContainer,
  borderRadius: token.value.borderRadius,
}));

defineRender(() => {
  return (
    <Conversations items={items} defaultActiveKey="item1" style={style.value} />
  )
})
</script>
