# A2UI v0.8

v0.8 是兼容协议：命令没有 `version` 字段，首次更新时会隐式创建 Surface。新项目请使用 [A2UI v0.9](/x-card/a2ui-v-0-9)。

Vue 目前为 v0.8 提供了基础渲染与 action context 两个演示。React 2.10 上那一组更完整的 showcase（渐进加载、流式、多卡同步等）在本仓库里按 v0.9 命令实现，见 [A2UI v0.9](/x-card/a2ui-v-0-9)。

## 代码演示

### 基础渲染

::::demo-v2 `surfaceUpdate` + `dataModelUpdate`（含 `valueString` / `literalString`）+ `beginRendering`。

x-card/v08-basic

::::

### Action context

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
