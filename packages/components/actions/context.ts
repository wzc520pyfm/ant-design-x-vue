import type { CSSProperties, InjectionKey } from 'vue';
import { inject, provide } from 'vue';

export interface ActionsContextValue {
  prefixCls?: string;
  classNames?: {
    item?: string;
    itemDropdown?: string;
  };
  styles?: {
    item?: CSSProperties;
    itemDropdown?: CSSProperties;
  };
}

const ActionsContextKey: InjectionKey<ActionsContextValue> = Symbol('ActionsContext');

export function useActionsContextProvider(value: ActionsContextValue) {
  provide(ActionsContextKey, value);
}

export function useActionsContextInject(): ActionsContextValue {
  return inject(ActionsContextKey, {} as ActionsContextValue);
}

export default ActionsContextKey;
