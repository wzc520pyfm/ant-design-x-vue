import { computed, defineComponent, inject, provide, shallowRef, triggerRef, unref, watch } from "vue";
import type { ComputedRef, InjectionKey } from "vue";

import { objectType } from "../../../_util/type";
import type { ActionButtonContextProps } from "../../interface";

const ActionButtonContextKey: InjectionKey<ComputedRef<ActionButtonContextProps>> =
  Symbol('ActionButtonContext');

export const globalActionButtonContextApi = shallowRef<ActionButtonContextProps>();

export const useActionButtonContextProvider = (value: ComputedRef<ActionButtonContextProps>) => {
  provide(ActionButtonContextKey, value);
  watch(
    value,
    () => {
      globalActionButtonContextApi.value = unref(value);
      triggerRef(globalActionButtonContextApi);
    },
    { immediate: true, deep: true },
  );
};

export const useActionButtonContextInject = () => {
  return inject(
    ActionButtonContextKey,
    computed(() => globalActionButtonContextApi.value || {}),
  );
};
export const ActionButtonContextProvider = defineComponent({
  props: {
    value: objectType<ActionButtonContextProps>(),
  },
  setup(props, { slots }) {
    useActionButtonContextProvider(computed(() => props.value));
    return () => {
      return slots.default?.();
    };
  },
});

export default ActionButtonContextProvider;
