import { computed, ref, shallowRef, type ShallowRef } from 'vue';
import type { AnyObject } from '../_util/type';
import type { ConversationData } from '../x-conversations';
import type { AbstractXRequestClass } from '../x-request';
import type { SSEOutput } from '../x-stream';
import type { AbstractChatProvider } from './providers';
import { useChatStore } from './store';

export type SimpleType = string | number | boolean | object;

export type MessageStatus =
  | 'local'
  | 'loading'
  | 'updating'
  | 'success'
  | 'error'
  | 'abort';

type RequestPlaceholderFn<Input, Message> = (
  requestParams: Partial<Input>,
  info: { messages: Message[] },
) => Message;

type RequestFallbackFn<Input, MessageInfoT, Message> = (
  requestParams: Partial<Input>,
  info: { error: Error; messages: Message[]; messageInfo: MessageInfoT },
) => Message | Promise<Message>;

export type RequestParams<Message> = {
  [Key: PropertyKey]: Message;
} & AnyObject;

export interface XChatConfig<
  ChatMessage extends SimpleType = string,
  BubbleMessage extends SimpleType = ChatMessage,
  Input = ChatMessage,
  Output = ChatMessage,
> {
  provider?: AbstractChatProvider<ChatMessage, Input, Output>;
  conversationKey?: ConversationData['key'] | ShallowRef<ConversationData['key'] | undefined>;
  defaultMessages?: DefaultMessageInfo<ChatMessage>[];
  /** Convert agent message to bubble usage message type */
  parser?: (message: ChatMessage) => BubbleMessage | BubbleMessage[];
  requestPlaceholder?: ChatMessage | RequestPlaceholderFn<Input, ChatMessage>;
  requestFallback?: ChatMessage | RequestFallbackFn<Input, MessageInfo<ChatMessage>, ChatMessage>;
}

export interface MessageInfo<Message extends SimpleType> {
  id: number | string;
  message: Message;
  status: MessageStatus;
  extraInfo?: AnyObject;
}

export type DefaultMessageInfo<Message extends SimpleType> = Pick<MessageInfo<Message>, 'message'> &
  Partial<Omit<MessageInfo<Message>, 'message'>>;

function toArray<T>(item: T | T[]): T[] {
  return Array.isArray(item) ? item : [item];
}

const IsRequestingMap = new Map<string | number, boolean>();

export default function useXChat<
  ChatMessage extends SimpleType = string,
  ParsedMessage extends SimpleType = ChatMessage,
  Input = RequestParams<ChatMessage>,
  Output = SSEOutput,
