import type { StreamingOption, XMarkdownProps } from '../interface';

/**
 * The preset behind `streaming={true}` / `streaming={false}`: every streaming
 * capability that needs no per-app configuration, switched on. The boolean is
 * `hasNextChunk`, so callers can pass their own "is the answer still
 * streaming" flag straight through.
 *
 * Align with @ant-design/x-markdown@2.10.0 `utils/streaming.ts`.
 */
const PRESET: Omit<StreamingOption, 'hasNextChunk'> = {
  incremental: true,
  incompleteMarkdown: 'complete',
  typewriter: true,
  // No tail cursor: it is a visual choice for the app (`tail: true` in object form).
};

const STREAMING_ON: StreamingOption = Object.freeze({ ...PRESET, hasNextChunk: true });
const STREAMING_OFF: StreamingOption = Object.freeze({ ...PRESET, hasNextChunk: false });

/**
 * Normalise the `streaming` prop. Objects pass through untouched; booleans
 * expand to the preset.
 */
export const resolveStreaming = (
  streaming: XMarkdownProps['streaming'],
): StreamingOption | undefined => {
  if (streaming === true) return STREAMING_ON;
  if (streaming === false) return STREAMING_OFF;
  return streaming;
};

export { PRESET, STREAMING_ON, STREAMING_OFF };
