<script setup lang="tsx">
defineOptions({ name: 'AXBubbleBasicV2' });

import { AntDesignOutlined, CopyOutlined, CheckOutlined, RedoOutlined } from '@ant-design/icons-vue';
import { Bubble, Actions } from 'ant-design-x-vue';
import { Avatar } from 'ant-design-vue';
import { ref, h } from 'vue';

const copiedKey = ref('');

const actionItems = (content: string) => [
  {
    key: 'copy',
    icon: copiedKey.value === content ? <CheckOutlined /> : <CopyOutlined />,
    label: 'Copy',
    onItemClick: () => {
      navigator.clipboard.writeText(content);
      copiedKey.value = content;
      setTimeout(() => { copiedKey.value = ''; }, 2000);
    },
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
