<script setup lang="ts">
import { computed, ref, watchEffect, type CSSProperties, type VNode } from 'vue';
import classnames from 'classnames';
import hljs from 'highlight.js/lib/core';
import { message } from 'ant-design-vue';
import { useLocale, useXProviderContext } from '@ant-design-x-vue/components';
import 'highlight.js/styles/atom-one-light.css';

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
const codeBoxCls = computed(() => classnames(`${prefixCls.value}-code`, props.classNames?.code));

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
      :style="styles?.header"
    >
      <span :class="headerTitleCls" :style="styles?.headerTitle">{{ lang }}</span>
      <button type="button" :class="`${prefixCls}-copy-btn`" @click="handleCopyCode">
        {{ contextLocale.copy }}
      </button>
    </div>
    <div :class="codeBoxCls" :style="styles?.code">
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
  background: rgba(0, 0, 0, 0.04);
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
}
:deep([class$='-highlightCode-code']) {
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-top: none;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  overflow: auto;
  background: #fff;
}
:deep([class$='-highlightCode-code']) pre,
:deep([class$='-highlightCode-code']) code {
  white-space: pre;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  background: transparent !important;
  padding: 12px !important;
  line-height: 1.7;
  border-radius: 0;
}
:deep([class$='-highlightCode-copy-btn']) {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.65);
}
:deep([class$='-highlightCode-copy-btn']:hover) {
  color: rgba(0, 0, 0, 0.88);
}
</style>
