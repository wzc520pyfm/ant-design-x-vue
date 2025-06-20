<script setup lang="tsx">
import { BulbOutlined, DownOutlined, LoadingOutlined, UpOutlined, UserOutlined } from '@ant-design/icons-vue';
import { Button, Space, Typography } from 'ant-design-vue';
import { Bubble, type BubbleProps } from 'ant-design-x-vue';
import markdownit from 'markdown-it';
import { ref } from 'vue';

defineOptions({ name: 'AXBubbleWithThink' });

const md = markdownit({ html: true, breaks: true });

const think = ref(false);
const collapse = ref(false);
const thinkContent = ref('');
const answerContent = ref('');

const renderMarkdown: BubbleProps['messageRender'] = (content) => (
  <Typography>
    <div v-html={md.render(content)} />
  </Typography>
);

defineRender(() => {
  return (
    <Space direction="vertical" size="large">
      <Button
        disabled={think.value}
        onClick={() => {
          think.value = true
          thinkContent.value += '> 好的，用户之前询问过我一些问题，我需要综合考虑，首先...';
          answerContent.value = '';
        }}
      >
        开始思考
      </Button>
      <Bubble
        v-if={thinkContent.value}
        avatar={{ icon: <UserOutlined /> }}
        styles={{ footer: { marginTop: 0 } }}
        content={
          <Space>
            <BulbOutlined />
            <span>{think.value ? "思考中..." : "已深度思考"}</span>
            <Button
              type="text"
              size="small"
              style={{ background: 'transparent' }}
              icon={collapse.value ? <UpOutlined /> : <DownOutlined />}
              onClick={() => {
                collapse.value = !collapse.value;
              }}
            />
          </Space>
        }
        footer={
          <Space direction="vertical">
            <Bubble
              v-show={!collapse.value}
              variant="borderless"
              typing
              content={thinkContent.value}
              messageRender={renderMarkdown}
              onTypingComplete={() => {
                think.value = false;
                answerContent.value += '思考完毕，这是我的答案。';
              }}
            />
            {think.value && <LoadingOutlined />}
            <Bubble
              variant="borderless"
              style={{ marginTop: '-24px' }}
              typing
              content={answerContent}
              messageRender={renderMarkdown}
            />
          </Space>
        }
      />
    </Space>
  );
})
</script>
