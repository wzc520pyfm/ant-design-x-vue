import { ref, shallowRef } from 'vue';
import type { Ref, ShallowRef } from 'vue';

export interface MessageInfo<T = string> {
  id: string;
  content: T;
  role: 'user' | 'assistant' | 'system';
  status?: 'loading' | 'success' | 'error';
}

export interface DefaultMessageInfo extends MessageInfo<string> {}

export interface UseXChatOptions<T = DefaultMessageInfo> {
  defaultMessages?: T[];
}

export interface UseXChatReturn<T = DefaultMessageInfo> {
  messages: ShallowRef<T[]>;
  setMessages: (messages: T[]) => void;
  addMessage: (message: T) => void;
  updateMessage: (id: string, message: Partial<T>) => void;
  removeMessage: (id: string) => void;
  clearMessages: () => void;
}

/**
 * useXChat - Vue composable for managing chat messages
 * TODO: Implement full functionality
 */
export function useXChat<T extends MessageInfo = DefaultMessageInfo>(
  options: UseXChatOptions<T> = {}
): UseXChatReturn<T> {
  const { defaultMessages = [] } = options;
  const messages = shallowRef<T[]>([...defaultMessages]);

  const setMessages = (newMessages: T[]) => {
    messages.value = [...newMessages];
  };

  const addMessage = (message: T) => {
    messages.value = [...messages.value, message];
  };

  const updateMessage = (id: string, partial: Partial<T>) => {
    messages.value = messages.value.map((msg) =>
      msg.id === id ? { ...msg, ...partial } : msg
    );
  };

  const removeMessage = (id: string) => {
    messages.value = messages.value.filter((msg) => msg.id !== id);
  };

  const clearMessages = () => {
    messages.value = [];
  };

  return {
    messages,
    setMessages,
    addMessage,
    updateMessage,
    removeMessage,
    clearMessages,
  };
}

export default useXChat;
