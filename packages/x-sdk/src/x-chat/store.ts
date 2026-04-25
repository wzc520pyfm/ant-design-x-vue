import { shallowRef, watch, type ShallowRef } from 'vue';

type ConversationKey = string | number;

export const chatMessagesStoreHelper = {
  _chatMessagesStores: new Map<string | number, ChatMessagesStore<any>>(),
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

  private emitListeners() {
    this.listeners.forEach((listener) => {
      listener();
    });
  }

  constructor(defaultMessages: T[], conversationKey?: ConversationKey) {
    this.setMessages(defaultMessages);
    if (conversationKey !== undefined && conversationKey !== null) {
      this.conversationKey = conversationKey;
      chatMessagesStoreHelper.set(this.conversationKey, this);
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

  removeMessage = (id: string) => {
    const index = this.messages.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.messages.splice(index, 1);
      this.setMessages([...this.messages]);
      return true;
    }
    return false;
  };

  getSnapshot = () => {
    return this.messages;
  };

  subscribe = (callback: () => void) => {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((listener) => listener !== callback);
    };
  };
}

type Getter<T> = () => T;

export interface UseChatStoreReturn<T extends { id: number | string }> {
  messages: ShallowRef<T[]>;
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
  defaultValue: T[] | Getter<T[]>,
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
    const initial =
      typeof defaultValue === 'function' ? (defaultValue as Getter<T[]>)() : defaultValue;
    return new ChatMessagesStore<T>(initial || [], k);
  };

  const storeRef: ShallowRef<ChatMessagesStore<T>> = shallowRef(createStore(keyRef.value));
  const messages: ShallowRef<T[]> = shallowRef(storeRef.value.getMessages());

  let unsubscribe: (() => void) | null = null;

  const bindStore = () => {
    if (unsubscribe) unsubscribe();
    messages.value = storeRef.value.getMessages();
    unsubscribe = storeRef.value.subscribe(() => {
      messages.value = [...storeRef.value.getMessages()];
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
    addMessage: (msg: T) => storeRef.value.addMessage(msg),
    removeMessage: (id: string) => storeRef.value.removeMessage(id),
    setMessage: (id, m) => storeRef.value.setMessage(id, m),
    getMessage: (id) => storeRef.value.getMessage(id),
    setMessages: (msgs) => storeRef.value.setMessages(msgs),
    getMessages: () => storeRef.value.getMessages(),
  } as UseChatStoreReturn<T>;
}
