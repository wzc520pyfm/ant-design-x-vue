# 通用属性

和 React 的 `className` / `style` 对应关系：

- 根节点用 Vue 的 `class` 和 `style`。
- 组件如果另外声明了 `className`（例如 XMarkdown、Actions），`class` 和 `className` 都能用。
- 语义化节点用 `classNames` 和 `styles`，键是该组件的 Semantic DOM，见各组件页底部的 Semantic DOM。

`Bubble.List` 同时接受 `roles` 和 `role`。两个都传时用 `roles`。React 2.0 只有 `role`。

这些差异也记在 [从 v1 到 v2](/development/migration-v2)。
