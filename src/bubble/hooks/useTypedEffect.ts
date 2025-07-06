import useState from '../../_util/hooks/use-state';
import { computed, unref, watch } from 'vue';
import type { Ref, VNode } from 'vue'

function isString(str: any): str is string {
  return typeof str === 'string';
}

/**
 * Return typed content and typing status when typing is enabled.
 * Or return content directly.
 */
const useTypedEffect = (
  content: Ref<VNode | object | string>,
  typingEnabled: Ref<boolean>,
  typingStep: Ref<number>,
  typingInterval: Ref<number>,
): [typedContent: Ref<VNode | object | string>, isTyping: Ref<boolean>] => {
  const [prevContent, setPrevContent] = useState<VNode | object | string>('');
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
  });

  // Start typing
  watch([typingIndex, typingEnabled, content], (_, __, onCleanup) => {
    if (mergedTypingEnabled.value && isString(content.value) && unref(typingIndex) < content.value.length) {
      const id = setTimeout(() => {
        setTypingIndex(unref(typingIndex) + typingStep.value);
      }, typingInterval.value);

      onCleanup(() => {
        clearTimeout(id); 
      });
    }
  }, { immediate: true });

  const mergedTypingContent = computed(() => mergedTypingEnabled.value && isString(content.value) ? content.value.slice(0, unref(typingIndex)) : content.value);

  return [mergedTypingContent, computed(() => mergedTypingEnabled.value && isString(content.value) && unref(typingIndex) < content.value.length)];
};

export default useTypedEffect;
