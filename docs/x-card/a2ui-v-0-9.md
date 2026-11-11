# A2UI v0.9

v0.9 是推荐协议：每条命令带 `version: 'v0.9'`，并用显式的 `createSurface` / `updateComponents` / `updateDataModel` / `deleteSurface`。协议总览见 [介绍](/x-card/introduce)。

下面八个演示使用 v0.9 命令，并与 React `@ant-design/x-card` 2.10 的同名 showcase 对齐交互场景、内容数据和状态流转。演示保留 Vue 的 XCard 用法（`:on-action`、`useXCardField`、`registerCatalog`），不强制复制 React 的 Bubble + XMarkdown 营销对话外壳。

## 代码演示

### 基础用法

::::demo-v2 咖啡预订场景：注册本地 catalog，选择日期和咖啡后确认订单。成功时删除预订 Surface，并创建包含咖啡、时间和金额的结果卡片。

x-card/basic

::::

### 渐进式

::::demo-v2 欢迎文本流式输出后，商品数据分 4 批加载。`loading-indicator` Surface 展示进度，商品 Surface 通过连续的 `updateComponents` 从空列表扩展到 8 个商品。

x-card/progressive

::::

### 流式渲染

::::demo-v2 AI 食物推荐场景：介绍文本流式输出，随后进度条和 4 家餐厅逐步写入 dataModel。全部推荐完成后关闭 streaming 状态并显示完成提示。

x-card/streaming

::::

### 嵌套交互

::::demo-v2 文件树、文件详情和手风琴面板共享同一个 Surface。点击文件后写入 `/browser/selectedFile`，详情卡与选中态同步更新，面板内容从 `/browser/panels` 读取。

x-card/nested-interaction

::::

### 多卡同步

::::demo-v2 商品列表、购物车和订单摘要三列布局，共享同一 `/cart`。支持加购、修改数量、删除、折扣与运费计算；结算后删除购物 Surface 并展示成功卡片。

x-card/multi-card-sync

::::

### 筛选搜索

::::demo-v2 10 个商品支持关键词、分类多选、价格区间和最低评分筛选。筛选项写入 `/filters`，结果列表延迟 300ms 读取同一份数据并刷新。

x-card/filter-search

::::

### 表单验证

::::demo-v2 多步骤注册表单：基本信息 → 安全设置 → 提交结果。字段使用 `useXCardField` 校验，并通过 Card 注入的 `onDataChange` 回写；最终提交后 Surface 被成功卡片替换。

x-card/form-validation

::::

### Action context 解析

::::demo-v2 输入时把值写入 dataModel；提交按钮传空 context，Card 会按 `action.event.context` 里的 `{ path }` 解析出实际值。下方日志保留最近四次回调，可直接观察解析结果。

x-card/action-context

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
