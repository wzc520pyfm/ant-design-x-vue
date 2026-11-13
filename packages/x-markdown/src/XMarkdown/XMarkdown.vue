<script setup lang="ts">
import {
  Fragment,
  computed,
  h,
  shallowRef,
  watch,
  type CSSProperties,
  type Component,
  type VNode,
} from 'vue';
import type { XMarkdownProps } from './interface';
import { Parser, htmlToVNode } from './core';
import { sanitizeMarkdownHtml } from './core/sanitize';
import { useStreaming, useTypewriter } from './hooks';
import { resolveStreaming, resolveTailContent } from './utils';
import classnames from 'classnames';
import { useXProviderContext } from 'ant-design-x-vue';
import DebugPanel from './DebugPanel';

defineOptions({
  name: 'XMarkdown',
});

const props = withDefaults(defineProps<XMarkdownProps>(), {
  streaming: undefined,
});

const { direction: contextDirection, getPrefixCls } = useXProviderContext();

const prefixCls = computed(() => getPrefixCls('x-markdown', props.prefixCls));

const disableStyleCls = computed(() => {
  const value = props.disableDefaultStyles;
  if (value === true) return 'x-md-disable-all';
  if (Array.isArray(value)) {
    return value.map((tag) => `x-md-disable-${tag}`);
  }
  return undefined;
});

const mergedCls = computed(() =>
  classnames(
    prefixCls.value,
    'x-markdown',
    disableStyleCls.value,
    props.rootClassName,
    props.className,
  ),
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
const typewriterActive = computed(
  () => !!resolvedStreaming.value?.hasNextChunk,
);

const pacedContent = useTypewriter({
  content: rawContent,
  typewriter: typewriterOption,
  active: typewriterActive,
});

const streamingOptionRef = computed(() => resolvedStreaming.value);
const componentsRef = computed(() => props.components);

const { displayedContent: displayContent, sections: streamSections } =
  useStreaming({
    content: pacedContent,
    streamingOption: streamingOptionRef as any,
    components: componentsRef as any,
  });

const tailContent = computed(() =>
  resolveTailContent(resolvedStreaming.value?.tail),
);
const TailComponent = computed(() => {
  const tail = resolvedStreaming.value?.tail;
  return typeof tail === 'object' && tail
    ? (tail.component as Component | undefined)
    : undefined;
});
const shouldShowTail = computed(
  () => !!resolvedStreaming.value?.hasNextChunk && !!tailContent.value,
);

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
    inheritAttrs: false,
    setup() {
      return () => h('span', { class: 'xmd-tail' }, content);
    },
  };
}

function defineTailWrapper(Comp: Component, content: string): Component {
  return {
    name: 'XmdTailCustom',
    inheritAttrs: false,
    setup() {
      return () => h(Comp, { content });
    },
  };
}

function createParser() {
  return new Parser({
    markedConfig: props.config as any,
    paragraphTag: props.paragraphTag,
    openLinksInNewTab: props.openLinksInNewTab,
    components: props.components,
    protectCustomTagNewlines: props.protectCustomTagNewlines,
    disableCustomTagBlockMarkdown: props.disableCustomTagBlockMarkdown,
    escapeRawHtml: props.escapeRawHtml,
  });
}

const parser = shallowRef<Parser>(createParser());

watch(
  () => [
    props.config,
    props.paragraphTag,
    props.openLinksInNewTab,
    props.components,
    props.protectCustomTagNewlines,
    props.disableCustomTagBlockMarkdown,
    props.escapeRawHtml,
  ],
  () => {
    parser.value = createParser();
  },
);

function renderMarkdownSection(source: string, injectTail: boolean): VNode[] {
  if (!source) return [];
  const transformed = applyPlugins(source);
  const raw = parser.value.parse(transformed, { injectTail });
  const html = sanitizeMarkdownHtml(
    raw,
    mergedComponents.value,
    props.dompurifyConfig,
  );
  // No sanitizer available (SSR/Node): skip rendering instead of emitting raw HTML.
  if (!html) return [];
  return htmlToVNode(html, {
    components: mergedComponents.value,
    componentsProps: props.componentsProps,
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
      nodes.push(
        h(
          'div',
          {
            key: `xmd-sec-${index}`,
            class: 'xmd-section',
            style: { display: 'contents' },
          },
          part,
        ),
      );
    });
    return nodes;
  }

  const source = displayContent.value ?? rawContent.value;
  return renderMarkdownSection(source, shouldShowTail.value);
});

defineRender(() => {
  if (!rawContent.value && !displayContent.value) return null;
  const root = h(
    'div',
    { class: mergedCls.value, style: mergedStyle.value },
    bodyVNodes.value,
  );
  return props.debug ? h(Fragment, null, [root, h(DebugPanel)]) : root;
});
</script>

<style scoped>
/*
 * Default tag styles are gated behind `:not(.x-md-disable-all):not(.x-md-disable-<tag>)`
 * so `disableDefaultStyles` can opt out (align React @ant-design/x-markdown).
 */
.x-markdown {
  line-height: 1.6;
}
.x-markdown:not(.x-md-disable-all):not(.x-md-disable-pre) pre {
  background-color: #f5f5f5;
  padding: 16px;
  border-radius: 4px;
  overflow-x: auto;
}
.x-markdown:not(.x-md-disable-all):not(.x-md-disable-code) code {
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
}
.x-markdown:not(.x-md-disable-all):not(.x-md-disable-p) p {
  margin: 0 0 16px;
}
.x-markdown h1,
.x-markdown h2,
.x-markdown h3,
.x-markdown h4,
.x-markdown h5,
.x-markdown h6 {
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
}
.x-markdown :deep(.inline-katex .katex-display) {
  display: inline-block;
  margin: 0;
  text-align: initial;
  vertical-align: middle;
}
.x-markdown :deep(.inline-katex .katex-display > .katex) {
  display: inline-block;
  text-align: initial;
  white-space: normal;
}
.x-markdown :deep(.inline-katex .katex-display > .katex > .katex-html) {
  display: inline-block;
  position: static;
}
.x-markdown :deep(.inline-katex .katex-display > .katex > .katex-html > .tag) {
  position: static;
}
.x-markdown :deep(.block-katex) {
  display: block;
  margin: 1em 0;
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
