import { computed, defineComponent, inject, provide, shallowRef, triggerRef, unref, watch } from "vue";
import type { ComputedRef, InjectionKey } from "vue";
import type { SenderHeaderContextProps } from "./interface";
import { objectType } from "../_util/type";

const SenderHeaderContextKey: InjectionKey<ComputedRef<SenderHeaderContextProps>> =
  Symbol('SenderHeaderContext');

export const globalSenderHeaderContextApi = shallowRef<SenderHeaderContextProps>();

export const useSenderHeaderContextProvider = (value: ComputedRef<SenderHeaderContextProps>) => {
  provide(SenderHeaderContextKey, value);
  watch(
    value,
    () => {
      globalSenderHeaderContextApi.value = unref(value);
      triggerRef(globalSenderHeaderContextApi);
    },
    { immediate: true, deep: true },
  );
};

export const useSenderHeaderContextInject = () => {
  return inject(
    SenderHeaderContextKey,
    computed(() => globalSenderHeaderContextApi.value || {}),
  );
};
export const SenderHeaderContextProvider = defineComponent({
  props: {
    value: objectType<SenderHeaderContextProps>(),
  },
  setup(props, { slots }) {
    useSenderHeaderContextProvider(computed(() => props.value));
    return () => {
      return slots.default?.();
    };
  },
});

export default SenderHeaderContextProvider;
