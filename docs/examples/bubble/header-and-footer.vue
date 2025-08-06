<script setup lang="tsx">
import { CopyOutlined, SyncOutlined, UserOutlined } from '@ant-design/icons-vue';
import { Bubble } from 'ant-design-x-vue';
import { App, Button, Space, theme } from 'ant-design-vue';
import { defineComponent } from 'vue';

defineOptions({ name: 'BubbleHeaderAndFooter' });

const Demo = defineComponent({
  name: 'BubbleHeaderAndFooterDemo',
  inheritAttrs: false,
  setup() {
    const { message } = App.useApp();
    const { token } = theme.useToken();

    const onCopy = (textToCopy: any) => {
      if (!textToCopy) return message.success('Text is empty');
      message.success(`Text copied successfully：${textToCopy}`);
    };

    return () => (
      <Bubble
        content="Hello, welcome to use Ant Design X! Just ask if you have any questions."
        avatar={{ icon: <UserOutlined /> }}
        header={(messageContext) => (
          <Space size={token.value.paddingXXS}>
            <div>{messageContext as string} </div>
          </Space>
        )}
        footer={(messageContext) => (
          <Space size={token.value.paddingXXS}>
            <Button type="text" size="small" icon={<SyncOutlined />} />
            <Button
              onClick={() => onCopy(messageContext)}
              type="text"
              size="small"
              icon={<CopyOutlined />}
            />
          </Space>
        )}
      />
    );
  }
});

defineRender(() => {
  return (
    <App>
      <Demo />
    </App>
  )
});
</script>
