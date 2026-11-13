# X Card

`@ant-design-x-vue/x-card` 是 React [`@ant-design/x-card`](https://www.npmjs.com/package/@ant-design/x-card) 的 Vue 移植。

用 A2UI 命令队列驱动动态卡片：`Box` 提供组件注册表和命令，`Card` 按 `id`（surfaceId）渲染。

协议说明与快速开始在本页。按协议版本拆分的 API 表和演示见 [A2UI v0.8](/x-card/a2ui-v-0-8) 与 [A2UI v0.9](/x-card/a2ui-v-0-9)。


## 什么是 A2UI？

A2UI（Agent-to-User Interface）是一套开放协议：AI Agent 用声明式 JSON 消息描述交互意图，前端运行时再把它们渲染成**原生** UI 组件。`@ant-design-x-vue/x-card` 是该协议的 Vue 实现。

### 核心设计原则

1. **流式消息**：UI 更新以 JSON 命令序列从 Agent 流向客户端
2. **声明式组件**：界面是数据，不是生成出来的代码
3. **数据绑定**：UI 结构与应用状态分离，状态变化时界面响应式更新

### 为什么用 A2UI，而不是让模型直接生成 HTML？

| 特性 | A2UI | AI 直接生成 HTML |
| --- | --- | --- |
| **安全** | 只能使用预先登记的组件目录，无任意代码执行 | 可能夹带脚本或注入 |
| **跨端** | 同一套数据可映射到 Web / 原生组件 | HTML 需要按端适配 |
| **流式渲染** | 支持边生成边呈现 | 通常要等完整文档 |
| **对 LLM 友好** | 扁平 JSON，可增量补丁 | 要生成完整 HTML，容易语法错误 |
| **维护** | 组件集中管理，升级客户端即可 | 每段 HTML 都要单独调试 |

## 数据流

A2UI 遵循单向数据流：

```
Agent (LLM) → A2UI 生成器 → 传输层 (SSE / WebSocket / A2A)
                    ↓
客户端（读流） → 消息解析 → XCard 渲染器 → 原生 Vue 组件
```

以订餐为例：

```mermaid
sequenceDiagram
    participant User
    participant Client
    participant Agent

    User->>Client: "明天晚上 7 点订 2 人位"
    Client->>Agent: 发送用户请求

    Note over Agent: 1. 创建 UI 容器
    Agent->>Client: createSurface { surfaceId: "booking" }

    Note over Agent: 2. 定义结构
    Agent->>Client: updateComponents { components: [...] }

    Note over Agent: 3. 写入初始数据
    Agent->>Client: updateDataModel { datetime, guests: 2 }

    Note over Client: 4. 渲染表单
    Client->>User: 展示日期与人数输入

    User->>Client: 把人数改成 3
    Note over Client: 自动更新 /reservation/guests

    User->>Client: 点击「确认」
    Client->>Agent: userAction { name: "confirm", context: { guests: 3 } }

    Note over Agent: 5. 处理 action
    Agent->>Client: deleteSurface { surfaceId: "booking" }
    Agent->>Client: 创建成功确认界面
```

## 协议版本

`@ant-design-x-vue/x-card` 同时支持 A2UI v0.8 与 v0.9。新项目请使用 **v0.9**。

### 版本对照

| 特性 | v0.8 | v0.9 |
| --- | --- | --- |
| **版本字段** | 无显式 `version` | 每条命令带 `version: 'v0.9'` |
| **创建 Surface** | 隐式（首次更新时自动创建） | 显式 `createSurface` |
| **更新数据** | 常用 `contents` 数组 | 使用 `path` + `value` |
| **组件结构** | 更易嵌套、形态较多 | 扁平邻接表 |
| **建议** | 仅兼容 | **推荐** |

本仓库的 v0.8 demo 还展示了 `surfaceUpdate` / `dataModelUpdate`（含 `valueString` / `literalString`）/ `beginRendering` 等命令形状。

### v0.8 消息（兼容）

```ts
// 无 version 字段；首次 updateComponents 可隐式建 Surface
{
  updateComponents: {
    surfaceId: 'booking',
    catalogId: 'https://example.com/catalogs/booking/v1/catalog.json',
    components: [
      { id: 'root', component: 'Column', children: ['header', 'content'] },
    ],
  },
}

{
  updateDataModel: {
    surfaceId: 'booking',
    contents: [{ op: 'replace', path: '/reservation/guests', value: 3 }],
  },
}
```

### v0.9 消息（推荐）

```ts
{ version: 'v0.9', createSurface: { surfaceId: 'booking', catalogId: 'https://example.com/catalogs/booking/v1/catalog.json' } }

{ version: 'v0.9', updateComponents: { surfaceId: 'booking', components: [
  { id: 'root', component: 'Column', children: ['header', 'content'] },
] } }

{ version: 'v0.9', updateDataModel: { surfaceId: 'booking', path: '/reservation/guests', value: 3 } }
```

### 从 v0.8 迁到 v0.9

1. 所有消息加上 `version: 'v0.9'`
2. 在 `updateComponents` 之前先发 `createSurface`（`catalogId` 放到创建命令里）
3. 把 `contents: [{ op, path, value }]` 改成 `{ path, value }`
4. v0.9 可以一次写入整个对象，减少消息条数：

```ts
{
  version: 'v0.9',
  updateDataModel: {
    surfaceId: 'booking',
    path: '/reservation',
    value: { date: '2025-12-16', guests: 2 },
  },
}
```

组件会根据是否存在 `version` 字段自动区分协议版本。`commands` 类型为 `(XAgentCommand_v0_8 | XAgentCommand_v0_9)[]`。

## 核心命令（v0.9）

### createSurface — 创建容器

每个 Surface 有独立的组件树和 dataModel。

```ts
{ version: 'v0.9', createSurface: { surfaceId: 'booking', catalogId: 'my-catalog' } }
```

### updateComponents — 更新结构

使用扁平邻接表。每个 Surface **有且仅有一个** `id: 'root'`。子节点用 id 字符串引用，不要把组件对象嵌进另一个组件。

```ts
{
  version: 'v0.9',
  updateComponents: {
    surfaceId: 'booking',
    components: [
      { id: 'root', component: 'Column', children: ['header', 'guests-field', 'submit-btn'] },
      { id: 'header', component: 'Text', text: '确认预订', variant: 'h1' },
      { id: 'guests-field', component: 'TextField', label: '人数', value: { path: '/reservation/guests' } },
      {
        id: 'submit-btn',
        component: 'Button',
        variant: 'primary',
        action: { event: { name: 'confirm', context: { details: { path: '/reservation' } } } },
      },
    ],
  },
}
```

### updateDataModel — 更新数据

```ts
{ version: 'v0.9', updateDataModel: { surfaceId: 'booking', path: '/reservation', value: { datetime: '2025-12-16T19:00:00Z', guests: 2 } } }
```

### deleteSurface — 删除容器

```ts
{ version: 'v0.9', deleteSurface: { surfaceId: 'booking' } }
```

## 数据绑定

每个 Surface 有一份独立的 JSON 数据。路径遵循 RFC 6901 JSON Pointer：`/user/name`、`/reservation/guests`。

```ts
// 字面量（静态）
{ id: 'title', component: 'Text', text: '欢迎' }

// 路径绑定（动态）
{ id: 'username', component: 'Text', text: { path: '/user/name' } }

// 双向绑定：输入必须是 { path }，字面量不会写回 dataModel
{ id: 'name-input', component: 'TextField', value: { path: '/form/name' } }
```

自定义字段组件通过注入的 `onDataChange(path, value)` 或 `useXCardField` 回写。

## Action

用户操作经 Card 解析后，由 Box 的 `onAction` 回传给应用（模板里写 **`:on-action`**，这是 prop 而不是 emit）。

```ts
action: {
  event: {
    name: 'confirm_booking',
    context: {
      date: { path: '/reservation/datetime' },
      guests: { path: '/reservation/guests' },
    },
  },
}
```

触发时，`{ path }` 会被解析成 `{ value: 实际值 }`（其它字段如 `label` 会保留），`ActionPayload` 形如 `{ name, surfaceId, context }`。v0.8 的 `action.context` 常见为 `{ key, value: { path } }[]`。

## Catalog

Catalog 描述可用组件及其 JSON Schema，保证校验与类型安全。组件实现名称必须 **大写开头**。在挂载前调用 `registerCatalog`，并把实现表传给 `XCard.Box` 的 `components`（对象引用保持稳定）。

也可 `loadCatalog(catalogId)` 拉取远程目录，用 `validateComponent` 做属性校验。

每个 `XCard.Box` 默认使用独立的 catalog 缓存，并在卸载时清理；远程 catalog URL 默认拒绝 loopback、私有网段和内网主机。服务端还会解析主机名并把已验证的 IP 绑定到连接；浏览器端只做主机名检查，无法解析 DNS。可通过 `catalogOptions.allowedHosts` 精确放行，或用 `catalogOptions.allowInternalHosts` 放宽全部内网限制。需要跨 Box 共享缓存时可传入自定义 `catalogOptions.registry`。

## 快速开始

```vue
<script setup lang="ts">
import { XCard, registerCatalog } from '@ant-design-x-vue/x-card'
import type { XAgentCommand_v0_9, Catalog, ActionPayload } from '@ant-design-x-vue/x-card'

const catalog: Catalog = {
  catalogId: 'my-app-catalog',
  components: {
    Text: { type: 'object', properties: { text: { type: 'string' } }, required: ['text'] },
    Button: { type: 'object', properties: { text: { type: 'string' }, action: {} }, required: ['text'] },
  },
}
registerCatalog(catalog)

const commands: XAgentCommand_v0_9[] = [
  { version: 'v0.9', createSurface: { surfaceId: 'booking', catalogId: 'my-app-catalog' } },
  {
    version: 'v0.9',
    updateComponents: {
      surfaceId: 'booking',
      components: [
        { id: 'root', component: 'Column', children: ['title'] },
        { id: 'title', component: 'Text', text: 'Hello' },
      ],
    },
  },
]

const cardComponents = { /* Text, Button 的 Vue 实现 */ }

function handleAction(payload: ActionPayload) {
  console.log(payload.name, payload.context)
}
</script>

<template>
  <XCard.Box :commands="commands" :components="cardComponents" :on-action="handleAction">
    <XCard.Card id="booking" />
  </XCard.Box>
</template>
```

更多约定见仓库里的 Vue skill：`packages/x-skill/skills-zh/x-card`。协议细节也可阅读 [A2UI 文档](https://a2ui.org/concepts/data-flow/)、[组件结构](https://a2ui.org/concepts/component-structure/) 与 [数据绑定](https://a2ui.org/concepts/data-binding/)。

## 安装

```bash
pnpm add @ant-design-x-vue/x-card
```

## 版本化 API 与演示

- [A2UI v0.8](/x-card/a2ui-v-0-8)：`surfaceUpdate` / `dataModelUpdate` / `beginRendering` 的兼容形状，以及 v0.8 基础与 action 示例
- [A2UI v0.9](/x-card/a2ui-v-0-9)（推荐）：完整 showcase（基础、流式、表单校验、多卡同步、筛选搜索、嵌套交互、渐进加载）与 v0.9 API
