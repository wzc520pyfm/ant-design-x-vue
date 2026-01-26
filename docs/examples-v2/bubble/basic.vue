<script setup lang="tsx">
import { AntDesignOutlined, RedoOutlined } from '@ant-design/icons-vue';
import { Bubble, Actions } from 'ant-design-x-vue';
import { Avatar } from 'ant-design-vue';

const actionItems = (content: string) => [
  {
    key: 'copy',
    label: 'copy',
  },
  {
    key: 'retry',
    icon: <RedoOutlined />,
    label: 'Retry',
  },
];

const text = `Hello World\nNext line\nTab\tindent`;

defineRender(() => (
  <Bubble
    content={text}
    typing={{ effect: 'fade-in' }}
    header={<h5>Ant Design X</h5>}
    footer={(content) => (
      <Actions items={actionItems(content as string)} onClick={() => console.log(content)} />
    )}
    avatar={<Avatar icon={<AntDesignOutlined />} />}
  />
));
</script>
