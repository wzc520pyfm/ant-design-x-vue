<script setup lang="tsx">
import { ref } from 'vue';
import { CopyOutlined, RedoOutlined, UserOutlined } from '@ant-design/icons-vue';
import { Bubble, Actions } from 'ant-design-x-vue';
import { Avatar, Button, Divider, Flex, RadioGroup, RadioButton, Switch } from 'ant-design-vue';

const text = 'Ant Design X - Better UI toolkit for your AI Chat WebApp. '.repeat(5);
const text2 = 'Ant Design X - Build your AI Chat WebApp with an easier way. '.repeat(5);

const actionItems = [
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

const loading = ref(true);
const data = ref('');
const effect = ref<'fade-in' | 'typing'>('fade-in');
const keepPrefix = ref(false);

const loadAll = () => {
  loading.value = false;
  data.value = text;
};

const replaceText = () => {
  loading.value = false;
  data.value = text2;
};

defineRender(() => (
  <Flex vertical gap="small">
    <Flex gap="small" align="center">
      <span>非流式数据 / Non-streaming data:</span>
      <Button type="primary" onClick={loadAll}>
        load data-1
      </Button>
      <Button onClick={replaceText}>load data-2</Button>
    </Flex>
    <Flex gap="small" align="center">
      <span>动画效果 / Animation effects:</span>
      <RadioGroup value={effect.value} onChange={(e: any) => (effect.value = e.target.value)}>
        <RadioButton value="fade-in">fade-in</RadioButton>
        <RadioButton value="typing">typing</RadioButton>
      </RadioGroup>
    </Flex>
    <Flex gap="small" align="center">
      <span>保留公共前缀 / Preserve common prefix:</span>
      <Switch checked={keepPrefix.value} onChange={(val: boolean) => (keepPrefix.value = val)} />
    </Flex>
    <Divider />
    <Flex gap="small" align="center">
      <Bubble
        loading={loading.value}
        content={data.value}
        typing={{ effect: effect.value, interval: 50, step: 3, keepPrefix: keepPrefix.value }}
        header={<h5>ADX</h5>}
        footer={(content) => <Actions items={actionItems} onClick={() => console.log(content)} />}
        avatar={<Avatar icon={<UserOutlined />} />}
        onTyping={() => console.log('typing')}
        onTypingComplete={() => console.log('typing complete')}
      />
    </Flex>
  </Flex>
));
</script>
