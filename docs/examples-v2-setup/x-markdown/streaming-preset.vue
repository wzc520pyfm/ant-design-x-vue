<script setup lang="tsx">
defineOptions({ name: 'AXXMarkdownStreamingPresetV2' });

import { computed, onMounted, onUnmounted, ref } from 'vue';
import { XMarkdown } from '@ant-design-x-vue/x-markdown';
import { Button, Card, Flex, Segmented, theme } from 'ant-design-vue';
import '@ant-design-x-vue/x-markdown/themes/light.css';
import '@ant-design-x-vue/x-markdown/themes/dark.css';

const { token } = theme.useToken();
const isDark = computed(() => {
  const c = token.value.colorBgContainer || '#fff';
  // simple luminance check
  const hex = c.replace('#', '');
  if (hex.length >= 6) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 < 128;
  }
  return false;
});
const markdownClass = computed(() => (isDark.value ? 'x-markdown-dark' : 'x-markdown-light'));

const section = (i: number) =>
  [
    `## ${i + 1}. Section ${i + 1}`,
    '',
    `This paragraph has **bold text**, *emphasis*, \`inline code\` and a [link](https://x.ant.design).`,
    '',
    '```ts',
    `export function step${i}(a: number, b: number): number {`,
    '  return a * b + 1;',
    '}',
    '```',
    '',
  ].join('\n');

const fullText = `# Streaming preset\n\n${Array.from({ length: 4 }, (_, i) => section(i)).join('')}`;

const PACES = { fast: 40, normal: 120, slow: 280 } as const;
type Pace = keyof typeof PACES;
const pace = ref<Pace>('normal');
const content = ref('');
const isStreaming = ref(false);
let timer = 0;

function startStream() {
  window.clearTimeout(timer);
  content.value = '';
  isStreaming.value = true;
  let index = 0;
  const tick = () => {
    if (index < fullText.length) {
      index = Math.min(fullText.length, index + 24);
      content.value = fullText.slice(0, index);
      timer = window.setTimeout(tick, PACES[pace.value]);
    } else {
      isStreaming.value = false;
    }
  };
  tick();
}

onMounted(startStream);
onUnmounted(() => window.clearTimeout(timer));

const paneStyle = computed(() => ({
  height: '280px',
  overflow: 'auto',
  border: `1px solid ${token.value.colorBorderSecondary}`,
  borderRadius: '8px',
  padding: '12px',
  background: token.value.colorBgContainer,
}));

defineRender(() => (
  <Flex vertical gap={12}>
    <Flex gap={8} align="center" wrap="wrap">
      <Button type="primary" onClick={startStream}>
        Re-run
      </Button>
      <Segmented
        value={pace.value}
        options={[
          { label: 'Fast', value: 'fast' },
          { label: 'Normal', value: 'normal' },
          { label: 'Slow', value: 'slow' },
        ]}
        onChange={(v) => {
          pace.value = v as Pace;
        }}
      />
    </Flex>
    <Flex gap={12} wrap="wrap">
      <Card size="small" title="No streaming" style={{ flex: 1, minWidth: '280px' }}>
        <div style={paneStyle.value}>
          <XMarkdown className={markdownClass.value} content={content.value} />
        </div>
      </Card>
      <Card size="small" title="streaming={isStreaming}" style={{ flex: 1, minWidth: '280px' }}>
        <div style={paneStyle.value}>
          <XMarkdown
            className={markdownClass.value}
            content={content.value}
            streaming={isStreaming.value}
          />
        </div>
      </Card>
    </Flex>
  </Flex>
));
</script>
