<script setup lang="tsx">
import { DeleteOutlined, EditOutlined, PlusSquareOutlined, StopOutlined } from '@ant-design/icons-vue';
import { Conversations, theme, type ConversationsProps } from 'ant-design-x-vue';

defineOptions({ name: 'AXConversationsMenuTrigger' });

const items: ConversationsProps['items'] = Array.from({ length: 4 }).map((_, index) => ({
  key: `item${index + 1}`,
  label: `Conversation Item ${index + 1}`,
  disabled: index === 3,
}));

const { token } = theme.useToken();

const style = {
  width: '256px',
  background: token.value.colorBgContainer,
  borderRadius: token.value.borderRadius,
};

const menuConfig: ConversationsProps['menu'] = (conversation) => ({
  trigger: (menuInfo) => (
    <PlusSquareOutlined
      onClick= {() => {
        console.log(`Click ${conversation.key} - ${menuInfo.key}`);
      }}
    />
  ),
  items: [
    {
      label: 'Operation 1',
      key: 'operation1',
      icon: <EditOutlined />,
    },
    {
      label: 'Operation 2',
      key: 'operation2',
      icon: <StopOutlined />,
      disabled: true,
    },
    {
      label: 'Operation 3',
      key: 'operation3',
      icon: <DeleteOutlined />,
      danger: true,
    },
  ],
  onClick: (menuInfo) => {
    menuInfo.domEvent.stopPropagation();
    console.log(`Click ${conversation.key} - ${menuInfo.key}`);
  },
});

defineRender(() => {
  return (
    <Conversations defaultActiveKey="item1" menu={menuConfig} items={items} style={style} />
  );
});
</script>
