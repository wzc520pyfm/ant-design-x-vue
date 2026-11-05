import { shallowRef, watch, type ShallowRef } from 'vue';

export type ConversationKey = string | number;

export const chatMessagesStoreHelper = {
  _chatMessagesStores: new Map<ConversationKey, ChatMessagesStore<any>>(),
  get: (conversationKey: ConversationKey) => {
    return chatMessagesStoreHelper._chatMessagesStores.get(conversationKey);
  },
  set: (key: ConversationKey, store: ChatMessagesStore<any>) => {
    chatMessagesStoreHelper._chatMessagesStores.set(key, store);
  },
  delete: (key: ConversationKey) => {
    chatMessagesStoreHelper._chatMessagesStores.delete(key);
  },
  getMessages: (conversationKey: ConversationKey) => {
    const store = chatMessagesStoreHelper._chatMessagesStores.get(conversationKey);
    return store?.getMessages();
  },
};

export class ChatMessagesStore<T extends { id: number | string }> {
  private messages: T[] = [];
  private listeners: (() => void)[] = [];
  private conversationKey: ConversationKey | undefined;
  private isDefaultMessagesRequesting = false;
  private isDestroyed = false;

  private emitListeners() {
    this.listeners.forEach((listener) => {
      listener();
    });
  }

  constructor(
    defaultMessages: () => Promise<T[]>,
    conversationKey?: ConversationKey,
  ) {
    this.initializeMessages(defaultMessages);
    if (conversationKey !== undefined && conversationKey !== null) {
      this.conversationKey = conversationKey;
      chatMessagesStoreHelper.set(this.conversationKey, this);
    }
  }

  private async initializeMessages(defaultMessages: () => Promise<T[]>) {
    try {
      this.isDefaultMessagesRequesting = true;
      this.emitListeners();
      const messages = await defaultMessages();
      if (!this.isDestroyed) {
        this.messages = [...(messages || [])];
        this.emitListeners();
      }
    } catch (error) {
      console.warn('Failed to initialize messages:', error);
      if (!this.isDestroyed) {
        this.messages = [];
        this.emitListeners();
      }
    } finally {
      this.isDefaultMessagesRequesting = false;
      this.emitListeners();
    }
  }

  setMessages = (messages: T[] | ((ori: T[]) => T[])) => {
    let list: T[];
    if (typeof messages === 'function') {
      list = (messages as (ori: T[]) => T[])(this.messages);
    } else {
      list = messages as T[];
    }
    this.messages = [...list];
    this.emitListeners();
    return true;
  };

  getMessages = () => {
    return this.messages;
  };

  getIsDefaultMessagesRequesting = () => {
    return this.isDefaultMessagesRequesting;
  };

  getMessage = (id: string | number) => {
    return this.messages.find((item) => item.id === id);
  };

  addMessage = (message: T) => {
    const exist = this.getMessage(message.id);
    if (!exist) {
      this.setMessages([...this.messages, message]);
      return true;
    }
    return false;
  };

  setMessage = (id: string | number, message: Partial<T> | ((message: T) => Partial<T>)) => {
    const originMessage = this.getMessage(id);
    if (originMessage) {
      const mergeMessage =
        typeof message === 'function'
          ? (message as (m: T) => Partial<T>)(originMessage)
          : message;
      Object.assign(originMessage, mergeMessage);
      this.setMessages([...this.messages]);
      return true;
    }
    return false;
  };

  removeMessage = (id: string | number) => {
    const index = this.messages.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.messages.splice(index, 1);
      this.setMessages([...this.messages]);
      return true;
    }
    return false;
  };

  getSnapshot = () => {
    return {
      messages: this.messages,
      isDefaultMessagesRequesting: this.isDefaultMessagesRequesting,
    };
  };

  subscribe = (callback: () => void) => {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((listener) => listener !== callback);
    };
  };

  destroy = () => {
    this.isDestroyed = true;
    this.listeners = [];
  };
}

export interface UseChatStoreReturn<T extends { id: number | string }> {
  messages: ShallowRef<T[]>;
  isDefaultMessagesRequesting: ShallowRef<boolean>;
  addMessage: ChatMessagesStore<T>['addMessage'];
  removeMessage: ChatMessagesStore<T>['removeMessage'];
  setMessage: ChatMessagesStore<T>['setMessage'];
  getMessage: ChatMessagesStore<T>['getMessage'];
  setMessages: ChatMessagesStore<T>['setMessages'];
  getMessages: ChatMessagesStore<T>['getMessages'];
}

/**
 * Vue composable for chat store. Accepts conversationKey as a reactive ref.
 */
export function useChatStore<T extends { id: number | string }>(
  defaultValue: () => Promise<T[]>,
  conversationKey?: ConversationKey | ShallowRef<ConversationKey | undefined>,
): UseChatStoreReturn<T> {
  const keyRef: ShallowRef<ConversationKey | undefined> =
    conversationKey && typeof conversationKey === 'object' && 'value' in (conversationKey as any)
      ? (conversationKey as ShallowRef<ConversationKey | undefined>)
      : shallowRef<ConversationKey | undefined>(conversationKey as ConversationKey | undefined);

  const createStore = (k?: ConversationKey) => {
    if (k !== undefined && chatMessagesStoreHelper.get(k)) {
      return chatMessagesStoreHelper.get(k) as ChatMessagesStore<T>;
    }
    return new ChatMessagesStore<T>(defaultValue, k);
  };

  const storeRef: ShallowRef<ChatMessagesStore<T>> = shallowRef(createStore(keyRef.value));
  const messages: ShallowRef<T[]> = shallowRef(storeRef.value.getMessages());
  const isDefaultMessagesRequesting = shallowRef(storeRef.value.getIsDefaultMessagesRequesting());

  let unsubscribe: (() => void) | null = null;

  const syncFromStore = () => {
    messages.value = [...storeRef.value.getMessages()];
    isDefaultMessagesRequesting.value = storeRef.value.getIsDefaultMessagesRequesting();
  };

  const bindStore = () => {
    if (unsubscribe) unsubscribe();
    syncFromStore();
    unsubscribe = storeRef.value.subscribe(() => {
      syncFromStore();
    });
  };

  bindStore();

  watch(
    () => keyRef.value,
    () => {
      storeRef.value = createStore(keyRef.value);
      bindStore();
    },
  );

  return {
    messages,
    isDefaultMessagesRequesting,
    addMessage: (msg: T) => storeRef.value.addMessage(msg),
    removeMessage: (id: string | number) => storeRef.value.removeMessage(id),
    setMessage: (id, m) => storeRef.value.setMessage(id, m),
    getMessage: (id) => storeRef.value.getMessage(id),
    setMessages: (msgs) => storeRef.value.setMessages(msgs),
    getMessages: () => storeRef.value.getMessages(),
  } as UseChatStoreReturn<T>;
}
