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

function splitStream() {
  let buffer = '';

  return new TransformStream<string, string>({
    transform(streamChunk, controller) {
      buffer += streamChunk;
      const parts = buffer.split(DEFAULT_STREAM_SEPARATOR);
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

function splitPart() {
  return new TransformStream<string, SSEOutput>({
    transform(partChunk, controller) {
      const lines = partChunk.split(DEFAULT_PART_SEPARATOR);

      const sseEvent = lines.reduce<SSEOutput>((acc, line) => {
        const separatorIndex = line.indexOf(DEFAULT_KV_SEPARATOR);

        if (separatorIndex === -1) {
          throw new Error(
            `The key-value separator "${DEFAULT_KV_SEPARATOR}" is not found in the sse line chunk!`,
          );
        }

        const key = line.slice(0, separatorIndex);

        if (!isValidString(key)) return acc;

        const value = line.slice(separatorIndex + 1);

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
}

export type XReadableStream<R = SSEOutput> = ReadableStream<R> & AsyncGenerator<R>;

/**
 * @description Transform Uint8Array binary stream to {@link SSEOutput} by default.
 * Only supports utf-8 encoding for now.
 */
function XStream<Output = SSEOutput>(options: XStreamOptions<Output>) {
  const { readableStream, transformStream } = options;

  if (!(readableStream instanceof ReadableStream)) {
    throw new Error('The options.readableStream must be an instance of ReadableStream.');
  }

  const decoderStream = new TextDecoderStream();

  const stream = (
    transformStream
      ? readableStream
          .pipeThrough(decoderStream as TransformStream<Uint8Array, string>)
          .pipeThrough(transformStream)
      : readableStream
          .pipeThrough(decoderStream as TransformStream<Uint8Array, string>)
          .pipeThrough(splitStream())
          .pipeThrough(splitPart())
  ) as XReadableStream<Output>;

  stream[Symbol.asyncIterator] = async function* () {
    const reader = this.getReader();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value) continue;
      yield value;
    }
  };

  return stream;
}

export default XStream;
