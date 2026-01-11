import { computed, type ComputedRef, defineComponent, inject, type InjectionKey, provide, shallowRef, triggerRef, unref, watch } from "vue";
import { objectType } from "../_util/type";
import type { ThoughtChainNodeContextProps } from "./interface";

const ThoughtChainNodeContextKey: InjectionKey<ComputedRef<ThoughtChainNodeContextProps>> =
  Symbol('ThoughtChainNodeContext');

export const globalThoughtChainNodeContextApi = shallowRef<ThoughtChainNodeContextProps>();

export const useThoughtChainNodeContextProvider = (value: ComputedRef<ThoughtChainNodeContextProps>) => {
  provide(ThoughtChainNodeContextKey, value);
  watch(
    value,
    () => {
      globalThoughtChainNodeContextApi.value = unref(value);
      triggerRef(globalThoughtChainNodeContextApi);
    },
    { immediate: true, deep: true },
  );
};

export const useThoughtChainNodeContextInject = () => {
  return inject(
    ThoughtChainNodeContextKey,
    computed(() => globalThoughtChainNodeContextApi.value || {}),
  );
};
export const ThoughtChainNodeContextProvider = defineComponent({
  props: {
    value: objectType<ThoughtChainNodeContextProps>(),
  },
  setup(props, { slots }) {
    useThoughtChainNodeContextProvider(computed(() => props.value));
    return () => {
      return slots.default?.();
    };
  },
});

export default ThoughtChainNodeContextProvider;
