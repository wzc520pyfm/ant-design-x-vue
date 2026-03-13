import { computed, defineComponent, inject, provide, shallowRef, triggerRef, unref, watch } from "vue";
import type { ComputedRef, InjectionKey } from "vue";
import type { SenderHeaderContextProps, SenderProps } from "./interface";
import { objectType } from "../_util/type";

// ========================= SenderContext =========================
const SenderContextKey: InjectionKey<ComputedRef<SenderProps>> =
  Symbol('SenderContext');

export const globalSenderContextApi = shallowRef<SenderProps>();

export const useSenderContextProvider = (value: ComputedRef<SenderProps>) => {
  provide(SenderContextKey, value);
  watch(
    value,
    () => {
      globalSenderContextApi.value = unref(value);
      triggerRef(globalSenderContextApi);
    },
    { immediate: true, deep: true },
  );
};

export const useSenderContextInject = () => {
  return inject(
    SenderContextKey,
    computed(() => globalSenderContextApi.value || ({} as SenderProps)),
  );
};

export const SenderContextProvider = defineComponent({
  props: {
    value: objectType<SenderProps>(),
  },
  setup(props, { slots }) {
    useSenderContextProvider(computed(() => props.value as SenderProps));
    return () => {
      return slots.default?.();
    };
  },
});

// ====================== SenderHeaderContext ======================
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
