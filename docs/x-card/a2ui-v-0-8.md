# A2UI v0.8

v0.8 是兼容协议：命令没有 `version` 字段，首次更新时会隐式创建 Surface。新项目请使用 [A2UI v0.9](/x-card/a2ui-v-0-9)。

下面八个演示与 React `@ant-design/x-card` 2.10 的 v0.8 showcase 对齐：咖啡预订、渐进加载、流式推荐、文件浏览器、多卡片购物车、筛选搜索、分步表单和 action context 解析。每个场景都使用原生 v0.8 命令（`surfaceUpdate` / `dataModelUpdate` / `beginRendering`），而不是复用 v0.9 的组件树。

## 代码演示

### 基础用法

::::demo-v2 咖啡预订场景：选择日期与咖啡后确认订单。命令按 `surfaceUpdate` → `dataModelUpdate` → `beginRendering` 顺序执行，成功后再删除预订 Surface 并渲染结果卡片。

x-card/v08-basic

::::

### 渐进式

::::demo-v2 两个 Surface 协同：`loading-indicator` 展示进度，商品 Surface 每批追加 2 个商品。后续 `surfaceUpdate` 会替换已缓存的组件树。

x-card/v08-progressive

::::

### 流式渲染

::::demo-v2 食物推荐场景。介绍文本先流式输出，随后用 `dataModelUpdate` 逐步写入进度和餐厅列表，推荐卡片随进度出现并完成收尾。

x-card/v08-streaming

::::

### 嵌套交互

::::demo-v2 文件树 + 文件详情 + 手风琴面板。点击文件后把 `selectedFile` 写回 dataModel，详情卡通过 path 绑定同步刷新；面板数据用 `valueMap` 以 JSON 字符串存储。

x-card/v08-nested-interaction

::::

### 多卡片同步

::::demo-v2 商品列表、购物车和订单摘要共享 `/cart`。加入购物车、修改数量、删除和结算都通过 `dataModelUpdate` 驱动三张卡片同步，结算后切换到成功 Surface。

x-card/v08-multi-card-sync

::::

### 筛选搜索

::::demo-v2 搜索词、分类、价格区间和最低评分共同写入 `/filters`。筛选面板与结果列表读取同一份数据，结果在短暂延迟后刷新。

x-card/v08-filter-search

::::

### 表单验证

::::demo-v2 分步注册表单：基本信息 → 安全设置 → 提交结果。字段在本地校验后通过 `action.context` 的 `formData` 路径写回，最终 Surface 被结果卡片替换。

x-card/v08-form-validation

::::

### Action context 解析

::::demo-v2 v0.8 的 `action.context` 是 `{ key, value: { path } }[]`。输入写入 dataModel，空 context 提交时由 Card 解析。

x-card/v08-action

::::

## API

`XCard.Box` / `XCard.Card` 的用法两边协议共用。下面按 v0.8 命令形状补充类型。模板里请绑定 **`:on-action`**——这是 prop，不是 emit。

### XCard.Box

Box 作为容器，管理 Card 实例和命令分发。默认插槽里放 `XCard.Card`。

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| commands | A2UI 命令对象 | `(A2UICommand_v0_9 \| XAgentCommand_v0_8)[]` | `[]` |
| components | 自定义组件映射，名称必须以大写字母开头 | `Record<string, Component>` | - |
| onAction | Card 内部触发 action 时的回调 | `(payload: ActionPayload) => void` | - |
| catalogOptions | Catalog 加载选项：独立 registry、自定义 fetch、内网主机放行策略 | `CatalogFetchOptions` | - |

### XCard.Card

用于渲染单个 Surface。

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| id | Surface ID，对应命令中的 `surfaceId` | `string` | - |

自定义组件会收到：

- `onAction(name, context)`：触发后由 Card 按版本解析 path 引用
- `onDataChange(path, value)`：直接回写当前 surface 的 dataModel

### ActionPayload

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| name | 事件名称 | `string` | - |
| surfaceId | 触发该 action 的 surfaceId | `string` | - |
| context | 组件传递的上下文，已解析 path 引用 | `Record<string, any>` | - |

### Action Context 中的 Path 引用解析

当组件触发 action 时，X Card 会把 context 里的 path 引用解析成实际值。

#### Path 引用格式（v0.8）

v0.8 的 action 配置常用数组描述路径绑定：

```json
{
  "id": "submit-btn",
  "component": {
    "Button": {
      "action": {
        "name": "agent:send_context_text",
        "context": [
          { "key": "username", "value": { "path": "/form/username" } },
          { "key": "email", "value": { "path": "/form/email" } }
        ]
      }
    }
  }
}
```

#### 解析结果

用户点击按钮后，`onAction` 收到的 context 会被解析为：

```json
{
  "username": { "value": "张三" },
  "email": { "value": "test@example.com" }
}
```

**注意**：

- 仅当 context 中的值本身是 `{ path: "xxx" }` 时才转换
- 组件传入的实际值不会被错误转换

### XAgentCommand_v0_8

`XAgentCommand_v0_8` 是 `A2UICommand_v0_8` 的别名，支持以下命令。

#### SurfaceUpdateCommand

更新 Surface 上的组件。

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| surfaceUpdate.surfaceId | Surface ID | `string` | - |
| surfaceUpdate.components | 组件列表 | `ComponentWrapper_v0_8[]` | - |

#### ComponentWrapper_v0_8

```ts
interface ComponentWrapper_v0_8 {
  id: string
  component: {
    [componentType: string]: {
      child?: string
      children?: string[] | ExplicitList
      [key: string]: any | PathValue | LiteralStringValue
    }
  }
}
```

#### ExplicitList

```ts
interface ExplicitList {
  explicitList: string[]
}
```

#### DataModelUpdateCommand

更新数据模型（v0.8 格式）。

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| dataModelUpdate.surfaceId | Surface ID | `string` | - |
| dataModelUpdate.contents | 数据内容列表 | `Array<{ key: string; valueString?: string; valueMap?: Array<{ key: string; valueString: string }> }>` | - |

#### BeginRenderingCommand

开始渲染。

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| beginRendering.surfaceId | Surface ID | `string` | - |
| beginRendering.root | 根组件 ID | `string` | - |

#### DeleteSurfaceCommand

删除 Surface。

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| deleteSurface.surfaceId | Surface ID | `string` | - |

### PathValue

```ts
interface PathValue {
  path: string
}
```

### LiteralStringValue

字面字符串值（v0.8 特有）。

```ts
interface LiteralStringValue {
  literalString: string
}
```
