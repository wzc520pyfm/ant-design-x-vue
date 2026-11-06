<script setup lang="ts">
import { computed, h, shallowRef, watch, type CSSProperties, type Component, type VNode } from 'vue';
import type { XMarkdownProps } from './interface';
import { Parser, htmlToVNode, buildDomPurifyConfig } from './core';
import DOMPurify from 'dompurify';
import { useStreaming, useTypewriter } from './hooks';
import { resolveStreaming, resolveTailContent } from './utils';
import classnames from 'classnames';
import { useXProviderContext } from 'ant-design-x-vue';

defineOptions({
  name: 'XMarkdown',
});

const props = withDefaults(defineProps<XMarkdownProps>(), {
  streaming: undefined,
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

/** Expand boolean preset; objects pass through (align React 2.10). */
const resolvedStreaming = computed(() => resolveStreaming(props.streaming));

const streamingFlag = computed(() => !!resolvedStreaming.value?.hasNextChunk);

const streamStatus = computed(() => (streamingFlag.value ? 'loading' : 'done'));

const rawContent = computed(() => props.content ?? props.children ?? '');

const typewriterOption = computed(() => resolvedStreaming.value?.typewriter);
const typewriterActive = computed(() => !!resolvedStreaming.value?.hasNextChunk);

const pacedContent = useTypewriter({
  content: rawContent,
  typewriter: typewriterOption,
  active: typewriterActive,
});

const streamingOptionRef = computed(() => resolvedStreaming.value);
const componentsRef = computed(() => props.components);

const { displayedContent: displayContent, sections: streamSections } = useStreaming({
  content: pacedContent,
  streamingOption: streamingOptionRef as any,
  components: componentsRef as any,
});

const tailContent = computed(() => resolveTailContent(resolvedStreaming.value?.tail));
const TailComponent = computed(() => {
  const tail = resolvedStreaming.value?.tail;
  return typeof tail === 'object' && tail ? (tail.component as Component | undefined) : undefined;
});
const shouldShowTail = computed(() => !!resolvedStreaming.value?.hasNextChunk && !!tailContent.value);

const mergedComponents = computed(() => {
  if (!shouldShowTail.value) return props.components || {};
  const Tail = TailComponent.value;
  const content = tailContent.value || '▋';
  return {
    ...(props.components || {}),
    'xmd-tail': Tail
      ? defineTailWrapper(Tail, content)
      : defineDefaultTail(content),
  };
});

function defineDefaultTail(content: string): Component {
  return {
    name: 'XmdTail',
    setup() {
      return () => h('span', { class: 'xmd-tail' }, content);
    },
  };
}

function defineTailWrapper(Comp: Component, content: string): Component {
  return {
    name: 'XmdTailCustom',
    setup() {
      return () => h(Comp, { content });
    },
  };
}

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

function renderMarkdownSection(source: string, injectTail: boolean): VNode[] {
  if (!source) return [];
  const transformed = applyPlugins(source);
  const raw = parser.value.parse(transformed, { injectTail });
  const html =
    typeof document === 'undefined'
      ? raw
      : (DOMPurify.sanitize(
          raw,
          buildDomPurifyConfig(mergedComponents.value, props.dompurifyConfig) as any,
        ) as unknown as string);
  if (!html) return [];
  return htmlToVNode(html, {
    components: mergedComponents.value,
    streamStatus: streamStatus.value,
    streaming: resolvedStreaming.value,
  });
}

const bodyVNodes = computed((): VNode[] => {
  const sections = streamSections.value;
  if (sections && sections.length > 0) {
    const nodes: VNode[] = [];
    sections.forEach((section, index) => {
      const injectTail = shouldShowTail.value && index === sections.length - 1;
      const part = renderMarkdownSection(section, injectTail);
      // Keyed wrapper keeps finished sections stable across chunk updates.
      nodes.push(h('div', { key: `xmd-sec-${index}`, class: 'xmd-section', style: { display: 'contents' } }, part));
    });
    return nodes;
  }

  const source = displayContent.value ?? rawContent.value;
  return renderMarkdownSection(source, shouldShowTail.value);
});

defineRender(() => {
  if (!rawContent.value && !displayContent.value) return null;
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
:deep(.xmd-tail) {
  display: inline;
  margin-left: 1px;
  animation: xmd-tail-blink 1s steps(1) infinite;
}
@keyframes xmd-tail-blink {
  50% {
    opacity: 0;
  }
}
</style>
