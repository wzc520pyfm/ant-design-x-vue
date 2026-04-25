import { ref, computed, watch, type Ref } from 'vue';
import {
  StreamCacheTokenType,
  type StreamStatus,
  type StreamingOption,
} from '../interface';

/* ------------ Type ------------ */

export interface StreamCache {
  pending: string;
  token: StreamCacheTokenType;
  processedLength: number;
  completeMarkdown: string;
}

interface Recognizer {
  tokenType: StreamCacheTokenType;
  isStartOfToken: (markdown: string) => boolean;
  isStreamingValid: (markdown: string) => boolean;
}

/* ------------ Constants ------------ */
const FENCED_CODE_REGEX = /^(`{3,}|~{3,})/;

// Validates whether a token is still incomplete in the streaming context.
// Returns true if the token is syntactically incomplete; false if complete/invalid.
const STREAM_INCOMPLETE_REGEX = {
  image: [/^!\[[^\]\r\n]{0,1000}$/, /^!\[[^\r\n]{0,1000}\]\(*[^)\r\n]{0,1000}$/],
  link: [/^\[[^\]\r\n]{0,1000}$/, /^\[[^\r\n]{0,1000}\]\(*[^)\r\n]{0,1000}$/],
  html: [/^<\/$/, /^<\/?[a-zA-Z][a-zA-Z0-9-]{0,100}[^>\r\n]{0,1000}$/],
  commonEmphasis: [/^(\*{1,3}|_{1,3})(?!\s)(?!.*\1$)[^\r\n]{0,1000}$/],
  list: [/^[-+*]\s{0,3}$/, /^[-+*]\s{1,3}(\*{1,3}|_{1,3})(?!\s)(?!.*\1$)[^\r\n]{0,1000}$/],
} as const;

const isTableInComplete = (markdown: string) => {
  if (markdown.includes('\n\n')) return false;

  const lines = markdown.split('\n');
  if (lines.length <= 1) return true;

  const [header, separator] = lines;
  const trimmedHeader = header.trim();
  if (!/^\|.*\|$/.test(trimmedHeader)) return false;

  const trimmedSeparator = separator.trim();
  const columns = trimmedSeparator
    .split('|')
    .map((col) => col.trim())
    .filter(Boolean);

  const separatorRegex = /^:?-+:?$/;
  return columns.every((col, index) =>
    index === columns.length - 1
      ? col === ':' || separatorRegex.test(col)
      : separatorRegex.test(col),
  );
};

const tokenRecognizerMap: Partial<Record<StreamCacheTokenType, Recognizer>> = {
  [StreamCacheTokenType.Link]: {
    tokenType: StreamCacheTokenType.Link,
    isStartOfToken: (markdown) => markdown.startsWith('['),
    isStreamingValid: (markdown) =>
      STREAM_INCOMPLETE_REGEX.link.some((re) => re.test(markdown)),
  },
  [StreamCacheTokenType.Image]: {
    tokenType: StreamCacheTokenType.Image,
    isStartOfToken: (markdown) => markdown.startsWith('!'),
    isStreamingValid: (markdown) =>
      STREAM_INCOMPLETE_REGEX.image.some((re) => re.test(markdown)),
  },
  [StreamCacheTokenType.Html]: {
    tokenType: StreamCacheTokenType.Html,
    isStartOfToken: (markdown) => markdown.startsWith('<'),
    isStreamingValid: (markdown) =>
      STREAM_INCOMPLETE_REGEX.html.some((re) => re.test(markdown)),
  },
  [StreamCacheTokenType.Emphasis]: {
    tokenType: StreamCacheTokenType.Emphasis,
    isStartOfToken: (markdown) =>
      markdown.startsWith('*') || markdown.startsWith('_'),
    isStreamingValid: (markdown) =>
      STREAM_INCOMPLETE_REGEX.commonEmphasis.some((re) => re.test(markdown)),
  },
  [StreamCacheTokenType.List]: {
    tokenType: StreamCacheTokenType.List,
    isStartOfToken: (markdown) => /^[-+*]/.test(markdown),
    isStreamingValid: (markdown) =>
      STREAM_INCOMPLETE_REGEX.list.some((re) => re.test(markdown)),
  },
  [StreamCacheTokenType.Table]: {
    tokenType: StreamCacheTokenType.Table,
    isStartOfToken: (markdown) => markdown.startsWith('|'),
    isStreamingValid: isTableInComplete,
  },
};

const commitCache = (cache: StreamCache): void => {
  if (cache.pending) {
    cache.completeMarkdown += cache.pending;
    cache.pending = '';
  }
  cache.token = StreamCacheTokenType.Text;
};

const recognize = (cache: StreamCache, tokenType: StreamCacheTokenType): void => {
  const recognizer = tokenRecognizerMap[tokenType];
  if (!recognizer) return;

  const { token, pending } = cache;
  if (token === StreamCacheTokenType.Text && recognizer.isStartOfToken(pending)) {
    cache.token = tokenType;
    return;
  }

  if (token === tokenType && !recognizer.isStreamingValid(pending)) {
    commitCache(cache);
  }
};

const recognizeHandlers = Object.values(tokenRecognizerMap).map((rec) => ({
  tokenType: rec.tokenType,
  recognize: (cache: StreamCache) => recognize(cache, rec.tokenType),
}));

/* ------------ Utils ------------ */
const getInitialCache = (): StreamCache => ({
  pending: '',
  token: StreamCacheTokenType.Text,
  processedLength: 0,
  completeMarkdown: '',
});

const isInCodeBlock = (text: string): boolean => {
  const lines = text.split('\n');
  let inFenced = false;
  let fenceChar = '';
  let fenceLen = 0;

  for (const rawLine of lines) {
    const line = rawLine.endsWith('\r') ? rawLine.slice(0, -1) : rawLine;

    const fenceMatch = line.match(FENCED_CODE_REGEX);
    if (fenceMatch) {
      const currentFence = fenceMatch[1];
      const char = currentFence[0];
      const len = currentFence.length;

      if (!inFenced) {
        inFenced = true;
        fenceChar = char;
        fenceLen = len;
      } else if (char === fenceChar && len >= fenceLen) {
        inFenced = false;
        fenceChar = '';
        fenceLen = 0;
      }
    }
  }

  return inFenced;
};

const handleIncompleteMarkdown = (
  cache: StreamCache,
  incompleteMarkdownComponentMap?: StreamingOption['incompleteMarkdownComponentMap'],
): string | undefined => {
  const { token, pending } = cache;
  if (token === StreamCacheTokenType.Text) return;

  const componentMap = (incompleteMarkdownComponentMap || {}) as Record<string, string>;
  const encodedPending = encodeURIComponent(pending);
  switch (token) {
    case StreamCacheTokenType.Image:
      return pending === '!'
        ? undefined
        : `<${componentMap.image || 'incomplete-image'} data-raw="${encodedPending}" />`;
    case StreamCacheTokenType.Table:
      return pending.split('\n').length <= 2
        ? `<${componentMap.table || 'incomplete-table'} data-raw="${encodedPending}" />`
        : pending;
    default:
      return `<${componentMap[token] || `incomplete-${token}`} data-raw="${encodedPending}" />`;
  }
};

/* ------------ Public composable ------------ */

export interface UseStreamingOptions {
  /** Reactive raw markdown source. */
  content: Ref<string>;
  /** Simple boolean streaming flag (legacy API). */
  streaming?: Ref<boolean>;
  /** Full streaming option – drives incremental buffering. */
  streamingOption?: Ref<StreamingOption | undefined>;
  /** Callback when streaming finishes. */
  onComplete?: () => void;
}

export interface UseStreamingReturn {
  displayedContent: Ref<string>;
  status: Ref<StreamStatus>;
  isStreaming: Ref<boolean>;
}

/**
 * useStreaming - Composable for handling streaming markdown content.
 * When `streamingOption.hasNextChunk` is true, the composable buffers
 * incomplete markdown tokens (links, images, tables, emphasis, etc.) so the
 * consumer never renders half-parsed syntax.
 */
export function useStreaming(options: UseStreamingOptions): UseStreamingReturn {
  const { content, streaming, streamingOption, onComplete } = options;

  const displayedContent = ref('');
  const status = ref<StreamStatus>('idle');

  const enableCache = computed(() => !!streamingOption?.value?.hasNextChunk);
  const incompleteMap = computed(
    () => streamingOption?.value?.incompleteMarkdownComponentMap,
  );

  const isStreaming = computed(() => {
    if (enableCache.value) return true;
    return streaming?.value ?? false;
  });

  let cache: StreamCache = getInitialCache();

  const processStreaming = (text: string): void => {
    if (!text) {
      displayedContent.value = '';
      cache = getInitialCache();
      return;
    }

    const expectedPrefix = cache.completeMarkdown + cache.pending;
    if (!text.startsWith(expectedPrefix)) {
      cache = getInitialCache();
    }

    const chunk = text.slice(cache.processedLength);
    if (chunk) {
      cache.processedLength += chunk.length;
      const isTextInBlock = isInCodeBlock(text);
      for (const char of chunk) {
        cache.pending += char;
        if (isTextInBlock) {
          commitCache(cache);
          continue;
        }

        if (cache.token === StreamCacheTokenType.Text) {
          for (const handler of recognizeHandlers) handler.recognize(cache);
        } else {
          const handler = recognizeHandlers.find((h) => h.tokenType === cache.token);
          handler?.recognize(cache);
        }

        if (cache.token === StreamCacheTokenType.Text) {
          commitCache(cache);
        }
      }
    }

    const placeholder = handleIncompleteMarkdown(cache, incompleteMap.value);
    displayedContent.value = cache.completeMarkdown + (placeholder || '');
  };

  watch(
    [content, enableCache],
    ([newContent, cacheEnabled]) => {
      if (typeof newContent !== 'string') {
        console.error(
          `X-Markdown: input must be string, not ${typeof newContent}.`,
        );
        displayedContent.value = '';
        return;
      }

      if (cacheEnabled) {
        processStreaming(newContent);
        status.value = 'streaming';
      } else {
        displayedContent.value = newContent;
        if (isStreaming.value) {
          status.value = 'streaming';
        } else if (newContent) {
          status.value = 'complete';
          onComplete?.();
        }
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
    status,
    isStreaming,
  };
}
