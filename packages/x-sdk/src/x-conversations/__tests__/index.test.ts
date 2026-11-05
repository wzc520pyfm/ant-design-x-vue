import { createApp, defineComponent, h, nextTick } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';
import useXConversations, { type ConversationData, conversationStoreHelper } from '../index';

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type ConversationsApi = ReturnType<typeof useXConversations>;

describe('useXConversations tests', () => {
  const apps: Array<ReturnType<typeof createApp>> = [];

  afterEach(() => {
    while (apps.length) {
      apps.pop()?.unmount();
    }
  });

  function mountConversations(config: {
    defaultConversations?: ConversationData[];
    defaultActiveConversationKey?: string;
  } = {}): ConversationsApi {
    let api!: ConversationsApi;
    const Comp = defineComponent({
      setup() {
        api = useXConversations(config);
        return () => h('div');
      },
    });
    const app = createApp(Comp);
    const el = document.createElement('div');
    app.mount(el);
    apps.push(app);
    return api;
  }

  it('should init with defaultConversations', async () => {
    const list: ConversationData[] = [
      {
        key: '1',
        label: 'Chat 1',
      },
    ];
    const api = mountConversations({ defaultConversations: list });
    expect(api.conversations.value?.length).toEqual(1);
    expect(api.conversations.value).toEqual(list);
  });

  it('should init with defaultActiveConversationKey', async () => {
    const list: ConversationData[] = [
      {
        key: '1',
        label: 'Chat 1',
      },
      {
        key: '2',
        label: 'Chat 2',
      },
    ];
    const api = mountConversations({
      defaultConversations: list,
      defaultActiveConversationKey: '2',
    });
    expect(api.activeConversationKey.value).toBe('2');
  });

  it('should addConversation, setConversation, removeConversation, getConversation work correctly', async () => {
    const list: ConversationData[] = [
      {
        key: '1',
        label: 'Chat 1',
      },
    ];
    const api = mountConversations({ defaultConversations: list });

    const conversation = api.getConversation('1');
    expect(conversation).toEqual(list[0]);

    api.addConversation({ key: '1', label: 'Chat 1' });
    api.addConversation({ key: '2', label: 'Chat 2' });
    await nextTick();
    expect(api.conversations.value?.length).toEqual(2);
    expect(api.conversations.value.some((c) => c.label === 'Chat 2')).toBe(true);

    api.setConversation('20', { key: '20', label: 'Chat 30' });
    api.setConversation('2', { key: '2', label: 'Chat 3' });
    await nextTick();
    expect(api.conversations.value.some((c) => c.label === 'Chat 3')).toBe(true);

    api.removeConversation('30');
    api.removeConversation('2');
    await nextTick();
    expect(api.conversations.value?.length).toEqual(1);
    expect(api.conversations.value.some((c) => c.label === 'Chat 3')).toBe(false);
  });

  it('should support multiple instance in a context', async () => {
    const api = mountConversations({
      defaultConversations: [{ key: 'demo1', label: 'Chat 1' }],
    });
    const api2 = mountConversations({
      defaultConversations: [
        { key: 'demo2', label: 'Chat 2' },
        { key: 'demo3', label: 'Chat 3' },
      ],
    });
    expect(api.conversations.value?.length).toEqual(1);
    expect(api2.conversations.value?.length).toEqual(2);
  });

  it('should get conversation by conversationKey successfully', async () => {
    const list: ConversationData[] = [
      {
        key: '1',
        label: 'Chat 1',
      },
    ];
    mountConversations({ defaultConversations: list });
    await sleep(20);
    const conversation = conversationStoreHelper.getConversation('1');
    expect(conversation).toEqual(list[0]);
  });

  it('should set and get activeConversationKey correctly', async () => {
    const list: ConversationData[] = [
      { key: '1', label: 'Chat 1' },
      { key: '2', label: 'Chat 2' },
    ];
    const api = mountConversations({ defaultConversations: list });

    expect(api.activeConversationKey.value).toBe('');

    api.setActiveConversationKey('1');
    await nextTick();
    expect(api.activeConversationKey.value).toBe('1');

    api.setActiveConversationKey('2');
    await nextTick();
    expect(api.activeConversationKey.value).toBe('2');
  });

  it('should addConversation with prepend placement', async () => {
    const list: ConversationData[] = [{ key: '1', label: 'Chat 1' }];
    const api = mountConversations({ defaultConversations: list });

    api.addConversation({ key: '2', label: 'Chat 2' }, 'prepend');
    await nextTick();

    expect(api.conversations.value?.length).toEqual(2);
    expect(api.conversations.value[0].key).toBe('2');
    expect(api.conversations.value[1].key).toBe('1');
  });

  it('should addConversation with append placement (default)', async () => {
    const list: ConversationData[] = [{ key: '1', label: 'Chat 1' }];
    const api = mountConversations({ defaultConversations: list });

    api.addConversation({ key: '2', label: 'Chat 2' }, 'append');
    await nextTick();

    expect(api.conversations.value?.length).toEqual(2);
    expect(api.conversations.value[0].key).toBe('1');
    expect(api.conversations.value[1].key).toBe('2');
  });

  it('should setConversations replace all conversations', async () => {
    const initialList: ConversationData[] = [
      { key: '1', label: 'Chat 1' },
      { key: '2', label: 'Chat 2' },
    ];
    const newList: ConversationData[] = [
      { key: '3', label: 'Chat 3' },
      { key: '4', label: 'Chat 4' },
    ];
    const api = mountConversations({ defaultConversations: initialList });

    expect(api.conversations.value?.length).toEqual(2);

    api.setConversations(newList);
    await nextTick();

    expect(api.conversations.value?.length).toEqual(2);
    expect(api.conversations.value).toEqual(newList);
    expect(api.conversations.value.some((c: ConversationData) => c.key === '1')).toBe(false);
    expect(api.conversations.value.some((c: ConversationData) => c.key === '3')).toBe(true);
  });

  it('should getMessages return messages for conversation', async () => {
    const list: ConversationData[] = [{ key: 'test-conversation', label: 'Test Chat' }];
    const api = mountConversations({ defaultConversations: list });

    const messages = api.getMessages('test-conversation');
    expect(messages === undefined || Array.isArray(messages)).toBe(true);
  });

  it('should not add duplicate conversation', async () => {
    const list: ConversationData[] = [{ key: '1', label: 'Chat 1' }];
    const api = mountConversations({ defaultConversations: list });

    const result = api.addConversation({ key: '1', label: 'Duplicate Chat' });
    await nextTick();

    expect(result).toBe(false);
    expect(api.conversations.value?.length).toEqual(1);
    expect(api.conversations.value[0].label).toBe('Chat 1');
  });

  it('should return false when setting non-existent conversation', async () => {
    const list: ConversationData[] = [{ key: '1', label: 'Chat 1' }];
    const api = mountConversations({ defaultConversations: list });

    const result = api.setConversation('non-existent', {
      key: 'non-existent',
      label: 'New Chat',
    });
    expect(result).toBe(false);
  });

  it('should return false when removing non-existent conversation', async () => {
    const list: ConversationData[] = [{ key: '1', label: 'Chat 1' }];
    const api = mountConversations({ defaultConversations: list });

    const result = api.removeConversation('non-existent');
    expect(result).toBe(false);
  });
});
