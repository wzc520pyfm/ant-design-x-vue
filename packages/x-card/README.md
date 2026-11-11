# @ant-design-x-vue/x-card

Vue port of [`@ant-design/x-card`](https://www.npmjs.com/package/@ant-design/x-card).

- `XCard.Box` / `XCard.Card`
- `registerCatalog` / `loadCatalog` / `validateComponent` / `clearCatalogCache`
- A2UI **v0.9** commands (`createSurface`, `updateComponents`, `updateDataModel`, `deleteSurface`)
- A2UI **v0.8** `surfaceUpdate` / `dataModelUpdate` / `beginRendering` / `deleteSurface`
- Action context plumbing: write-back via `{ path }` + resolve path refs when a component submits an empty context
- `onDataChange(path, value)` injected into custom components
- `useXCardField` / `validateFieldValue` for form-field validation in custom A2UI components

```bash
pnpm add @ant-design-x-vue/x-card
```
