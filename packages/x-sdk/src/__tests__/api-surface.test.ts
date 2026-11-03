import { describe, expect, it } from 'vitest';
import * as sdk from '../index';

/**
 * Lightweight API surface snapshot so accidental export renames/drops fail CI.
 * Mirrors the public surface consumers import from `@ant-design-x-vue/x-sdk`.
 */
describe('x-sdk API surface', () => {
  it('exports core hooks, providers, request, stream, and mcp client', () => {
    expect(Object.keys(sdk).sort()).toMatchInlineSnapshot(`
      [
        "AbstractChatProvider",
        "AbstractXRequestClass",
        "ChatMessagesStore",
        "ConversationStore",
        "DeepSeekChatProvider",
        "DefaultChatProvider",
        "OpenAIChatProvider",
        "XMCPClient",
        "XMCPClientClass",
        "XMcpClient",
        "XRequest",
        "XRequestClass",
        "XStream",
        "chatMessagesStoreHelper",
        "conversationStoreHelper",
        "createOpenAIChatProvider",
        "resolvePresetApiKey",
        "setXRequestGlobalOptions",
        "useChatStore",
        "useXChat",
        "useXConversations",
        "version",
      ]
    `);
  });
});
