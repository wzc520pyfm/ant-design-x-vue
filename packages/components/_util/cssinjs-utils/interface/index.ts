import type { Ref, VNode } from 'vue';

export type {
  OverrideTokenMap,
  TokenMap,
  TokenMapKey,
  GlobalTokenWithComponent,
  ComponentToken,
  ComponentTokenKey,
  GlobalToken,
} from './components';

export type UseComponentStyleResult = [(node: VNode) => VNode, Ref<string>];
