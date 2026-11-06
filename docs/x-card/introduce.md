# X Card

`@ant-design-x-vue/x-card` 是 React [`@ant-design/x-card`](https://www.npmjs.com/package/@ant-design/x-card) 的 Vue 移植。

用 A2UI 命令队列驱动动态卡片：`Box` 提供组件注册表和命令，`Card` 按 `id`（surfaceId）渲染。

本页覆盖 v0.9 基础渲染、路径绑定、action context 解析、字段回写 / 校验，以及与 React 2.10 showcase 对齐的多卡同步、筛选搜索、嵌套交互、渐进加载。v0.8 用 `surfaceUpdate` / `dataModelUpdate` / `beginRendering` 的命令形状，也提供基础与 action 示例。

## 安装

```bash
pnpm add @ant-design-x-vue/x-card
```

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

### v0.8 基础渲染

::::demo-v2 `surfaceUpdate` + `dataModelUpdate`（含 `valueString` / `literalString`）+ `beginRendering`。

x-card/v08-basic

::::

### v0.8 Action context

::::demo-v2 v0.8 的 `action.context` 是 `{ key, value: { path } }[]`。输入写入 dataModel，空 context 提交时由 Card 解析。

x-card/v08-action

::::

## API

### XCard.Box

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| commands | A2UI 命令队列 | `(XAgentCommand_v0_9 \| XAgentCommand_v0_8)[]` | `[]` |
| components | 组件实现表，名称需大写开头 | `Record<string, Component>` | - |
| onAction | 卡片内部触发 action 时回调 | `(payload: ActionPayload) => void` | - |

### XCard.Card

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| id | surfaceId，对应命令里的 `surfaceId` | `string` | - |

自定义组件会收到：

- `onAction(name, context)`：触发后由 Card 按版本执行 `extractDataUpdates`，再解析 action context 中的 path 引用
- `onDataChange(path, value)`：直接回写当前 surface 的 dataModel（双向绑定）

### useXCardField

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

### Catalog helpers

- `registerCatalog(catalog)`
- `loadCatalog(catalogId)`
- `validateComponent(catalog, name, props)`
- `clearCatalogCache()`
