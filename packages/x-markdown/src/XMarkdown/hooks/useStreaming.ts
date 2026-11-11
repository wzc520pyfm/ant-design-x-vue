import { ref, computed, watch, type Ref } from 'vue';
import type { StreamStatus, StreamingOption, XMarkdownProps } from '../interface';
import { StreamingProcessor, type StreamingResult } from './streamingCore';

export type { StreamCache, StreamingConfig, StreamingResult } from './streamingCore';
export { DEFAULT_MIN_SECTION_CHARS, StreamingProcessor, processStreamingMarkdown } from './streamingCore';

/* ------------ Public composable ------------ */

export interface UseStreamingOptions {
  /** Reactive raw markdown source. */
  content: Ref<string>;
  /** Simple boolean streaming flag (legacy API). */
  streaming?: Ref<boolean>;
  /**
   * Full streaming option – drives incremental buffering / incompleteMarkdown /
   * section splitting. Prefer passing the resolved object from `resolveStreaming`.
   */
  streamingOption?: Ref<StreamingOption | undefined>;
  /** Custom components map (used by incremental section boundary guards). */
  components?: Ref<XMarkdownProps['components'] | undefined>;
  /** Callback when streaming finishes. */
  onComplete?: () => void;
}

export interface UseStreamingReturn {
  displayedContent: Ref<string>;
  /** Section slices when `incremental` is on; otherwise null. */
  sections: Ref<string[] | null>;
  status: Ref<StreamStatus>;
  isStreaming: Ref<boolean>;
}

/**
 * useStreaming - Composable for handling streaming markdown content.
 *
 * Aligns with React `@ant-design/x-markdown@2.10` streaming core:
 * incomplete token buffering, `incompleteMarkdown: 'complete'`, and
 * optional `incremental` section splitting.
 */
export function useStreaming(options: UseStreamingOptions): UseStreamingReturn {
  const { content, streaming, streamingOption, components, onComplete } = options;

  const displayedContent = ref('');
  const sections = ref<string[] | null>(null);
  const status = ref<StreamStatus>('idle');

  const resolvedStreaming = computed<StreamingOption | boolean | undefined>(() => {
    if (streamingOption?.value) return streamingOption.value;
    if (streaming) return streaming.value;
    return undefined;
  });

  const enableCache = computed(() => {
    const s = resolvedStreaming.value;
    if (typeof s === 'object' && s) return !!s.hasNextChunk;
    return !!s;
  });

  const isStreaming = computed(() => {
    if (enableCache.value) return true;
    const s = resolvedStreaming.value;
    if (typeof s === 'boolean') return s;
    return !!s;
  });

  const processor = new StreamingProcessor();

  const applyResult = (result: StreamingResult) => {
    displayedContent.value = result.output;
    sections.value = result.sections;
  };

  watch(
    [content, resolvedStreaming, () => components?.value],
    ([newContent]) => {
      processor.setConfig({
        streaming: resolvedStreaming.value,
        components: components?.value,
      });

      if (typeof newContent !== 'string') {
        console.error(
          `X-Markdown: input must be string, not ${typeof newContent}.`,
        );
        displayedContent.value = '';
        sections.value = null;
        return;
      }

      const result = processor.process(newContent);
      applyResult(result);

      if (enableCache.value) {
        status.value = 'streaming';
      } else if (isStreaming.value) {
        status.value = 'streaming';
      } else if (newContent) {
        status.value = 'complete';
        onComplete?.();
      }
    },
    { immediate: true },
  );

  watch(isStreaming, (value) => {
    if (!value && status.value === 'streaming') {
      status.value = 'complete';
      onComplete?.();
    }
  });

  return {
    displayedContent,
    sections,
    status,
    isStreaming,
  };
}
