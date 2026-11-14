import Box from './Box.vue';
import Card from './Card';

export type { BoxProps, ActionPayload } from './types/box';
export type { XAgentCommand_v0_9 } from './types/command_v0.9';
export type { XAgentCommand_v0_8 } from './types/command_v0.8';
export type {
  Catalog,
  CatalogComponent,
  CatalogFetchOptions,
  CatalogRegistry,
} from './catalog';
export {
  loadCatalog,
  registerCatalog,
  validateComponent,
  clearCatalogCache,
  createCatalogRegistry,
} from './catalog';

const XCard = { Card, Box };

export default XCard;
