<script setup lang="tsx">
import { computed, toRef } from 'vue';
import { useTyping } from './hooks/useTyping';
import type { BubbleAnimationOption, BubbleProps } from './interface';

defineOptions({ name: 'AXTypingContent' });

const props = defineProps<{
  prefixCls: string;
  streaming: boolean;
  content: string;
  typing: true | BubbleAnimationOption;
  onTyping?: BubbleProps['onTyping'];
  onTypingComplete?: BubbleProps['onTypingComplete'];
}>();

const { renderedData, animating, memoedAnimationCfg } = useTyping({
  streaming: toRef(() => props.streaming),
  content: toRef(() => props.content),
  typing: toRef(() => props.typing),
  onTyping: props.onTyping,
  onTypingComplete: props.onTypingComplete,
});

const effect = computed(() => memoedAnimationCfg.value.effect);

const elements = computed(() => {
  return renderedData.value.map((item) =>
    effect.value === 'fade-in' && !item.done ? (
      <span key={item.id} class="fade-in">
        {item.text}
      </span>
    ) : (
      item.text
    ),
  );
});

const isTyping = computed(() => (props.typing === true ? false : effect.value === 'typing'));

defineRender(() => {
  return (
    <div
      class={{
        [`${props.prefixCls}-typing`]: isTyping.value && animating.value,
        [`${props.prefixCls}-fade-in`]: !isTyping.value,
      }}
    >
      {elements.value}
    </div>
  );
});
</script>
