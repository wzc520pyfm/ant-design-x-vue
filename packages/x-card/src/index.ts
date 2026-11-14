export { default as version } from './version';
export {
  default as XCard,
  type XAgentCommand_v0_9,
  type XAgentCommand_v0_8,
  type ActionPayload,
  type Catalog,
  type CatalogComponent,
  type CatalogFetchOptions,
  type CatalogRegistry,
  registerCatalog,
  loadCatalog,
  validateComponent,
  clearCatalogCache,
  createCatalogRegistry,
} from './x-card';
export { default as Card } from './Card';
export { default as Box } from './Box.vue';
export {
  useXCardField,
  validateFieldValue,
  type XCardFieldRule,
} from './hooks/use-x-card-field';
