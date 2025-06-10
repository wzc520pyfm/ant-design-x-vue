<script setup lang="tsx">
import { CopyOutlined, SyncOutlined, UserOutlined } from '@ant-design/icons-vue';
import { Bubble } from 'ant-design-x-vue';
import { Button, Space, theme } from 'ant-design-vue';

defineOptions({ name: 'BubbleHeaderAndFooter' });

const { token } = theme.useToken();

defineRender(() => {
  return (
    <Bubble
      content="Hello, welcome to use Ant Design X! Just ask if you have any questions."
      avatar={{ icon: <UserOutlined /> }}
      header="Ant Design X Vue"
      footer={(messageContext) => (
        <Space size={token.value.paddingXXS}>
          <Button type="text" size="small" icon={<SyncOutlined />} />
          <Button
            onClick={() => console.log('Copy message:', messageContext)}
            type="text"
            size="small"
            icon={<CopyOutlined />}
          />
        </Space>
      )}
    />
  )
});
</script>
