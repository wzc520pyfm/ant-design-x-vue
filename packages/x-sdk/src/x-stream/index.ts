export interface SSEFields {
  event?: string;
  data?: string;
  id?: string;
  retry?: number;
}

export interface SSEOutput {
  event?: string;
  data: string;
  id?: string;
}

export interface XStreamOptions {
  readableStream: ReadableStream<Uint8Array>;
}

/**
 * XStream - Utility for parsing Server-Sent Events (SSE) streams
 * TODO: Implement full functionality
 */
export class XStream {
  private reader: ReadableStreamDefaultReader<Uint8Array>;
  private decoder: TextDecoder;
  private buffer: string = '';

  constructor(options: XStreamOptions) {
    this.reader = options.readableStream.getReader();
    this.decoder = new TextDecoder();
  }

  async *[Symbol.asyncIterator](): AsyncGenerator<SSEOutput, void, unknown> {
    try {
      while (true) {
        const { done, value } = await this.reader.read();

        if (done) {
          break;
        }

        this.buffer += this.decoder.decode(value, { stream: true });

        const lines = this.buffer.split('\n');
        this.buffer = lines.pop() || '';

        let currentEvent: SSEFields = {};

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            currentEvent.data = line.slice(6);
          } else if (line.startsWith('event: ')) {
            currentEvent.event = line.slice(7);
          } else if (line.startsWith('id: ')) {
            currentEvent.id = line.slice(4);
          } else if (line === '') {
            if (currentEvent.data !== undefined) {
              yield {
                event: currentEvent.event,
                data: currentEvent.data,
                id: currentEvent.id,
              };
            }
            currentEvent = {};
          }
        }
      }
    } finally {
      this.reader.releaseLock();
    }
  }

  static async create(
    response: Response
  ): Promise<XStream> {
    if (!response.body) {
      throw new Error('Response body is null');
    }
    return new XStream({ readableStream: response.body });
  }
}

export default XStream;
