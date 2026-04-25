import { onBeforeUnmount, shallowRef, type ShallowRef } from 'vue';
import { ConversationStore, type ConversationData } from './store';

export type { ConversationData };
export { ConversationStore, conversationStoreHelper } from './store';

export interface XConversationConfig {
  defaultConversations?: ConversationData[];
  defaultActiveConversationKey?: string;
}

export interface UseXConversationsReturn {
  conversations: ShallowRef<ConversationData[]>;
  activeConversationKey: ShallowRef<string>;
  setActiveConversationKey: (key: string) => boolean;
  addConversation: (
    conversation: ConversationData,
    placement?: 'prepend' | 'append',
  ) => boolean;
  removeConversation: (key: ConversationData['key']) => boolean;
  setConversation: (
    key: ConversationData['key'],
    conversation: ConversationData,
  ) => boolean;
  getConversation: (key: ConversationData['key']) => ConversationData | undefined;
  setConversations: (list: ConversationData[]) => boolean;
  getMessages: (key: ConversationData['key']) => unknown;
}

/**
 * Vue port of React's `useXConversations` – exposes reactive `conversations`
 * and `activeConversationKey` refs plus the store mutations. The underlying
 * `ConversationStore` is shared across hooks through `conversationStoreHelper`
 * so `useXChat` can resolve history by conversation key.
 */
export function useXConversations(config: XConversationConfig = {}): UseXConversationsReturn {
  const store = new ConversationStore(
    config.defaultConversations || [],
    config.defaultActiveConversationKey || '',
  );

  const conversations = shallowRef<ConversationData[]>(store.getSnapshot());
  const activeConversationKey = shallowRef<string>(store.getActiveConversationKey());

  const unsubscribe = store.subscribe(() => {
    conversations.value = [...store.getSnapshot()];
    activeConversationKey.value = store.getActiveConversationKey();
  });

  onBeforeUnmount(() => {
    unsubscribe();
    store.destroy();
  });

  return {
    conversations,
    activeConversationKey,
    setActiveConversationKey: store.setActiveConversationKey,
    addConversation: store.addConversation,
    removeConversation: store.removeConversation,
    setConversation: store.setConversation,
    getConversation: store.getConversation,
    setConversations: store.setConversations,
    getMessages: store.getMessages,
  };
}

export default useXConversations;
