import { afterEach, describe, expect, it, vi } from 'vitest';
import XStream from '../index';

describe('XStream', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('transforms binary stream to SSE events', async () => {
    const textEncoder = new TextEncoder();
    const readableStream = new ReadableStream({
      start(controller) {
        controller.enqueue(textEncoder.encode('event: test\n\ndata: value\n\n'));
        controller.close();
      },
    });

    const result: any[] = [];
    for await (const value of XStream({ readableStream })) {
      result.push(value);
    }

    expect(result).toEqual([{ event: 'test' }, { data: 'value' }]);
  });

  it('falls back to TextDecoder when TextDecoderStream is unavailable', async () => {
    const originalTextDecoderStream = globalThis.TextDecoderStream;
    Object.defineProperty(globalThis, 'TextDecoderStream', {
      configurable: true,
      value: undefined,
    });

    try {
      const result: any[] = [];
      for await (const value of XStream({
        readableStream: new ReadableStream({
          start(controller) {
            controller.enqueue(new TextEncoder().encode('event: fallback\n\ndata: value\n\n'));
            controller.close();
          },
        }),
      })) {
        result.push(value);
      }
      expect(result).toEqual([{ event: 'fallback' }, { data: 'value' }]);
    } finally {
      Object.defineProperty(globalThis, 'TextDecoderStream', {
        configurable: true,
        value: originalTextDecoderStream,
      });
    }
  });

  it('supports custom stream, part, and key-value separators', async () => {
    const result: any[] = [];
    for await (const value of XStream({
      readableStream: new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode('event=message|data=hello||data=world||'));
          controller.close();
        },
      }),
      streamSeparator: '||',
      partSeparator: '|',
      kvSeparator: '=',
    })) {
      result.push(value);
    }
    expect(result).toEqual([{ event: 'message', data: 'hello' }, { data: 'world' }]);
  });

  it('make compatible with incomplete SSE data. ', async () => {
    const sseChunks: string[] = [];

    sseChunks.push('event: message\ndata:1\n\nevent: end\n');
    sseChunks.push('data:2\n\n');
    sseChunks.push(':comment\n\n');

    const readableStream = new ReadableStream({
      async start(controller) {
        for (const chunk of sseChunks) {
          controller.enqueue(new TextEncoder().encode(chunk));
        }
        controller.close();
      },
    });

    const result: any[] = [];
    for await (const value of XStream({ readableStream })) {
      result.push(value);
    }

    expect(result).toEqual([
      { event: 'message', data: '1' },
      { event: 'end', data: '2' },
    ]);
  });

  it('supports custom transform streams', async () => {
    const textEncoder = new TextEncoder();
    const readableStream = new ReadableStream({
      start(controller) {
        controller.enqueue(textEncoder.encode('custom-part1|custom-part2|'));
        controller.close();
      },
    });

    const customTransform = new TransformStream({
      transform(chunk, controller) {
        const parts = chunk.split('|');
        parts.forEach((part: string) => {
          controller.enqueue(part);
        });
      },
    });

    const result: any[] = [];
    for await (const value of XStream({ readableStream, transformStream: customTransform })) {
      result.push(value);
    }

    expect(result).toEqual(['custom-part1', 'custom-part2']);
  });

  it('throws an error when readableStream is not an instance of ReadableStream', async () => {
    await expect(
      (async () => {
        const result: any[] = [];
        for await (const value of XStream({ readableStream: {} as any })) {
          result.push(value);
        }
      })(),
    ).rejects.toThrow('The options.readableStream must be an instance of ReadableStream.');
  });

  it('warns and skips lines without a key-value separator', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const result: any[] = [];
    for await (const value of XStream({
      readableStream: new ReadableStream({
        async start(controller) {
          controller.enqueue(new TextEncoder().encode('event: message\n\nincomplete'));
          controller.close();
        },
      }),
    })) {
      result.push(value);
    }
    expect(warn).toHaveBeenCalledWith(
      'The key-value separator ":" is not found in the sse line: incomplete !',
    );
    expect(result).toEqual([{ event: 'message' }]);
  });

  it('skips the trailing blank line of a single-newline event', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const chunk = 'event: delta\ndata: {"key":"value"}\n';
    const result: any[] = [];
    for await (const value of XStream({
      readableStream: new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode(chunk));
          controller.close();
        },
      }),
    })) {
      result.push(value);
    }
    expect(result).toEqual([{ event: 'delta', data: '{"key":"value"}' }]);
    expect(warn).not.toHaveBeenCalled();
  });

  it('skips blank lines between events without warning', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const chunk = 'event: start\ndata: 1\n\n\nevent: end\ndata: 2\n\n';
    const result: any[] = [];
    for await (const value of XStream({
      readableStream: new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode(chunk));
          controller.close();
        },
      }),
    })) {
      result.push(value);
    }
    expect(result).toEqual([
      { event: 'start', data: '1' },
      { event: 'end', data: '2' },
    ]);
    expect(warn).not.toHaveBeenCalled();
  });

  it('should return an instance of ReadableStream', () => {
    expect(
      XStream({
        readableStream: new ReadableStream({
          async start(controller) {
            controller.enqueue(new TextEncoder().encode('event: message\n\ndata: value\n\n'));
            controller.close();
          },
        }),
      }),
    ).toBeInstanceOf(ReadableStream);
  });

  it('cancels and releases the reader when the consumer exits early', async () => {
    const stream = XStream({
      readableStream: new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode('data: 0\n\ndata: 1\n\n'));
          controller.close();
        },
      }),
    });

    for await (const value of stream) {
      expect(value).toEqual({ data: '0' });
      break;
    }

    expect(stream.locked).toBe(false);
    const reader = stream.getReader();
    await expect(reader.read()).resolves.toEqual({ done: true, value: undefined });
    reader.releaseLock();
  });
});
