# X Card

`@ant-design-x-vue/x-card` 是 React [`@ant-design/x-card`](https://www.npmjs.com/package/@ant-design/x-card) 的 Vue 移植。

用 A2UI 命令队列驱动动态卡片：`Box` 提供组件注册表和命令，`Card` 按 `id`（surfaceId）渲染。

本页覆盖 v0.9 基础渲染、路径绑定、action context 解析、字段回写 / 校验 hook，以及增量 `updateDataModel` 流式更新。完整 React 演示矩阵（多卡同步、筛选搜索、嵌套交互等）仍在后续切片。

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
