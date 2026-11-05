import { createApp, defineComponent, h, nextTick } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import XRequest from '../../x-request';
import useXChat, { type MessageStatus, type SimpleType, type XChatConfig } from '../index';
import { DefaultChatProvider } from '../providers';
import { chatMessagesStoreHelper } from '../store';

interface ChatInput {
  query: string;
  [PropertyKey: string]: any;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type ChatApi<
  ChatMessage extends SimpleType = string,
  ParsedMessage extends SimpleType = string,
  Input = ChatInput,
  Output = string,
> = ReturnType<typeof useXChat<ChatMessage, ParsedMessage, Input, Output>>;

describe('useXChat', () => {
  const apps: Array<ReturnType<typeof createApp>> = [];

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    while (apps.length) {
      apps.pop()?.unmount();
    }
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  function mountChat<
    ChatMessage extends SimpleType = string,
    ParsedMessage extends SimpleType = string,
    Input = ChatInput,
    Output = string,
  >(config: XChatConfig<ChatMessage, ParsedMessage, Input, Output>) {
    let api!: ChatApi<ChatMessage, ParsedMessage, Input, Output>;
    const Comp = defineComponent({
      setup() {
        api = useXChat(config);
        return () => h('div');
      },
    });
    const app = createApp(Comp);
    app.mount(document.createElement('div'));
    apps.push(app);
    return api;
  }

  function expectMessage<T = string>(message: T, status?: MessageStatus) {
    const obj: any = { message };
    if (status) {
      obj.status = status;
    }
    return expect.objectContaining(obj);
  }

  it('defaultMessages', () => {
    const provider = new DefaultChatProvider<string, any, any>({
      request: XRequest('http://localhost:8000/', {
        manual: true,
      }),
    });
    const chat = mountChat({
      provider,
      defaultMessages: [
        {
          message: 'default',
        },
      ],
    });

    expect(chat.parsedMessages.value).toEqual([
      {
        id: 'default_0',
        message: 'default',
        status: 'local',
      },
    ]);
  });

  describe('requestPlaceholder', () => {
    it('static', async () => {
      const provider = new DefaultChatProvider<ChatInput, any, any>({
        request: XRequest('http://localhost:8000/', {
          manual: true,
          fetch: async () => {
            await sleep(1000);
            return Promise.resolve(new Response('{}'));
          },
        }),
      });
      const chat = mountChat({ provider, requestPlaceholder: 'bamboo' as any });
      chat.onRequest({ query: 'little' } as any);
      await nextTick();

      expect(chat.parsedMessages.value).toEqual([
        expectMessage({ query: 'little' }, 'local'),
        expectMessage('bamboo', 'loading'),
      ]);
    });

    it('callback', async () => {
      const requestPlaceholder = vi.fn(() => 'light');
      const transformStream = new TransformStream();
      const provider = new DefaultChatProvider<ChatInput, any, any>({
        request: XRequest('http://localhost:8000/', {
          manual: true,
          transformStream,
          fetch: async () => {
            await sleep(1000);
            return Promise.resolve(new Response('{}'));
          },
        }),
      });
      const chat = mountChat({ provider, requestPlaceholder: requestPlaceholder as any });
      chat.onRequest({ query: 'little' } as any);
      await nextTick();

      expect(requestPlaceholder).toHaveBeenCalledWith(
        { query: 'little' },
        {
          messages: [{ query: 'little' }],
        },
      );

      expect(chat.parsedMessages.value).toEqual([
        expectMessage({ query: 'little' }, 'local'),
        expectMessage('light', 'loading'),
      ]);
    });
  });

  describe('requestFallback', () => {
    it('static', async () => {
      vi.useRealTimers();
      const provider = new DefaultChatProvider<ChatInput, any, any>({
        request: XRequest('http://localhost:8000/', {
          manual: true,
          fetch: async () => {
            throw new Error('failed');
          },
        }),
      });
      const chat = mountChat({ provider, requestFallback: 'bamboo' as any });
      chat.onRequest({ query: 'little' } as any);
      await sleep(50);
      await nextTick();
      expect(chat.parsedMessages.value).toEqual([
        expectMessage({ query: 'little' }, 'local'),
        expectMessage('bamboo', 'error'),
      ]);
    });

    it('callback', async () => {
      vi.useRealTimers();
      const provider = new DefaultChatProvider<ChatInput, any, any>({
        request: XRequest('http://localhost:8000/', {
          manual: true,
          fetch: async () => {
            throw new Error('failed');
          },
        }),
      });
      const requestFallback = vi.fn(async () => 'light');
      const chat = mountChat({ provider, requestFallback: requestFallback as any });
      chat.onRequest({ query: 'little' } as any);
      await sleep(50);
      await nextTick();

      expect(requestFallback).toHaveBeenCalledWith(
        { query: 'little' },
        expect.objectContaining({
          error: new Error('failed'),
          messages: [{ query: 'little' }],
        }),
      );

      expect(chat.parsedMessages.value).toEqual([
        expectMessage({ query: 'little' }, 'local'),
        expectMessage('light', 'error'),
      ]);
    });
  });

  it('parser return multiple messages', async () => {
    const provider = new DefaultChatProvider<ChatInput, any, any>({
      request: XRequest('http://localhost:8000/', {
        manual: true,
        fetch: async () =>
          Promise.resolve(
            new Response('{}', {
              headers: { 'Content-Type': 'application/json' },
            }),
          ),
      }),
    });
    const chat = mountChat({
      provider,
      parser: (msg) => [`0_${JSON.stringify(msg)}`, `1_${JSON.stringify(msg)}`],
    });

    chat.onRequest({ query: 'light' } as any);
    await nextTick();

    expect(chat.parsedMessages.value).toEqual([
      expectMessage('0_{"query":"light"}', 'local'),
      expectMessage('1_{"query":"light"}', 'local'),
    ]);
  });

  it('should throw an error if onRequest,onReload,abort is called without an agent', () => {
    const chat = mountChat({
      defaultMessages: [{ message: 'Hello' }],
    });

    expect(() => chat.onRequest({ query: 'Hello' } as any)).toThrow('provider is required');
    expect(() =>
      chat.onReload(
        'key1',
        { query: 'Hello' } as any,
        {
          extraInfo: {
            feedback: 'dislike',
          },
        },
      ),
    ).toThrow('provider is required');
    expect(() => chat.abort()).toThrow('provider is required');
  });

  it('should setMessage work successfully', async () => {
    vi.useRealTimers();
    const chat = mountChat<string, ChatInput, any, any>({
      defaultMessages: [{ message: 'Hello' }],
    });
    chat.setMessage('default_0', { message: 'Hello2', extraInfo: { feedback: 'like' } });
    chat.setMessage('default_1', { message: 'Hello3' });
    await sleep(20);
    await nextTick();
    expect(chat.messages.value.length).toBe(1);
    expect(chat.messages.value[0].message).toEqual('Hello2');
  });

  it('should reload, isRequesting work successfully', async () => {
    vi.useRealTimers();
    let count = 0;
    const provider = new DefaultChatProvider<ChatInput, any, any>({
      request: XRequest('http://localhost:8000/', {
        manual: true,
        fetch: async () => {
          count = count + 1;
          let res = '{"content": "bamboo"}';
          if (count > 1) {
            res = '{"content": "bamboo2"}';
          }
          return Promise.resolve(
            new Response(res, {
              headers: {
                'Content-Type': 'application/json',
              },
            }),
          );
        },
      }),
    });
    const chat = mountChat({
      provider,
      requestPlaceholder: 'bamboo placeholder' as any,
    });

    chat.onRequest({ query: 'little' } as any);
    expect(chat.isRequesting.value).toBe(true);
    await sleep(50);
    await nextTick();
    expect(chat.isRequesting.value).toBe(false);
    expect(chat.parsedMessages.value).toEqual([
      expectMessage({ query: 'little' }, 'local'),
      expectMessage({ content: 'bamboo' }, 'success'),
    ]);

    chat.onReload(
      chat.parsedMessages.value[1].id,
      {},
      {
        extraInfo: {
          feedback: 'dislike',
        },
      },
    );
    expect(() => chat.onReload('fake id', { query: 'Hello' } as any)).toThrow(
      'message [fake id] is not found',
    );
    await sleep(50);
    await nextTick();
    expect(chat.parsedMessages.value).toEqual([
      expectMessage({ query: 'little' }, 'local'),
      expectMessage({ content: 'bamboo2' }, 'success'),
    ]);
  });

  it('should chat messages store(dep conversationKey) work successfully', async () => {
    vi.useRealTimers();
    mountChat<string, ChatInput, any, any>({
      defaultMessages: [{ message: 'Hello' }],
      conversationKey: 'conversation-1',
    });
    await sleep(20);
    const store = chatMessagesStoreHelper.get('conversation-1');
    expect(store).toBeTruthy();
    expect(store?.getMessages()).toEqual([{ id: 'default_0', message: 'Hello', status: 'local' }]);

    store?.addMessage({
      id: 'msg_1',
      message: 'Kitty',
      status: 'local',
    });
    expect(store?.getMessages().length).toBe(2);
    expect(
      store?.addMessage({
        id: 'msg_1',
        message: 'Kitty2',
        status: 'local',
      }),
    ).toBe(false);
    expect(store?.getMessages().length).toBe(2);

    store?.removeMessage('msg_1');
    expect(store?.getMessages().length).toBe(1);
    expect(store?.removeMessage('msg_2')).toBe(false);

    const messages = chatMessagesStoreHelper.getMessages('conversation-1');
    expect(messages).toEqual([{ id: 'default_0', message: 'Hello', status: 'local' }]);

    chatMessagesStoreHelper.delete('conversation-1');
    expect(chatMessagesStoreHelper.get('conversation-1')).toBeFalsy();
  });
});
