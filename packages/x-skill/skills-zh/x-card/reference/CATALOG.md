# Catalog

```ts
import { registerCatalog, loadCatalog, validateComponent, clearCatalogCache } from '@ant-design-x-vue/x-card'

registerCatalog({
  catalogId: 'local://my_catalog.json',
  components: {
    Text: { type: 'object', properties: { text: { type: 'string' } }, required: ['text'] },
  },
})
```

- Local: `registerCatalog` before mount, `catalogId` referenced by `createSurface`
- Remote: `loadCatalog(catalogId)` when using HTTP catalog URLs
- `validateComponent(catalog, name, props)` for schema checks
- Component **implementation** names in the `components` map must be uppercase (Vue component convention, same as React)

Implement catalog components as Vue SFCs or `h()` render functions. They receive bound props plus `onAction` and `onDataChange`.
