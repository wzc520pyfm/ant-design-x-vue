/**
 * @description default separator for {@link splitStream}
 */
const DEFAULT_STREAM_SEPARATOR = '\n\n';
/**
 * @description Default separator for {@link splitPart}
 * @example "event: delta\ndata: {\"key\": \"value\"}"
 */
const DEFAULT_PART_SEPARATOR = '\n';
/**
 * @description Default separator for key value, A colon (`:`) is used to separate keys from values
 * @example "event: delta"
 */
const DEFAULT_KV_SEPARATOR = ':';

const isValidString = (str: string) => (str ?? '').trim() !== '';

function splitStream(streamSeparator = DEFAULT_STREAM_SEPARATOR) {
  let buffer = '';

  return new TransformStream<string, string>({
    transform(streamChunk, controller) {
      buffer += streamChunk;
      const parts = buffer.split(streamSeparator);
      parts.slice(0, -1).forEach((part) => {
        if (isValidString(part)) {
          controller.enqueue(part);
        }
      });
      buffer = parts[parts.length - 1];
    },
    flush(controller) {
      if (isValidString(buffer)) {
        controller.enqueue(buffer);
      }
    },
  });
}

/**
 * @link https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#fields
 */
export type SSEFields = 'data' | 'event' | 'id' | 'retry';

export type SSEOutput = Partial<Record<SSEFields, any>>;

export interface JSONOutPut extends Partial<Record<SSEFields, any>> {
  success: boolean;
  message?: string;
  name?: string;
}

function splitPart(
  partSeparator = DEFAULT_PART_SEPARATOR,
  kvSeparator = DEFAULT_KV_SEPARATOR,
) {
  return new TransformStream<string, SSEOutput>({
    transform(partChunk, controller) {
      const lines = partChunk.split(partSeparator);

      const sseEvent = lines.reduce<SSEOutput>((acc, line) => {
        // A trailing newline inside an event yields a blank line, which carries
        // no field and must not be reported as a missing separator.
        if (!isValidString(line)) return acc;

        const separatorIndex = line.indexOf(kvSeparator);

        if (separatorIndex === -1) {
          console.warn(
            `The key-value separator "${kvSeparator}" is not found in the sse line: ${line} !`,
          );
          return acc;
        }

        const key = line.slice(0, separatorIndex).trim();

        if (!isValidString(key)) return acc;

        const value = line.slice(separatorIndex + 1).trim();

        return { ...acc, [key]: value };
      }, {});

      if (Object.keys(sseEvent).length === 0) return;

      controller.enqueue(sseEvent);
    },
  });
}

export interface XStreamOptions<Output> {
  /**
   * @description Readable stream of binary data
   */
  readableStream: ReadableStream<Uint8Array>;
  /**
   * @description Support customizable transformStream to transform streams
   * @default sseTransformStream
   */
  transformStream?: TransformStream<string, Output>;
  /**
   * @description Separator between stream events
   * @default "\n\n"
   */
  streamSeparator?: string;
  /**
   * @description Separator between fields in one stream event
   * @default "\n"
   */
  partSeparator?: string;
  /**
   * @description Separator between a field name and its value
   * @default ":"
   */
  kvSeparator?: string;
}

export type XReadableStream<R = SSEOutput> = ReadableStream<R> & AsyncGenerator<R>;

function createDecoderStream() {
  if (typeof TextDecoderStream !== 'undefined') {
    return new TextDecoderStream();
  }

  const decoder = new TextDecoder('utf-8');
  return new TransformStream<Uint8Array, string>({
    transform(chunk, controller) {
      controller.enqueue(decoder.decode(chunk, { stream: true }));
    },
    flush(controller) {
      controller.enqueue(decoder.decode());
    },
  });
}

/**
 * @description Transform Uint8Array binary stream to {@link SSEOutput} by default.
 * Only supports utf-8 encoding for now.
 */
function XStream<Output = SSEOutput>(options: XStreamOptions<Output>) {
  const { readableStream, transformStream, streamSeparator, partSeparator, kvSeparator } = options;

  if (!(readableStream instanceof ReadableStream)) {
    throw new Error('The options.readableStream must be an instance of ReadableStream.');
  }

  const decoderStream = createDecoderStream();

  const stream = (
    transformStream
      ? readableStream
          .pipeThrough(decoderStream as TransformStream<Uint8Array, string>)
          .pipeThrough(transformStream)
      : readableStream
          .pipeThrough(decoderStream as TransformStream<Uint8Array, string>)
          .pipeThrough(splitStream(streamSeparator))
          .pipeThrough(splitPart(partSeparator, kvSeparator))
  ) as XReadableStream<Output>;

  stream[Symbol.asyncIterator] = async function* () {
    const reader = this.getReader();

    let completed = false;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          completed = true;
          break;
        }
        if (!value) continue;
        yield value;
      }
    } finally {
      if (!completed) {
        reader.cancel().catch(() => {});
      }
      reader.releaseLock();
    }
  };

  return stream;
}

export default XStream;
