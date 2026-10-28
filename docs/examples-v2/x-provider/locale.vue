<script setup lang="tsx">
import {
  CodeOutlined,
  FileImageOutlined,
  FileSearchOutlined,
  EditOutlined,
} from '@ant-design/icons-vue';
import { Card, Flex, Radio, Typography } from 'ant-design-vue';
import enUS from 'ant-design-vue/es/locale/en_US';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import { Actions, Conversations, XProvider, en_US, zh_CN } from 'ant-design-x-vue';
import { ref } from 'vue';

defineOptions({ name: 'AXProviderLocale' });

const labels = {
  en: {
    write: 'Help Me Write',
    coding: 'AI Coding',
    createImage: 'Create Image',
    deepSearch: 'Deep Search',
  },
  zh: {
    write: '帮我写作',
    coding: 'AI编码',
    createImage: '图片生成',
    deepSearch: '深度搜索',
  },
};

const localeType = ref<'zh' | 'en'>('zh');
const locale = ref({ ...zhCN, ...zh_CN });

const changeLocale = (e: { target: { value: 'zh' | 'en' } }) => {
  const next = e.target.value;
  localeType.value = next;
  locale.value = next === 'zh' ? { ...zhCN, ...zh_CN } : { ...enUS, ...en_US };
};

const actionItems = [
  {
    key: 'feedback',
    actionRender: () => <Actions.Feedback />,
  },
  {
    key: 'copy',
    label: 'copy',
    actionRender: () => <Actions.Copy text="copy value" />,
  },
  {
    key: 'audio',
    label: 'audio',
    actionRender: () => <Actions.Audio />,
  },
];

defineRender(() => (
  <>
    <Flex gap={12} style={{ marginBottom: '16px' }} align="center">
      <Typography.Text>Change locale of components:</Typography.Text>
      <Radio.Group value={localeType.value} onChange={changeLocale}>
        <Radio.Button value="en">English</Radio.Button>
        <Radio.Button value="zh">中文</Radio.Button>
      </Radio.Group>
    </Flex>
    <XProvider locale={locale.value}>
      <Flex gap={12} vertical>
        <Card>
          <Conversations
            style={{ width: '200px' }}
            defaultActiveKey="write"
            creation={{ onClick: () => {} }}
            items={[
              {
                key: 'write',
                label: labels[localeType.value].write,
                icon: <EditOutlined />,
              },
              {
                key: 'coding',
                label: labels[localeType.value].coding,
                icon: <CodeOutlined />,
              },
              {
                key: 'createImage',
                label: labels[localeType.value].createImage,
                icon: <FileImageOutlined />,
              },
              {
                key: 'deepSearch',
                label: labels[localeType.value].deepSearch,
                icon: <FileSearchOutlined />,
              },
            ]}
          />
        </Card>
        <Card>
          <Actions items={actionItems} />
        </Card>
      </Flex>
    </XProvider>
  </>
));
</script>
