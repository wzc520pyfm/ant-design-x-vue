import { ref, shallowRef } from 'vue';
import type { ShallowRef } from 'vue';

export interface ConversationData {
  id: string;
  title: string;
  createdAt?: number;
  updatedAt?: number;
  [key: string]: any;
}

export interface UseXConversationsOptions {
  defaultConversations?: ConversationData[];
  defaultActiveId?: string;
}

export interface UseXConversationsReturn {
  conversations: ShallowRef<ConversationData[]>;
  activeId: ShallowRef<string | undefined>;
  setConversations: (conversations: ConversationData[]) => void;
  addConversation: (conversation: ConversationData) => void;
  updateConversation: (id: string, data: Partial<ConversationData>) => void;
  removeConversation: (id: string) => void;
  setActiveId: (id: string | undefined) => void;
}

/**
 * useXConversations - Vue composable for managing conversations
 * TODO: Implement full functionality
 */
export function useXConversations(
  options: UseXConversationsOptions = {}
): UseXConversationsReturn {
  const { defaultConversations = [], defaultActiveId } = options;

  const conversations = shallowRef<ConversationData[]>([...defaultConversations]);
  const activeId = shallowRef<string | undefined>(defaultActiveId);

  const setConversations = (newConversations: ConversationData[]) => {
    conversations.value = [...newConversations];
  };

  const addConversation = (conversation: ConversationData) => {
    conversations.value = [...conversations.value, conversation];
  };

  const updateConversation = (id: string, data: Partial<ConversationData>) => {
    conversations.value = conversations.value.map((conv) =>
      conv.id === id ? { ...conv, ...data } : conv
    );
  };

  const removeConversation = (id: string) => {
    conversations.value = conversations.value.filter((conv) => conv.id !== id);
  };

  const setActiveId = (id: string | undefined) => {
    activeId.value = id;
  };

  return {
    conversations,
    activeId,
    setConversations,
    addConversation,
    updateConversation,
    removeConversation,
    setActiveId,
  };
}

export default useXConversations;
