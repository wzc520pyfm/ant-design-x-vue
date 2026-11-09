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
import { XRequest, XStream } from '@ant-design-x-vue/x-sdk';

// Manual requests are required when XRequest is handed to a Chat Provider.
const request = XRequest('https://api.example.com/chat', {
  manual: true,
  callbacks: {
    onUpdate(chunk) {
      console.log('chunk', chunk);
    },
    onSuccess(chunks, responseHeaders) {
      console.log('done', chunks.length, responseHeaders.get('content-type'));
    },
    onError(error) {
      console.error(error);
    },
  },
});

request.run({ prompt: 'Hello' });

// XStream turns a fetch Response body into SSE chunks.
for await (const chunk of XStream({ readableStream: response.body! })) {
  console.log('sse', chunk);
}
```

`useXChat` and `useXConversations` are Vue composables. `useXChat` requires a
Chat Provider such as `OpenAIChatProvider` or `DefaultChatProvider`; see the
site pages for complete examples.

## License

MIT
