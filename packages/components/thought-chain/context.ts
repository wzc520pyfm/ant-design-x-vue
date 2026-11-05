import { computed, type ComputedRef, defineComponent, inject, type InjectionKey, provide, shallowRef, triggerRef, unref, watch } from 'vue';
import { objectType } from '../_util/type';
import type { ThoughtChainContextType } from './interface';

const ThoughtChainContextKey: InjectionKey<ComputedRef<ThoughtChainContextType>> =
  Symbol('ThoughtChainContext');

export const globalThoughtChainContextApi = shallowRef<ThoughtChainContextType>();

export const useThoughtChainContextProvider = (value: ComputedRef<ThoughtChainContextType>) => {
  provide(ThoughtChainContextKey, value);
  watch(
    value,
    () => {
      globalThoughtChainContextApi.value = unref(value);
      triggerRef(globalThoughtChainContextApi);
    },
    { immediate: true, deep: true },
  );
};

export const useThoughtChainContextInject = () => {
  return inject(
    ThoughtChainContextKey,
    computed(() => globalThoughtChainContextApi.value || {}),
  );
};

export const ThoughtChainContextProvider = defineComponent({
  props: {
    value: objectType<ThoughtChainContextType>(),
  },
  setup(props, { slots }) {
    useThoughtChainContextProvider(computed(() => props.value));
    return () => {
      return slots.default?.();
    };
  },
});

export default ThoughtChainContextProvider;
