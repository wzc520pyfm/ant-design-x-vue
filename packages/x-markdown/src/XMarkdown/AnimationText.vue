<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue';

defineOptions({
  name: 'AnimationText',
});

interface Props {
  /**
   * Text content to animate
   */
  content?: string;
  
  /**
   * Animation speed (characters per frame)
   */
  speed?: number;
  
  /**
   * Whether animation is enabled
   */
  animated?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  content: '',
  speed: 1,
  animated: true,
});

const emit = defineEmits<{
  (e: 'complete'): void;
}>();

const displayedText = ref('');
const isAnimating = ref(false);
let animationFrame: number | null = null;

const startAnimation = () => {
  if (!props.animated || !props.content) {
    displayedText.value = props.content || '';
    return;
  }

  isAnimating.value = true;
  let index = 0;

  const animate = () => {
    if (index < props.content.length) {
      displayedText.value = props.content.slice(0, index + props.speed);
      index += props.speed;
      animationFrame = requestAnimationFrame(animate);
    } else {
      isAnimating.value = false;
      emit('complete');
    }
  };

  animate();
};

watch(
  () => props.content,
  () => {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
    displayedText.value = '';
    startAnimation();
  },
  { immediate: true }
);

onUnmounted(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
  }
});
</script>

<template>
  <span class="animation-text">{{ displayedText }}</span>
</template>
