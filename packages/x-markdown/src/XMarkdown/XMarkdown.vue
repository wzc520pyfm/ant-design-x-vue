<script setup lang="ts">
import { computed, h, shallowRef, watch, type CSSProperties, type VNode } from 'vue';
import type { XMarkdownProps } from './interface';
import { Parser, htmlToVNode } from './core';
import DOMPurify from 'dompurify';
import { useStreaming } from './hooks';
import classnames from 'classnames';
import { useXProviderContext } from '@ant-design-x-vue/components';

defineOptions({
  name: 'XMarkdown',
});

const props = withDefaults(defineProps<XMarkdownProps>(), {
  streaming: false,
});

const { direction: contextDirection, getPrefixCls } = useXProviderContext();

const prefixCls = computed(() => getPrefixCls('x-markdown', props.prefixCls));

const mergedCls = computed(() =>
  classnames(prefixCls.value, 'x-markdown', props.rootClassName, props.className),
);

const mergedStyle = computed<CSSProperties>(() => ({
  direction: contextDirection?.value === 'rtl' ? 'rtl' : 'ltr',
  ...(props.style || {}),
}));

// Legacy plugin transform hook (back-compat with v1 API).
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

const streamingObject = computed(() => {
  if (typeof props.streaming === 'object' && props.streaming !== null) {
    return props.streaming;
  }
  return undefined;
});

const streamingFlag = computed(() => {
  if (typeof props.streaming === 'boolean') return props.streaming;
  return !!streamingObject.value;
});

const streamStatus = computed(() => (streamingFlag.value ? 'loading' : 'done'));

const rawContent = computed(() => props.content ?? props.children ?? '');

const { displayedContent: displayContent } = useStreaming({
  content: rawContent,
  streaming: streamingFlag,
  streamingOption: streamingObject,
});

const parser = shallowRef<Parser>(
  new Parser({
    markedConfig: props.config as any,
    paragraphTag: props.paragraphTag,
    openLinksInNewTab: props.openLinksInNewTab,
  }),
);

watch(
  () => [props.config, props.paragraphTag, props.openLinksInNewTab],
  () => {
    parser.value = new Parser({
      markedConfig: props.config as any,
      paragraphTag: props.paragraphTag,
      openLinksInNewTab: props.openLinksInNewTab,
    });
  },
);

const parsedHtml = computed(() => {
  const source = displayContent.value ?? rawContent.value;
  if (!source) return '';
  const transformed = applyPlugins(source);
  const raw = parser.value.parse(transformed);
  if (typeof document === 'undefined') return raw;
  return DOMPurify.sanitize(raw, props.dompurifyConfig as any) as unknown as string;
});

const bodyVNodes = computed((): VNode[] => {
  const html = parsedHtml.value;
  if (!html) return [];
  return htmlToVNode(html, {
    components: props.components || {},
    streamStatus: streamStatus.value,
  });
});

defineRender(() => {
  if (!rawContent.value) return null;
  return h(
    'div',
    { class: mergedCls.value, style: mergedStyle.value },
    bodyVNodes.value,
  );
});
</script>

<style scoped>
:deep(.x-markdown) {
  line-height: 1.6;
}
:deep(.x-markdown) pre {
  background-color: #f5f5f5;
  padding: 16px;
  border-radius: 4px;
  overflow-x: auto;
}
:deep(.x-markdown) code {
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
}
:deep(.x-markdown) p {
  margin: 0 0 16px;
}
:deep(.x-markdown) h1,
:deep(.x-markdown) h2,
:deep(.x-markdown) h3,
:deep(.x-markdown) h4,
:deep(.x-markdown) h5,
:deep(.x-markdown) h6 {
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
}
</style>
