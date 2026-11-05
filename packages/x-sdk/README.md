# @ant-design-x-vue/x-sdk

SDK toolkit for ant-design-x-vue, providing utilities for AI-powered applications.

## Features

- **useXChat** - Vue composable for managing chat messages
- **useXConversations** - Vue composable for managing conversations
- **XRequest** - HTTP request utility with streaming support
- **XStream** - SSE (Server-Sent Events) stream parser
- **XMcpClient** - Model Context Protocol client
- **Chat Providers** - Pre-built providers for OpenAI, DeepSeek, etc.

## Installation

```bash
pnpm add @ant-design-x-vue/x-sdk
```

## Usage

```typescript
import { useXChat, useXConversations, XRequest, XStream } from '@ant-design-x-vue/x-sdk';

// Use chat composable
const { messages, addMessage } = useXChat();

// Use conversations composable
const { conversations, activeId, addConversation } = useXConversations();

// Use XRequest for API calls
const request = XRequest({ baseURL: 'https://api.example.com' });
const data = await request.request('/endpoint');
```

## License

MIT
