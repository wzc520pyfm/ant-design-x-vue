import type { InjectionKey } from 'vue';
import type { Catalog } from './catalog';
import type { ActionPayload, BoxProps } from './types/box';
import type { XAgentCommand_v0_8 } from './types/command_v0.8';
import type { A2UICommand_v0_9 } from './types/command_v0.9';

export interface BoxContextValue {
  components: BoxProps['components'];
  commandQueue: (A2UICommand_v0_9 | XAgentCommand_v0_8)[];
  onAction?: (payload: ActionPayload) => void;
  catalogMap: Map<string, Catalog>;
  surfaceCatalogMap: Map<string, string>;
}

export const boxContextKey: InjectionKey<BoxContextValue> = Symbol('XCardBox');
