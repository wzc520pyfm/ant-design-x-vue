---
name: x-card
version: 2.10.0
description: 使用 @ant-design-x-vue/x-card 构建 A2UI 动态卡片：XCard.Box / XCard.Card、v0.9 命令、数据绑定、catalog 与 action。只写 Vue SFC。
---

# 技能定位

`@ant-design-x-vue/x-card` 是 A2UI 协议的 Vue 渲染器。Agent 下发 JSON 命令，客户端渲染成原生 Vue 组件。

新项目请用 **v0.9**，每条命令都要带 `"version": "v0.9"`。

```ts
import { XCard, registerCatalog, useXCardField } from '@ant-design-x-vue/x-card'
```

- `XCard.Box`：命令队列、组件注册表、汇总 `:on-action`
- `XCard.Card`：按 `id`（surfaceId）渲染
- `components` 传给 **Box** 而不是 Card，且对象引用要稳定
- 自定义组件名必须大写开头

# 最小示例

见英文 skill 中的完整 SFC，或站点 https://x-vue.ant.design/x-card/introduce 。要点：

1. `registerCatalog` 先于挂载
2. `createSurface` → `updateComponents`（必须有 `id: "root"`，子节点用 id 字符串）→ `updateDataModel`
3. 模板：`<XCard.Box :commands :components :on-action>` + `<XCard.Card id="..." />`
4. 流式时 **追加** 命令，不要整表替换
5. 双向输入使用 `value: { path: '...' }`，并通过注入的 `onDataChange` 或 `useXCardField` 回写
6. action 里的 `{ path }` 会在 `ActionPayload.context` 里被解析成 `{ value }`

# 开发规则

- 从 `@ant-design-x-vue/x-card` 引入，不要用 `@ant-design/x-card`
- 结构用 `updateComponents`，数据用 `updateDataModel`
- Vue 模板用 `class`、`@click`、`:on-action`，不要 JSX / `className`

# 参考

- [USAGE.md](reference/USAGE.md) / [COMMANDS.md](reference/COMMANDS.md) / [DATA_BINDING.md](reference/DATA_BINDING.md) / [ACTIONS.md](reference/ACTIONS.md) / [CATALOG.md](reference/CATALOG.md) / [API.md](reference/API.md)
