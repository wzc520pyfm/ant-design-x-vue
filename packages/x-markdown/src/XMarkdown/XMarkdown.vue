<script setup lang="ts">
import { computed, h, type VNode } from 'vue';
import type { XMarkdownProps } from './interface';
import { parseMarkdown, htmlToVNode } from './core';
import DOMPurify from 'dompurify';

defineOptions({
  name: 'XMarkdown',
});

const props = withDefaults(defineProps<XMarkdownProps>(), {
  streaming: false,
});

/** Apply plugin transforms to content before parse */
function applyPlugins(content: string): string {
  let result = content;
  const plugins = props.plugins || [];
  for (const plugin of plugins) {
    if (plugin?.transform && typeof plugin.transform === 'function') {
      result = plugin.transform(result);
    }
  }
  return result;
}

const streamStatus = computed(() => (props.streaming ? ('loading' as const) : ('done' as const)));

const parsedHtml = computed(() => {
  if (!props.content) return '';
  const transformed = applyPlugins(props.content);
  const raw = parseMarkdown(transformed, props.config);
  // DOMPurify 依赖 document，SSR 环境下跳过 sanitize，仅客户端做净化
  if (typeof document === 'undefined') return raw;
  return DOMPurify.sanitize(raw);
});

/** Render HTML as VNodes with optional component replacement */
const bodyVNodes = computed((): VNode[] => {
  const html = parsedHtml.value;
  if (!html) return [];
  return htmlToVNode(html, {
    components: props.components || {},
    streamStatus: streamStatus.value,
  });
});

const rootClass = computed(() =>
  ['x-markdown', 'x-markdown-root', props.className].filter(Boolean).join(' '),
);

defineRender(() => h('div', { class: rootClass.value }, bodyVNodes.value));
</script>

<style scoped>
.x-markdown-root {
  line-height: 1.6;
}

.x-markdown-root :deep(pre) {
  background-color: #f5f5f5;
  padding: 16px;
  border-radius: 4px;
  overflow-x: auto;
}

.x-markdown-root :deep(code) {
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
}

.x-markdown-root :deep(p) {
  margin: 0 0 16px;
}

.x-markdown-root :deep(h1),
.x-markdown-root :deep(h2),
.x-markdown-root :deep(h3),
.x-markdown-root :deep(h4),
.x-markdown-root :deep(h5),
.x-markdown-root :deep(h6) {
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
}
</style>
