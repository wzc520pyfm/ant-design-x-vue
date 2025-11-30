import useState from '../../_util/hooks/use-state';
import { computed, onWatcherCleanup, unref, watch } from 'vue';
import type { Ref } from 'vue'
import type { BubbleContentType } from '../interface';

function isString(str: any): str is string {
  return typeof str === 'string';
}

/**
 * Find the longest common prefix between two strings
 */
function findCommonPrefix(str1: string, str2: string): number {
  let i = 0;
  const minLength = Math.min(str1.length, str2.length);

  while (i < minLength && str1[i] === str2[i]) {
    i++;
  }

  return i;
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
      // Handle empty strings
      if (!content.value || !prevContentValue) {
        setTypingIndex(1);
        return;
      }

      // Find the longest common prefix between new and old content
      const commonPrefixLength = findCommonPrefix(content.value, prevContentValue);

      // If there's no common prefix, start from beginning
      // If there's a common prefix, start from the point where they differ
      if (commonPrefixLength === 0) {
        // Scenario 1: No common prefix, start from the beginning (AI completely changes the thinking process of the answer).
        setTypingIndex(1);
      } else {
        // Scenario 2: There is a common prefix, start from the point where they differ (common streaming output scenario)
        setTypingIndex(commonPrefixLength + 1);
      }
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
