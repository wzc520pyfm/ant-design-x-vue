<script setup lang="ts">
import { computed, ref, watchEffect, type CSSProperties, type VNode } from 'vue';
import classnames from 'classnames';
import hljs from 'highlight.js/lib/core';
import hljsBash from 'highlight.js/lib/languages/bash';
import hljsCss from 'highlight.js/lib/languages/css';
import hljsJavascript from 'highlight.js/lib/languages/javascript';
import hljsJson from 'highlight.js/lib/languages/json';
import hljsMarkdown from 'highlight.js/lib/languages/markdown';
import hljsPython from 'highlight.js/lib/languages/python';
import hljsTypescript from 'highlight.js/lib/languages/typescript';
import hljsXml from 'highlight.js/lib/languages/xml';
import { message, theme } from 'ant-design-vue';
import { useLocale, useXProviderContext } from 'ant-design-x-vue';
import 'highlight.js/styles/atom-one-light.css';
import { isDarkColor } from '../is-dark-color';

hljs.registerLanguage('bash', hljsBash);
hljs.registerLanguage('css', hljsCss);
hljs.registerLanguage('javascript', hljsJavascript);
hljs.registerLanguage('json', hljsJson);
hljs.registerLanguage('markdown', hljsMarkdown);
hljs.registerLanguage('python', hljsPython);
hljs.registerLanguage('typescript', hljsTypescript);
hljs.registerLanguage('xml', hljsXml);

defineOptions({ name: 'AXHighlightCode' });

type SemanticType = 'root' | 'header' | 'headerTitle' | 'code';

interface Props {
  lang?: string;
  children?: string;
  header?: VNode | null;
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
  classNames?: Partial<Record<SemanticType, string>>;
  styles?: Partial<Record<SemanticType, CSSProperties>>;
}

const props = defineProps<Props>();

const { token } = theme.useToken();
const darkSurface = computed(() => isDarkColor(token.value.colorBgContainer));

const [contextLocale] = useLocale('HighlightCode');

const { direction, getPrefixCls } = useXProviderContext();
const prefixCls = computed(() => getPrefixCls('highlightCode', props.prefixCls));

const rootCls = computed(() =>
  classnames(prefixCls.value, props.className, props.classNames?.root, {
    [`${prefixCls.value}-rtl`]: direction?.value === 'rtl',
  }),
);

const headerCls = computed(() =>
  classnames(`${prefixCls.value}-header`, props.classNames?.header),
);
const headerTitleCls = computed(() =>
  classnames(`${prefixCls.value}-header-title`, props.classNames?.headerTitle),
);
const codeBoxCls = computed(() => classnames(`${prefixCls.value}-code`, props.classNames?.code, {
  [`${prefixCls.value}-code-dark`]: darkSurface.value,
}));

const headerStyle = computed(() => ({
  background: token.value.colorFillContent,
  color: token.value.colorText,
  ...(props.styles?.header || {}),
}));
const codeStyle = computed(() => ({
  background: token.value.colorBgContainer,
  borderColor: token.value.colorBorderSecondary,
  color: token.value.colorText,
  ...(props.styles?.code || {}),
}));
const copyStyle = computed(() => ({
  color: token.value.colorText,
}));

async function handleCopyCode() {
  if (!props.children) return;
  try {
    await navigator.clipboard.writeText(props.children.trim());
    message.success(contextLocale.value.copySuccess);
  } catch (e) {
    console.error('Failed to copy code:', e);
  }
}

const highlightedCode = ref<string>('');

async function registerLanguage(lang: string) {
  if (!lang || hljs.getLanguage(lang)) return;
  try {
    const mod = await import(/* @vite-ignore */ `highlight.js/lib/languages/${lang}`);
    hljs.registerLanguage(lang, mod.default);
  } catch {
    /* unknown language – fall back to auto */
  }
}

