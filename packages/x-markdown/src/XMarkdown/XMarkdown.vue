<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { XMarkdownProps } from './interface';
import { parseMarkdown } from './core';
import DOMPurify from 'dompurify';

defineOptions({
  name: 'XMarkdown',
});

const props = withDefaults(defineProps<XMarkdownProps>(), {
  streaming: false,
});

const emit = defineEmits<{
  (e: 'update:content', value: string): void;
}>();

const htmlContent = computed(() => {
  if (!props.content) return '';
  const parsed = parseMarkdown(props.content);
  return DOMPurify.sanitize(parsed);
});
</script>

<template>
  <div class="x-markdown" v-html="htmlContent" />
</template>

<style>
.x-markdown {
  line-height: 1.6;
}

.x-markdown pre {
  background-color: #f5f5f5;
  padding: 16px;
  border-radius: 4px;
  overflow-x: auto;
}

.x-markdown code {
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
}

.x-markdown p {
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
</style>
