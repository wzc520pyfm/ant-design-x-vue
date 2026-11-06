# Prompt 模板

本文档提供了使用 X Skill 时的 Prompt 模板参考，帮助你更高效地调用各项 Vue 技能。请先按 [介绍](/x-skill/introduce) 安装 `@ant-design-x-vue/x-skill`，再把下面的提示词交给 Agent。

### 聊天功能开发

**基础聊天功能**

```
使用技能帮我创建一个完整的聊天应用，要求：
- 使用 Ant Design X Vue 的 UI 组件（从 ant-design-x-vue 引入）
- 创建自定义 ChatProvider 适配流式接口，使用 @ant-design-x-vue/x-sdk 的 XRequest 处理 SSE 请求
- 接口地址：`https://api.example.com/chat`
- 请求格式：`{ query: string, sessionId?: string }`
- 响应格式：`{ content: string, time: string, status: 'success' | 'error', role: 'assistant' | 'user' }`
- 添加错误处理和用户友好的错误提示
- 按功能模块化组织代码：composables/（或 hooks/）、types/、utils/、components/
- 只生成 Vue SFC（`<script setup lang="ts">` + 模板），不要输出 React JSX
```

### 部分优化和修改

**自定义 Chat Provider - 工具调用**

```
使用技能帮我扩展当前 ChatProvider 支持工具调用：
- 基于现有 ChatProvider 添加工具调用功能
- 使用 @ant-design-x-vue/x-sdk（AbstractChatProvider / XRequest），不要引入 @ant-design/x 或 @ant-design/x-sdk
- 接口地址：`https://api.example.com/chat`
- 请求格式：`{ query: string, sessionId?: string }`
- 响应格式：`{
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
- 消息格式：`{
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
- 只生成 Vue SFC，不要输出 React JSX
```
