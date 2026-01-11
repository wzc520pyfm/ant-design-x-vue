import { computed, ComputedRef, defineComponent, inject, InjectionKey, provide, shallowRef, triggerRef, unref, watch } from "vue";
import { objectType } from "../_util/type";
import { BubbleContextProps } from "./interface";

const BubbleContextKey: InjectionKey<ComputedRef<BubbleContextProps>> =
  Symbol('BubbleContext');

export const globalBubbleContextApi = shallowRef<BubbleContextProps>();

export const useBubbleContextProvider = (value: ComputedRef<BubbleContextProps>) => {
  provide(BubbleContextKey, value);
  watch(
    value,
    () => {
      globalBubbleContextApi.value = unref(value);
      triggerRef(globalBubbleContextApi);
    },
    { immediate: true, deep: true },
  );
};

export const useBubbleContextInject = () => {
  return inject(
    BubbleContextKey,
    computed(() => globalBubbleContextApi.value || {}),
  );
};
export const BubbleContextProvider = defineComponent({
  props: {
    value: objectType<BubbleContextProps>(),
  },
  setup(props, { slots }) {
    useBubbleContextProvider(computed(() => props.value));
    return () => {
      return slots.default?.();
    };
  },
});

export default BubbleContextProvider;
