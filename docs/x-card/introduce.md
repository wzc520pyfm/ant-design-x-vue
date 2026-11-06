# X Card

`@ant-design-x-vue/x-card` 是 React [`@ant-design/x-card`](https://www.npmjs.com/package/@ant-design/x-card) 的 Vue 移植（MVP）。

用 A2UI 命令队列驱动动态卡片：`Box` 提供组件注册表和命令，`Card` 按 `id`（surfaceId）渲染。

> 本切片覆盖公开 API 与 v0.9 基础渲染，足够跑通下面的演示。完整 A2UI（流式、表单校验、深层 action context 对齐 React 2.10）会后续分 PR 补齐。

## 安装

```bash
pnpm add @ant-design-x-vue/x-card
```

## 代码演示

### 基础用法

::::demo-v2 注册本地 catalog，用 v0.9 命令渲染一个 Text 卡片。

x-card/basic

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

### Catalog helpers

- `registerCatalog(catalog)`
- `loadCatalog(catalogId)`
- `validateComponent(catalog, name, props)`
- `clearCatalogCache()`