>(config: XChatConfig<ChatMessage, ParsedMessage, Input, Output>) {
  const {
    defaultMessages,
    requestFallback,
    requestPlaceholder,
    parser,
    provider,
    conversationKey,
  } = config;

  const idRef = ref(0);
  const requestHandlerRef = shallowRef<AbstractXRequestClass<Input, Output> | undefined>(undefined);
  const isRequesting = ref<boolean>(false);

  const conversationKeyRef: ShallowRef<any> =
    conversationKey && typeof conversationKey === 'object' && 'value' in (conversationKey as any)
      ? (conversationKey as ShallowRef<any>)
      : shallowRef(conversationKey);

  const {
    messages,
    setMessages,
    getMessages,
    setMessage,
  } = useChatStore<MessageInfo<ChatMessage>>(
    () =>
      (defaultMessages || []).map((info, index) => ({
        id: `default_${index}`,
        status: 'local' as MessageStatus,
        ...info,
      })),
    conversationKeyRef,
  );

  const createMessage = (message: ChatMessage, status: MessageStatus, extraInfo?: AnyObject) => {
    const msg: MessageInfo<ChatMessage> = {
      id: `msg_${idRef.value}`,
      message,
      status,
    };
    if (extraInfo) {
      msg.extraInfo = extraInfo;
    }
    idRef.value += 1;
    return msg;
  };

  const parsedMessages = computed<MessageInfo<ParsedMessage>[]>(() => {
    const list: MessageInfo<ParsedMessage>[] = [];
    messages.value.forEach((agentMsg) => {
      const rawParsedMsg = parser ? parser(agentMsg.message) : (agentMsg.message as any);
      const bubbleMsgs = toArray(rawParsedMsg as ParsedMessage);

      bubbleMsgs.forEach((bubbleMsg, bubbleMsgIndex) => {
        let key = agentMsg.id;
        if (bubbleMsgs.length > 1) {
          key = `${key}_${bubbleMsgIndex}`;
        }
        list.push({
          id: key,
          message: bubbleMsg,
          status: agentMsg.status,
        });
      });
    });
    return list;
  });

  const getFilteredMessages = (msgs: MessageInfo<ChatMessage>[]) =>
    msgs.filter((info) => info.status !== 'loading').map((info) => info.message);

  if (provider) {
    provider.injectGetMessages(() => getFilteredMessages(getMessages()));
    requestHandlerRef.value = provider.request;
  }
  const getRequestMessages = () => getFilteredMessages(getMessages());

  const innerOnRequest = (
    requestParams: Partial<Input>,
    opts?: {
      updatingId?: number | string;
      reload?: boolean;
      extraInfo?: AnyObject;
    },
  ) => {
    if (!provider) return;
    const { updatingId, reload } = opts || {};
    let loadingMsgId: number | string | null | undefined = null;
    const localMessage = provider.transformLocalMessage(requestParams);
    const addedMessages = (Array.isArray(localMessage) ? localMessage : [localMessage]).map(
      (message) => createMessage(message, 'local', opts?.extraInfo),
    );
    if (reload) {
      loadingMsgId = updatingId;
      setMessages((ori) => {
        const nextMessages = [...ori];
        if (requestPlaceholder) {
          let placeholderMsg: ChatMessage;
          if (typeof requestPlaceholder === 'function') {
            placeholderMsg = (requestPlaceholder as RequestPlaceholderFn<Input, ChatMessage>)(
              requestParams,
              {
                messages: getFilteredMessages(nextMessages),
              },
            );
          } else {
            placeholderMsg = requestPlaceholder as ChatMessage;
          }
          nextMessages.forEach((info) => {
            if (info.id === updatingId) {
              info.status = 'loading';
              info.message = placeholderMsg;
              if (opts?.extraInfo) {
                info.extraInfo = opts.extraInfo;
              }
            }
          });
        }
        return nextMessages;
      });
    } else {
      setMessages((ori) => {
        let nextMessages = [...ori, ...addedMessages];
        if (requestPlaceholder) {
          let placeholderMsg: ChatMessage;
          if (typeof requestPlaceholder === 'function') {
            placeholderMsg = (requestPlaceholder as RequestPlaceholderFn<Input, ChatMessage>)(
              requestParams,
              {
                messages: getFilteredMessages(nextMessages),
              },
            );
          } else {
            placeholderMsg = requestPlaceholder as ChatMessage;
          }
          const loadingMsg = createMessage(placeholderMsg, 'loading');
          loadingMsgId = loadingMsg.id;
          nextMessages = [...nextMessages, loadingMsg];
        }
        return nextMessages;
      });
    }

    let updatingMsgId: number | string | null | undefined = null;
    const updateMessage = (
      status: MessageStatus,
      chunk: Output,
      chunks: Output[],
      responseHeaders: Headers,
    ) => {
      let msg = getMessages().find((info) => info.id === updatingMsgId);
      if (!msg) {
        if (reload && updatingId) {
          msg = getMessages().find((info) => info.id === updatingId);
          if (msg) {
            msg.status = status;
            msg.message = provider.transformMessage({ chunk, status, chunks, responseHeaders });
            setMessages((ori) => [...ori]);
            updatingMsgId = msg.id;
          }
        } else {
          const transformData = provider.transformMessage({
            chunk,
            status,
            chunks,
            responseHeaders,
          });
          const newMsg = createMessage(transformData, status);
          setMessages((ori) => {
            const oriWithoutPending = ori.filter((info) => info.id !== loadingMsgId);
            return [...oriWithoutPending, newMsg];
          });
          updatingMsgId = newMsg.id;
          msg = newMsg;
        }
      } else {
        setMessages((ori) => {
          return ori.map((info) => {
            if (info.id === updatingMsgId) {
              const transformData = provider.transformMessage({
                originMessage: info.message,
                chunk,
                chunks,
                status,
                responseHeaders,
              });
              return {
                ...info,
                message: transformData,
                status,
              };
            }
            return info;
          });
        });
      }

      return msg;
    };

    provider.injectRequest({
      onUpdate: (chunk: Output, headers: Headers) => {
        updateMessage('updating', chunk, [], headers);
      },
      onSuccess: (chunks: Output[], headers: Headers) => {
        isRequesting.value = false;
        if (conversationKeyRef.value !== undefined && conversationKeyRef.value !== null) {
          IsRequestingMap.delete(conversationKeyRef.value);
        }
        updateMessage('success', undefined as unknown as Output, chunks, headers);
      },
      onError: async (error: Error) => {
        isRequesting.value = false;
        if (conversationKeyRef.value !== undefined && conversationKeyRef.value !== null) {
          IsRequestingMap.delete(conversationKeyRef.value);
        }
        if (requestFallback) {
          let fallbackMsg: ChatMessage;
          if (typeof requestFallback === 'function') {
            const msgs = getRequestMessages();
            const msg = getMessages().find(
              (info) => info.id === loadingMsgId || info.id === updatingMsgId,
            );
            fallbackMsg = await (
              requestFallback as RequestFallbackFn<Input, MessageInfo<ChatMessage>, ChatMessage>
            )(requestParams, {
              error,
              messageInfo: msg as MessageInfo<ChatMessage>,
              messages: msgs,
            });
          } else {
            fallbackMsg = requestFallback as ChatMessage;
          }
          setMessages((ori) => [
            ...ori.filter(
              (info) => info.id !== loadingMsgId && info.id !== updatingMsgId,
            ),
            createMessage(fallbackMsg, error.name === 'AbortError' ? 'abort' : 'error'),
          ]);
        } else {
          setMessages((ori) => {
            return ori.map((info) => {
              if (info.id === loadingMsgId || info.id === updatingMsgId) {
                return {
                  ...info,
                  status: (error.name === 'AbortError' ? 'abort' : 'error') as MessageStatus,
                };
              }
              return info;
            });
          });
        }
      },
    });
    isRequesting.value = true;
    if (conversationKeyRef.value !== undefined && conversationKeyRef.value !== null) {
      IsRequestingMap.set(conversationKeyRef.value, true);
    }
    provider.request.run(provider.transformParams(requestParams, provider.request.options));
  };

  const onRequest = (requestParams: Partial<Input>, opts?: { extraInfo: AnyObject }) => {
    if (!provider) {
      throw new Error('provider is required');
    }
    innerOnRequest(requestParams, opts);
  };

  const onReload = (
    id: string | number,
    requestParams: Partial<Input>,
    opts?: { extraInfo: AnyObject },
  ) => {
    if (!provider) {
      throw new Error('provider is required');
    }
    if (!id || !getMessages().find((info) => info.id === id)) {
      throw new Error(`message [${id}] is not found`);
    }
    innerOnRequest(requestParams, {
      updatingId: id,
      reload: true,
      extraInfo: opts?.extraInfo,
    });
  };

  const isRequestingComputed = computed(() => {
    const k = conversationKeyRef.value;
    return k !== undefined && k !== null ? IsRequestingMap.get(k) || false : isRequesting.value;
  });

  return {
    onRequest,
    messages,
    parsedMessages,
    setMessages,
    setMessage,
    abort: () => {
      if (!provider) {
        throw new Error('provider is required');
      }
      requestHandlerRef.value?.abort();
    },
    isRequesting: isRequestingComputed,
    onReload,
  } as const;
}

export { useXChat };
