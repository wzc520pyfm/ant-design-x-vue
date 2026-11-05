import { describe, expect, it } from 'vitest';
import {
  createOpenAIChatProvider,
  resolvePresetApiKey,
} from '../createOpenAIChatProvider';

describe('OpenAI preset provider', () => {
  it('turns a raw key into a bearer token and leaves scheme prefixes alone', () => {
    expect(resolvePresetApiKey({ key: 'sk-test' })).toBe('Bearer sk-test');
    expect(resolvePresetApiKey({ dangerouslyApiKey: 'Bearer already' })).toBe('Bearer already');
    expect(resolvePresetApiKey({})).toBeUndefined();
  });

  it('builds a manual OpenAI chat provider and parses an SSE delta', () => {
    const provider = createOpenAIChatProvider({
      baseURL: 'https://example.com/v1/chat/completions',
      model: 'gpt-4o-mini',
      key: 'sk-test',
    });

    expect(provider.request.manual).toBe(true);
    expect(provider.request.baseURL).toBe('https://example.com/v1/chat/completions');
    expect(provider.request.options.headers).toMatchObject({
      Authorization: 'Bearer sk-test',
    });
    expect(provider.request.options.params).toMatchObject({
      model: 'gpt-4o-mini',
      stream: true,
    });

    const message = provider.transformMessage({
      originMessage: { role: 'assistant', content: 'Hi' },
      chunk: {
        data: JSON.stringify({
          choices: [{ delta: { content: ' there', role: 'assistant' } }],
        }),
      },
      chunks: [],
      status: 'updating',
      responseHeaders: new Headers({ 'content-type': 'text/event-stream' }),
    });

    expect(message).toEqual({ content: 'Hi there', role: 'assistant' });
  });
});
