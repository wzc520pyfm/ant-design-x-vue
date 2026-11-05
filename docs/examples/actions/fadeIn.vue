<script setup lang="tsx">
import { ref } from 'vue';
import { RedoOutlined } from '@ant-design/icons-vue';
import { App, Button, Flex, Pagination, Switch } from 'ant-design-vue';
import { Actions, type ActionsProps } from 'ant-design-x-vue';

defineOptions({ name: 'AXActionsFadeIn' });

const Demo = () => {
  const { message } = App.useApp();
  const curPage = ref(1);
  const key = ref(0);
  const fadeInLeft = ref(true);

  const actionItems: ActionsProps['items'] = [
    {
      key: 'pagination',
      actionRender: () => (
        <Pagination
          simple
          current={curPage.value}
          onChange={(page: number) => (curPage.value = page)}
          total={5}
          pageSize={1}
        />
      ),
    },
    { key: 'retry', icon: <RedoOutlined />, label: 'Retry' },
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
      <Flex gap="middle" align="center">
        <Switch
          checkedChildren="fadeInLeft"
          unCheckedChildren="fadeIn"
          checked={fadeInLeft.value}
          onChange={(val: any) => (fadeInLeft.value = !!val)}
        />
        <Button onClick={() => (key.value += 1)}>Re-Render</Button>
      </Flex>
      <Actions
        key={key.value}
        fadeIn={!fadeInLeft.value}
        fadeInLeft={fadeInLeft.value}
        items={actionItems}
        onClick={onClick}
        variant="borderless"
      />
    </Flex>
  );
};

defineRender(() => (
  <App>
    <Demo />
  </App>
));
</script>
