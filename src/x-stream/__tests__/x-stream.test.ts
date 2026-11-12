import { describe, expect, it } from 'vitest';
import XStream from '../x-stream';

const encoder = new TextEncoder();

function streamOf(text: string) {
  return new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(encoder.encode(text));
      controller.close();
    },
  });
}

async function collect(text: string) {
  const result: any[] = [];
  for await (const value of XStream({ readableStream: streamOf(text) })) {
    result.push(value);
  }
  return result;
}

describe('XStream blank lines', () => {
  it('parses an event ended by a single trailing newline', async () => {
    expect(await collect('event:delta\ndata:{"key":"value"}\n')).toEqual([
      { event: 'delta', data: '{"key":"value"}' },
    ]);
  });

  it('parses events separated by an extra blank line', async () => {
    const chunk = 'event:start\ndata:1\n\n\nevent:end\ndata:2\n\n';
    expect(await collect(chunk)).toEqual([
      { event: 'start', data: '1' },
      { event: 'end', data: '2' },
    ]);
  });

  it('ignores whitespace-only lines', async () => {
    expect(await collect('event:delta\n   \ndata:1\n\n')).toEqual([
      { event: 'delta', data: '1' },
    ]);
  });

  it('still skips comment lines', async () => {
    expect(await collect(':comment\nevent:delta\ndata:1\n\n')).toEqual([
      { event: 'delta', data: '1' },
    ]);
  });

  it('still rejects a non-blank line without a separator', async () => {
    await expect(collect('event:message\n\nincomplete')).rejects.toThrow(
      'The key-value separator ":" is not found in the sse line chunk!',
    );
  });
});