watchEffect(async () => {
  const text = props.children || '';
  const lang = props.lang;
  if (!text) {
    highlightedCode.value = '';
    return;
  }
  const normalized = text.replace(/\n$/, '');
  if (lang) {
    await registerLanguage(lang);
    const lg = hljs.getLanguage(lang);
    if (lg) {
      highlightedCode.value = hljs.highlight(normalized, {
        language: lang,
        ignoreIllegals: true,
      }).value;
      return;
    }
  }
  highlightedCode.value = hljs.highlightAuto(normalized).value;
});
</script>

<template>
  <code v-if="children && !lang">{{ children }}</code>
  <div
    v-else-if="children && lang"
    :class="rootCls"
    :style="{ ...style, ...styles?.root }"
  >
    <component :is="header" v-if="header" />
    <div
      v-else-if="header !== null"
      :class="headerCls"
      :style="headerStyle"
    >
      <span :class="headerTitleCls" :style="styles?.headerTitle">{{ lang }}</span>
      <button type="button" :class="`${prefixCls}-copy-btn`" :style="copyStyle" @click="handleCopyCode">
        {{ contextLocale.copy }}
      </button>
    </div>
    <div :class="codeBoxCls" :style="codeStyle">
      <pre><code :class="`language-${lang}`" v-html="highlightedCode || (children || '').replace(/\n$/, '')" /></pre>
    </div>
  </div>
</template>

<style scoped>
:deep([class$='-highlightCode-header']) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
}
:deep([class*='-highlightCode-code']) {
  border: 1px solid transparent;
  border-top: none;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  overflow: auto;
}
:deep([class$='-highlightCode-code-dark'] .hljs),
:deep([class$='-highlightCode-code-dark'] .hljs-subst) {
  color: #abb2bf;
  background: transparent;
}
:deep([class$='-highlightCode-code-dark'] .hljs-comment),
:deep([class$='-highlightCode-code-dark'] .hljs-quote) {
  color: #5c6370;
}
:deep([class$='-highlightCode-code-dark'] .hljs-doctag),
:deep([class$='-highlightCode-code-dark'] .hljs-keyword),
:deep([class$='-highlightCode-code-dark'] .hljs-formula) {
  color: #c678dd;
}
:deep([class$='-highlightCode-code-dark'] .hljs-string),
:deep([class$='-highlightCode-code-dark'] .hljs-regexp),
:deep([class$='-highlightCode-code-dark'] .hljs-addition),
:deep([class$='-highlightCode-code-dark'] .hljs-attribute) {
  color: #98c379;
}
:deep([class$='-highlightCode-code-dark'] .hljs-number),
:deep([class$='-highlightCode-code-dark'] .hljs-attr),
:deep([class$='-highlightCode-code-dark'] .hljs-variable) {
  color: #d19a66;
}
:deep([class$='-highlightCode-code-dark'] .hljs-title),
:deep([class$='-highlightCode-code-dark'] .hljs-section),
:deep([class$='-highlightCode-code-dark'] .hljs-name) {
  color: #61aeee;
}
:deep([class*='-highlightCode-code']) pre,
:deep([class*='-highlightCode-code']) code {
  white-space: pre;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  background: transparent !important;
  color: inherit;
  padding: 12px !important;
  line-height: 1.7;
  border-radius: 0;
}
:deep([class*='-highlightCode-code']:not([class*='-code-dark']) .hljs-keyword) {
  color: #a626a4;
}
:deep([class*='-highlightCode-code']:not([class*='-code-dark']) .hljs-string) {
  color: #50a14f;
}
:deep([class*='-highlightCode-code']:not([class*='-code-dark']) .hljs-number) {
  color: #986801;
}
:deep([class*='-highlightCode-code']:not([class*='-code-dark']) .hljs-title),
:deep([class*='-highlightCode-code']:not([class*='-code-dark']) .hljs-section) {
  color: #4078f2;
}
:deep([class*='-highlightCode-code']:not([class*='-code-dark']) .hljs-comment) {
  color: #a0a1a7;
}
:deep([class$='-highlightCode-copy-btn']) {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 12px;
}
:deep([class$='-highlightCode-copy-btn']:hover) {
  color: var(--ant-color-text, inherit);
}
</style>
