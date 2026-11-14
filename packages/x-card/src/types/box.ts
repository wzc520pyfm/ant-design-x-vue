import type { Component } from 'vue';
import type { CatalogFetchOptions } from '../catalog';
import type { XAgentCommand_v0_8 } from './command_v0.8';
import type { A2UICommand_v0_9 } from './command_v0.9';

type ComponentName = `${Uppercase<string>}${string}`;

export interface ActionPayload {
  name: string;
  surfaceId: string;
  context: Record<string, any>;
}

export interface BoxProps {
  components?: Record<ComponentName, Component>;
  commands?: (A2UICommand_v0_9 | XAgentCommand_v0_8)[];
  onAction?: (payload: ActionPayload) => void;
  /** Scoped catalog registry and URL access policy. */
  catalogOptions?: CatalogFetchOptions;
}
