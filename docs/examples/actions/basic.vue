<script setup lang="tsx">
import { CopyOutlined, RedoOutlined } from '@ant-design/icons-vue';
import { App } from 'ant-design-vue';
import { Actions, type ActionsProps } from 'ant-design-x-vue';

defineOptions({ name: 'AXActionsBasic' });

const actionItems: ActionsProps['items'] = [
  {
    key: 'retry',
    icon: <RedoOutlined />,
    label: 'Retry',
  },
  {
    key: 'copy',
    icon: <CopyOutlined />,
    label: 'Copy',
  },
];

const Demo = () => {
  const { message } = App.useApp();

  const onClick: ActionsProps['onClick'] = ({ keyPath }) => {
    // Logic for handling click events
    message.success(`you clicked ${keyPath?.join(',')}`);
  };

  return <Actions items={actionItems} onClick={onClick} />;
};

defineRender(() => {
  return (
    <App>
      <Demo />
    </App>
  );
});
</script>

