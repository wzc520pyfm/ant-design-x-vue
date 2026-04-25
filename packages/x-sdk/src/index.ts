// x-chat
export type {
  MessageInfo,
  DefaultMessageInfo,
  XChatConfig,
  SimpleType,
  MessageStatus,
  RequestParams,
} from './x-chat';
export { default as useXChat } from './x-chat';
export { useChatStore, ChatMessagesStore, chatMessagesStoreHelper } from './x-chat/store';

// x-chat providers
export * from './x-chat/providers';
export type {
  XModelMessage,
  XModelParams,
  XModelResponse,
} from './x-chat/providers/types/model';

// x-conversations
export type {
  ConversationData,
  XConversationConfig,
  UseXConversationsReturn,
} from './x-conversations';
export {
  default as useXConversations,
  ConversationStore,
  conversationStoreHelper,
} from './x-conversations';

// x-request
export type {
  XRequestCallbacks,
  XRequestFunction,
  XRequestOptions,
  XRequestGlobalOptions,
  XFetchMiddlewares,
} from './x-request';
export {
  default as XRequest,
  AbstractXRequestClass,
  XRequestClass,
  setXRequestGlobalOptions,
} from './x-request';

// x-stream
export type {
  SSEFields,
  SSEOutput,
  XStreamOptions,
  XReadableStream,
  JSONOutPut,
} from './x-stream';
export { default as XStream } from './x-stream';

// x-mcp-client
export {
  default as XMCPClient,
  XMCPClientClass,
  XMcpClient,
  type XMCPClientOptions,
  type XMcpClientOptions,
  type XMCPTool,
} from './x-mcp-client';

// version
export { default as version } from './version';
