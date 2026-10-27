<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { AnimationConfig } from './interface';

defineOptions({
  name: 'AnimationText',
});

const props = defineProps<{
  /**
   * Text content. Newly appended slices fade in.
   */
  text?: string;
  /**
   * Alias of `text`, kept for earlier call sites.
   */
  content?: string;
  animationConfig?: AnimationConfig;
}>();

const source = computed(() => props.text ?? props.content ?? '');
const chunks = ref<string[]>([]);
const previous = ref('');

watch(
  source,
  (text) => {
    if (text === previous.value) return;

    if (!(previous.value && text.indexOf(previous.value) === 0)) {
      chunks.value = text ? [text] : [];
      previous.value = text;
      return;
    }

    const next = text.slice(previous.value.length);
    if (!next) return;
    chunks.value = [...chunks.value, next];
    previous.value = text;
  },
  { immediate: true },
);

const animationStyle = computed(() => {
  const fadeDuration = props.animationConfig?.fadeDuration ?? 200;
  const easing = props.animationConfig?.easing ?? 'ease-in-out';
  return {
    animation: `x-markdown-fade-in ${fadeDuration}ms ${easing} forwards`,
  };
});
</script>

<template>
  <span
    v-for="(chunk, index) in chunks"
    :key="index"
    class="x-markdown-animation-text"
    :style="animationStyle"
  >{{ chunk }}</span>
</template>

<style>
@keyframes x-markdown-fade-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
</style>
