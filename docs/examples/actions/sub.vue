<script setup lang="tsx">
import { CopyOutlined, DeleteOutlined, RedoOutlined, ShareAltOutlined } from '@ant-design/icons-vue';
import { App, Modal } from 'ant-design-vue';
import { Actions, type ActionsProps } from 'ant-design-x-vue';

defineOptions({ name: 'AXActionsSub' });

const Demo = () => {
  const { message } = App.useApp();

  const actionItems: ActionsProps['items'] = [
    {
      key: 'retry',
      label: 'Retry',
      icon: <RedoOutlined />,
    },
    {
      key: 'copy',
      label: 'Copy',
      icon: <CopyOutlined />,
    },
    {
      key: 'more',
      children: [
        {
          key: 'share',
          label: 'Share',
          icon: <ShareAltOutlined />,
          children: [
            { key: 'qq', label: 'QQ' },
            { key: 'wechat', label: 'WeChat' },
          ],
        },
        { key: 'import', label: 'Import' },
        {
          key: 'delete',
          label: 'Delete',
          icon: <DeleteOutlined />,
          onItemClick: () => {
            Modal.confirm({
              title: 'Are you sure want to delete?',
              content: 'Some descriptions',
              onOk() {
                message.success('Delete successfully');
              },
              onCancel() {
                message.info('Cancel');
              },
            });
          },
          danger: true,
        },
      ],
    },
    {
      key: 'clear',
      label: 'Clear',
      icon: <DeleteOutlined />,
    },
  ];

  const onClick: ActionsProps['onClick'] = ({ keyPath }) => {
    // Logic for handling click events
    message.success(`you clicked ${keyPath.join(',')}`);
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

