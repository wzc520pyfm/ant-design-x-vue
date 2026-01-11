// x-chat
export type { MessageInfo, DefaultMessageInfo } from './x-chat';
export { default as useXChat } from './x-chat';

// x-chat providers
export * from './x-chat/providers';
export type {
  XModelMessage,
  XModelParams,
  XModelResponse,
} from './x-chat/providers/types/model';

// x-conversations
export type { ConversationData } from './x-conversations';
export { default as useXConversations } from './x-conversations';

// x-request
export type {
  XRequestCallbacks,
  XRequestFunction,
  XRequestOptions,
} from './x-request';
export { default as XRequest } from './x-request';

// x-stream
export type {
  SSEFields,
  SSEOutput,
  XStreamOptions,
} from './x-stream';
export { default as XStream } from './x-stream';

// x-mcp-client
export { XMcpClient, type XMcpClientOptions } from './x-mcp-client';

// version
export { default as version } from './version';
