import useState from '../../_util/hooks/use-state';
import { computed, onWatcherCleanup, unref, watch } from 'vue';
import type { Ref } from 'vue'
import type { BubbleContentType } from '../interface';

function isString(str: any): str is string {
  return typeof str === 'string';
}

/**
 * Return typed content and typing status when typing is enabled.
 * Or return content directly.
 */
const useTypedEffect = (
  content: Ref<BubbleContentType>,
  typingEnabled: Ref<boolean>,
  typingStep: Ref<number>,
  typingInterval: Ref<number>,
): [typedContent: Ref<BubbleContentType>, isTyping: Ref<boolean>] => {
  const [prevContent, setPrevContent] = useState<BubbleContentType>('');
  const [typingIndex, setTypingIndex] = useState<number>(1);

  const mergedTypingEnabled = computed(() => typingEnabled.value && isString(content.value));

  // Reset typing index when content changed
  watch(content, () => {
    const prevContentValue = unref(prevContent);
    setPrevContent(content.value);
    if (!mergedTypingEnabled.value && isString(content.value)) {
      setTypingIndex(content.value.length);
    } else if (isString(content.value) && isString(prevContentValue) && content.value.indexOf(prevContentValue) !== 0) {
      setTypingIndex(1);
    }
  }, { immediate: true });

  // Start typing
  watch([typingIndex, typingEnabled, content], () => {
    if (mergedTypingEnabled.value && isString(content.value) && unref(typingIndex) < content.value.length) {
      const id = setTimeout(() => {
        setTypingIndex(unref(typingIndex) + typingStep.value);
      }, typingInterval.value);

      onWatcherCleanup(() => {
        clearTimeout(id);
      });
    }
  }, { immediate: true });

  const mergedTypingContent = computed(() => mergedTypingEnabled.value && isString(content.value) ? content.value.slice(0, unref(typingIndex)) : content.value);

  return [mergedTypingContent, computed(() => mergedTypingEnabled.value && isString(content.value) && unref(typingIndex) < content.value.length)];
};

export default useTypedEffect;
