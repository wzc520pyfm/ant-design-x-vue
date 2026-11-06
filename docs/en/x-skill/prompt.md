# Prompt Templates

> 中文：[Prompt 模板](/x-skill/prompt)

This page collects prompt templates for the Vue X skills. Install `@ant-design-x-vue/x-skill` first ([Introduction](/en/x-skill/introduce)), then paste a template to your agent.

### Chat function development

**Basic chat function**

```
Use the skill to help me create a complete chat application with the following requirements:
- Use Ant Design X Vue UI components (import from ant-design-x-vue)
- Create a custom ChatProvider to adapt to streaming interfaces, using XRequest from @ant-design-x-vue/x-sdk to handle SSE requests
- Interface address: `https://api.example.com/chat`
- Request format: `{ query: string, sessionId?: string }`
- Response format: `{ content: string, time: string, status: 'success' | 'error', role: 'assistant' | 'user' }`
- Add error handling and user-friendly error prompts
- Organize code modularly by function: composables/ (or hooks/), types/, utils/, components/
- Generate Vue SFCs only (`<script setup lang="ts">` + template). Do not emit React JSX
```

### Partial optimization and modification

**Custom Chat Provider - tool calls**

```
Use the skill to help me extend the current ChatProvider to support tool calls:
- Add tool call functionality based on the existing ChatProvider
- Use @ant-design-x-vue/x-sdk (AbstractChatProvider / XRequest). Do not import @ant-design/x or @ant-design/x-sdk
- Interface address: `https://api.example.com/chat`
- Request format: `{ query: string, sessionId?: string }`
- Response format: `{
    content: string,
    time: string,
    status: 'success' | 'error',
    tools?: Array<{
      id: string,
      name: string,
      code: string,
      status: 'pending' | 'running' | 'success' | 'error',
      output?: any,
      error?: string
    }>
   }`
- Message format: `{
    role: 'assistant' | 'user',
    content: string,
    time: string,
    status: 'success' | 'error',
    tools?: Array<{
      id: string,
      name: string,
      code: string,
      status: 'running' | 'success' | 'error',
    }>
  }`
- Generate Vue SFCs only. Do not emit React JSX
```
