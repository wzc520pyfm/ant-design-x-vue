# A2UI v0.9

v0.9 是推荐协议：每条命令带 `version: 'v0.9'`，并用显式的 `createSurface` / `updateComponents` / `updateDataModel` / `deleteSurface`。协议总览见 [介绍](/x-card/introduce)。

下面这些演示都使用 v0.9 命令。它们覆盖了 React `@ant-design/x-card` 2.10 站点上的同名 showcase（基础、渐进式、流式、嵌套交互、多卡同步、筛选搜索、表单验证、Action Context 解析）。Vue 没有再为每个 showcase 复制一份 v0.8 命令变体。

## 代码演示

### 基础用法

::::demo-v2 注册本地 catalog，用 v0.9 命令渲染一个 Text 卡片。

x-card/basic

::::

### Action context 解析

::::demo-v2 输入时把值写入 dataModel；提交按钮传空 context，Card 会按 `action.event.context` 里的 `{ path }` 解析出实际值。

x-card/action-context

::::

### 流式 / 增量 JSON

::::demo-v2 通过不断追加 `updateDataModel` 命令，把不完整的文本和列表逐步写进同一 surface。

x-card/streaming

::::

### 表单字段校验

::::demo-v2 自定义字段用 `useXCardField` 做必填 / 格式校验，并通过 Card 注入的 `onDataChange` 回写 dataModel。

x-card/form-validation

::::

### 多卡同步

::::demo-v2 商品列表与购物车绑定同一 `/cart`。`onAction` 里追加 `updateDataModel`，两张卡片一起刷新——不另造跨 surface 协议。

x-card/multi-card-sync

::::

### 筛选搜索

::::demo-v2 筛选项写入 `/filters`，列表组件通过 path 读取同一份 filters 并本地过滤。

x-card/filter-search

::::

### 嵌套交互

::::demo-v2 文件树点击后把选中项写入 dataModel，详情卡绑定 `/selectedFile`。

x-card/nested-interaction

::::

### 渐进加载动画

::::demo-v2 分批 `updateComponents` 追加商品节点，进度条走 `LoadingIndicator` 的 props；卡片入场动画在组件内部用现有 DOM/CSS 完成。

x-card/progressive

::::

## API

模板里请绑定 **`:on-action`**——这是 prop，不是 emit。

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

- `onAction(name, context)`：触发后由 Card 按版本执行 `extractDataUpdates`，再解析 action context 中的 path 引用
- `onDataChange(path, value)`：直接回写当前 surface 的 dataModel（双向绑定）

### ActionPayload

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| name | 事件名称 | `string` | - |
| surfaceId | 触发该 action 的 surfaceId | `string` | - |
| context | 组件传递的上下文，已解析 path 引用 | `Record<string, any>` | - |

### Action Context 中的 Path 引用解析

当组件触发 action 时，X Card 会把 context 里的 path 引用解析成实际值。

#### Path 引用格式

在 action 配置中使用 `{ path: string }` 绑定 dataModel：

```json
{
  "id": "submit-btn",
  "component": "Button",
  "action": {
    "event": {
      "name": "agent:send_context_text",
      "context": {
        "username": { "path": "/form/username", "label": "用户名" },
        "email": { "path": "/form/email", "label": "邮箱" }
      }
    }
  }
}
```

#### 解析结果

```json
{
  "username": { "value": "张三", "label": "用户名" },
  "email": { "value": "test@example.com", "label": "邮箱" }
}
```

**注意**：

- 仅当 context 中的值本身是 `{ path: "xxx" }` 时才转换
- 组件传入的实际值（如 `{ value: "实际值" }`）不会被错误转换
- 会保留其他属性（如 `label`），只把 `path` 替换为 `value`

### A2UICommand_v0_9

`XAgentCommand_v0_9` 是 `A2UICommand_v0_9` 的别名。

#### CreateSurfaceCommand

创建新的 Surface。

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| version | 版本号 | `'v0.9'` | - |
| createSurface.surfaceId | Surface ID | `string` | - |
| createSurface.catalogId | 组件目录 URL 或本地标识 | `string` | - |

#### UpdateComponentsCommand

更新 Surface 上的组件。

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| version | 版本号 | `'v0.9'` | - |
| updateComponents.surfaceId | Surface ID | `string` | - |
| updateComponents.components | 组件列表 | `BaseComponent_v0_9[]` | - |

#### BaseComponent_v0_9

```ts
interface BaseComponent_v0_9 {
  id: string
  component: string
  child?: string
  children?: string[]
  [key: string]: any | PathValue
}
```

#### UpdateDataModelCommand

更新数据模型。

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| version | 版本号 | `'v0.9'` | - |
| updateDataModel.surfaceId | Surface ID | `string` | - |
| updateDataModel.path | 数据路径 | `string` | - |
| updateDataModel.value | 数据值 | `any` | - |

#### DeleteSurfaceCommand

删除 Surface。

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| version | 版本号 | `'v0.9'` | - |
| deleteSurface.surfaceId | Surface ID | `string` | - |

### PathValue

```ts
interface PathValue {
  path: string
}
```

### Catalog

```ts
interface Catalog {
  $schema?: string
  $id?: string
  title?: string
  description?: string
  catalogId?: string
  components?: Record<string, CatalogComponent>
  functions?: Record<string, any>
  $defs?: Record<string, any>
}
```

### CatalogComponent

```ts
interface CatalogComponent {
  type: 'object'
  allOf?: any[]
  properties?: Record<string, any>
  required?: string[]
  [key: string]: any
}
```

### Catalog 相关方法

```ts
registerCatalog(catalog: Catalog): void
loadCatalog(catalogId: string): Promise<Catalog>
validateComponent(catalog: Catalog, componentName: string, componentProps: Record<string, any>): boolean
clearCatalogCache(): void
```

### useXCardField

Vue 侧额外提供的字段回写 / 校验 composable（表单验证演示在使用它）。

```ts
const field = useXCardField({
  path: '/form/email',
  onDataChange, // Card 注入
  rules: [{ required: true }, { pattern: /.+@.+/, message: '邮箱格式不正确' }],
})
field.setValue(next)
field.validate()
field.error.value
```

也导出纯函数 `validateFieldValue(value, rules)`。
