# Common props

Correspondence between React `className` / `style`:

- Use Vue `class` and `style` for the root node.
- If a component declares `className` separately (for example, XMarkdown, Actions), both `class` and `className` can be used.
Use `classNames` and `styles` for semantic nodes, with keys being the component’s Semantic DOM, see the Semantic DOM at the bottom of each component page.

`Bubble.List` accepts both `roles` and `role`. If both are provided, `roles` is used. React 2.0 only has `role`.

These differences are also recorded in [From v1 to v2](/en/development/migration-v2).
