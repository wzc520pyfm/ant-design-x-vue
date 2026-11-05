<script setup lang="tsx">
import { RedoOutlined } from '@ant-design/icons-vue';
import { App, Flex, Pagination } from 'ant-design-vue';
import { Actions, type ActionsProps } from 'ant-design-x-vue';
import { ref } from 'vue';

defineOptions({ name: 'AXActionsVariant' });

const Demo = () => {
  const { message } = App.useApp();
  const curPage = ref(1);

  const actionItems: ActionsProps['items'] = [
    {
      key: 'pagination',
      actionRender: () => (
        <Pagination
          simple
          current={curPage.value}
          onChange={(page: number) => { curPage.value = page; }}
          total={5}
          pageSize={1}
        />
      ),
    },
    {
      key: 'retry',
      icon: <RedoOutlined />,
      label: 'Retry',
    },
    {
      key: 'copy',
      label: 'copy',
      actionRender: () => <Actions.Copy text="copy value" />,
    },
  ];

  const onClick: ActionsProps['onClick'] = ({ keyPath }) => {
    message.success(`you clicked ${keyPath.join(',')}`);
  };

  return (
    <Flex gap="middle" vertical align="flex-start">
      <Actions items={actionItems} onClick={onClick} variant="outlined" />
      <Actions items={actionItems} onClick={onClick} variant="filled" />
      <Actions items={actionItems} onClick={onClick} variant="borderless" />
    </Flex>
  );
};

defineRender(() => {
  return (
    <App>
      <Demo />
    </App>
  );
});
</script>
