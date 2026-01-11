import { ref, computed, watch } from 'vue';
import type { Ref } from 'vue';
import type { StreamStatus } from '../interface';

export interface UseStreamingOptions {
  /**
   * Content to stream
   */
  content: Ref<string>;
  
  /**
   * Whether streaming is active
   */
  streaming?: Ref<boolean>;
  
  /**
   * Callback when streaming completes
   */
  onComplete?: () => void;
}

export interface UseStreamingReturn {
  /**
   * Current displayed content
   */
  displayedContent: Ref<string>;
  
  /**
   * Current stream status
   */
  status: Ref<StreamStatus>;
  
  /**
   * Whether streaming is in progress
   */
  isStreaming: Ref<boolean>;
}

/**
 * useStreaming - Composable for handling streaming markdown content
 */
export function useStreaming(options: UseStreamingOptions): UseStreamingReturn {
  const { content, streaming, onComplete } = options;

  const displayedContent = ref('');
  const status = ref<StreamStatus>('idle');

  const isStreaming = computed(() => streaming?.value ?? false);

  watch(
    content,
    (newContent) => {
      displayedContent.value = newContent;
      
      if (isStreaming.value) {
        status.value = 'streaming';
      } else if (newContent) {
        status.value = 'complete';
        onComplete?.();
      }
    },
    { immediate: true }
  );

  watch(
    isStreaming,
    (isStreamingValue) => {
      if (!isStreamingValue && status.value === 'streaming') {
        status.value = 'complete';
        onComplete?.();
      }
    }
  );

  return {
    displayedContent,
    status,
    isStreaming,
  };
}
