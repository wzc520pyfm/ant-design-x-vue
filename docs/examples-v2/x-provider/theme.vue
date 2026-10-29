<script setup lang="tsx">
import {
  CommentOutlined,
  FireOutlined,
  HeartOutlined,
  ReadOutlined,
  RocketOutlined,
  SmileOutlined,
} from '@ant-design/icons-vue';
import { Card, Divider, Flex, message, Space, Typography } from 'ant-design-vue';
import { Conversations, Prompts, Sender, Suggestion, XProvider } from 'ant-design-x-vue';
import { computed, ref } from 'vue';

function withAlpha(hex: string, alpha: number) {
  const raw = hex.replace('#', '');
  const full = raw.length === 3 ? raw.split('').map((c) => c + c).join('') : raw;
  const value = Number.parseInt(full, 16);
  if (!Number.isFinite(value) || full.length !== 6) return `rgba(0, 0, 0, ${alpha})`;
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

defineOptions({ name: 'AXProviderTheme' });

const colorPrimary = ref('#d10eef');
// Prompt cards use a fixed light gradient. Dark docs would otherwise paint
// their labels with the dark-algorithm text token (near white).
const textColor = ref('#141414');

const promptTextStyle = computed(() => ({
  '--ax-theme-demo-text': textColor.value,
  '--ax-theme-demo-desc': withAlpha(textColor.value, 0.65),
}));

const renderTitle = (icon: any, title: string) => (
  <Space align="start">
    {icon}
    <span>{title}</span>
  </Space>
);

const promptItems = [
  {
    key: '1',
    label: renderTitle(<FireOutlined style={{ color: '#FF4D4F' }} />, 'Hot Topics'),
    description: 'What are you interested in?',
    children: [
      { key: '1-1', description: "What's new in X?" },
      { key: '1-2', description: "What's AGI?" },
      { key: '1-3', description: 'Where is the doc?' },
    ],
  },
  {
    key: '2',
    label: renderTitle(<ReadOutlined style={{ color: '#1890FF' }} />, 'Design Guide'),
    description: 'How to design a good product?',
    children: [
      { key: '2-1', icon: <HeartOutlined />, description: 'Know the well' },
      { key: '2-2', icon: <SmileOutlined />, description: 'Set the AI role' },
      { key: '2-3', icon: <CommentOutlined />, description: 'Express the feeling' },
    ],
  },
  {
    key: '3',
    label: renderTitle(<RocketOutlined style={{ color: '#722ED1' }} />, 'Start Creating'),
    description: 'How to start a new project?',
    children: [
      { key: '3-1', label: 'Fast Start', description: 'Install Ant Design X' },
      { key: '3-2', label: 'Online Playground', description: 'Play on the web without installing' },
    ],
  },
];

defineRender(() => (
  <>
    <Flex gap={12} style={{ marginBottom: '16px' }} align="center">
      <Typography.Text>ColorPrimary:</Typography.Text>
      <input
        type="color"
        value={colorPrimary.value}
        onInput={(e: Event) => {
          colorPrimary.value = (e.target as HTMLInputElement).value;
        }}
      />
      <Typography.Text>文字颜色:</Typography.Text>
      <input
        type="color"
        value={textColor.value}
        onInput={(e: Event) => {
          textColor.value = (e.target as HTMLInputElement).value;
        }}
      />
    </Flex>
    <Card>
      <XProvider theme={{ token: { colorPrimary: colorPrimary.value } }}>
        <Flex style={{ height: '500px' }} gap={12}>
          <Conversations
            style={{ width: '130px' }}
            creation={{ onClick: () => {} }}
            defaultActiveKey="1"
            items={[
              { key: '1', label: 'Conversation - 1' },
              { key: '2', label: 'Conversation - 2' },
            ]}
          />
          <Divider type="vertical" style={{ height: '100%' }} />
          <Flex justify="space-between" vertical style={{ flex: 1 }} gap={8}>
            <Prompts
              class="ax-provider-theme-prompts"
              style={promptTextStyle.value}
              title="Do you want?"
              items={promptItems}
              wrap
              styles={{
                list: { justifyContent: 'space-around', maxWidth: '1000px', margin: '0 auto' },
                item: {
                  flex: 'none',
                  width: 'calc(30% - 6px)',
                  backgroundImage: 'linear-gradient(137deg, #e5f4ff 0%, #efe7ff 100%)',
                  border: '0',
                },
                subItem: { background: 'rgba(255,255,255,0.45)', border: '1px solid #FFF' },
              }}
              onItemClick={(info: any) => {
                message.success(`You clicked a prompt: ${info.data.key}`);
              }}
            />
            <Suggestion items={[{ label: 'Write a report', value: 'report' }]}>
              {{
                default: ({ onTrigger, onKeyDown }: any) => (
                  <Sender
                    onChange={(nextVal: string) => {
                      if (nextVal === '/') {
                        onTrigger();
                      } else if (!nextVal) {
                        onTrigger(false);
                      }
                    }}
                    onKeyDown={onKeyDown}
                    placeholder='Type "/" to trigger suggestion'
                  />
                ),
              }}
            </Suggestion>
          </Flex>
        </Flex>
      </XProvider>
    </Card>
  </>
));
</script>

<style>
.ax-provider-theme-prompts .ant-prompts-label {
  color: var(--ax-theme-demo-text, #141414) !important;
}
.ax-provider-theme-prompts .ant-prompts-desc,
.ax-provider-theme-prompts .ant-prompts-icon {
  color: var(--ax-theme-demo-desc, rgba(0, 0, 0, 0.65)) !important;
}
</style>
