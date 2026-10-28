<script setup lang="tsx">
defineOptions({ name: 'AXXMarkdownStreamingSyntaxV2Setup' });

import { computed, h, onMounted, onUnmounted, ref, watch } from 'vue';
import { XMarkdown, type ComponentProps } from '@ant-design-x-vue/x-markdown';
import { Welcome } from 'ant-design-x-vue';
import { Button, Card, Flex, Segmented, Skeleton, theme } from 'ant-design-vue';
import '@ant-design-x-vue/x-markdown/themes/light.css';
import '@ant-design-x-vue/x-markdown/themes/dark.css';
import { isDarkColor } from '../../examples-v2/_shared/playground-shell';
import {
  incompleteEmphasisParts,
  streamingFormatDemos,
} from '../../examples-v2/_shared/streaming-format';

const { token } = theme.useToken();
const markdownClass = computed(() => (
  isDarkColor(token.value.colorBgContainer) ? 'x-markdown-dark' : 'x-markdown-light'
));

const current = ref(0);
const displayText = ref('');
const isStreaming = ref(false);
let timer = 0;

function startStream() {
  window.clearTimeout(timer);
  const content = streamingFormatDemos[current.value].content;
  displayText.value = '';
  isStreaming.value = true;
  let index = 0;
  const tick = () => {
    if (index <= content.length) {
      displayText.value = content.slice(0, index);
      index += 1;
      timer = window.setTimeout(tick, 30);
    }
    else {
      isStreaming.value = false;
    }
  };
  tick();
}

onMounted(startStream);
watch(current, () => startStream());
onUnmounted(() => window.clearTimeout(timer));

const IncompleteLink = (_props: ComponentProps) => h(Skeleton.Button, {
  active: true,
  size: 'small',
  style: { width: '16px', height: '16px', minWidth: '16px' },
});

const IncompleteEmphasis = (props: ComponentProps) => {
  const parts = incompleteEmphasisParts(String(props['data-raw'] || ''));
  if (!parts)
    return null;
  if (parts.level === 1)
    return h('em', parts.content);
  if (parts.level === 2)
    return h('strong', parts.content);
  return h('em', h('strong', parts.content));
};

const ImageSkeleton = () => h(Skeleton.Image, { active: true, style: { width: '60px', height: '60px' } });
const TableSkeleton = () => h(Skeleton.Button, { active: true, style: { width: '160px', height: '22px' } });
const HtmlSkeleton = () => h(Skeleton.Button, { active: true, style: { width: '383px', height: '120px' } });

const WelcomeCard = (props: Record<string, any>) => h(Welcome, {
  styles: { icon: { flexShrink: 0 } },
  icon: props['data-icon'],
  title: props.title,
  description: props['data-description'],
});

const sourceStyle = computed(() => ({
  background: token.value.colorFillQuaternary,
  color: token.value.colorText,
  padding: '12px',
  borderRadius: '4px',
  fontSize: '13px',
  fontFamily: 'monospace',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  margin: 0,
  maxHeight: '800px',
  overflow: 'auto',
}));

const components = {
  'incomplete-image': ImageSkeleton,
  'incomplete-link': IncompleteLink,
  'incomplete-table': TableSkeleton,
  'incomplete-html': HtmlSkeleton,
  'incomplete-emphasis': IncompleteEmphasis,
  welcome: WelcomeCard,
};

const streaming = computed(() => ({
  hasNextChunk: isStreaming.value,
  enableAnimation: true,
}));
const outputStyle = computed(() => ({
  border: `1px solid ${token.value.colorBorderSecondary}`,
  borderRadius: '4px',
  padding: '12px',
  maxHeight: '800px',
  overflow: 'auto',
}));

defineRender(() => (
  <div>
    <Flex gap={8} align="center" wrap="wrap" style={{ marginBottom: '12px' }}>
      <Segmented
        value={current.value}
        options={streamingFormatDemos.map((demo, index) => ({ label: demo.title, value: index }))}
        onChange={(value: string | number) => { current.value = Number(value); }}
      />
      <Button style={{ alignSelf: 'flex-start' }} onClick={startStream} loading={isStreaming.value}>
        Run Stream
      </Button>
    </Flex>
    <Flex gap={16} style={{ width: '100%' }}>
      <Card title="Markdown Source" size="small" style={{ flex: 1, minWidth: 0 }}>
        <div style={sourceStyle.value}>
          {displayText.value || 'Click Re-Render to start'}
        </div>
      </Card>
      <Card
        title="Rendered Output"
        size="small"
        style={{ flex: 1, minWidth: 0, overflow: 'auto' }}
        extra={h(Button, { type: 'primary', onClick: startStream, loading: isStreaming.value }, () => 'Re-Render')}
      >
        <div style={outputStyle.value}>
          <XMarkdown
            content={displayText.value}
            className={markdownClass.value}
            openLinksInNewTab
            dompurifyConfig={{ ADD_ATTR: ['icon', 'description'] }}
            components={components}
            streaming={streaming.value}
          />
          {isStreaming.value ? h('span', { 'aria-hidden': 'true' }, '▋') : null}
        </div>
      </Card>
    </Flex>
  </div>
));
</script>
