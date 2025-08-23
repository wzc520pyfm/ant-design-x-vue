import { computed, ComputedRef, defineComponent, inject, InjectionKey, provide, shallowRef, triggerRef, unref, watch } from "vue";
import { objectType } from "../_util/type";
import { AttachmentContextProps } from "./interface";

const AttachmentContextKey: InjectionKey<ComputedRef<AttachmentContextProps>> =
  Symbol('AttachmentContext');

export const globalAttachmentContextApi = shallowRef<AttachmentContextProps>();

export const useAttachmentContextProvider = (value: ComputedRef<AttachmentContextProps>) => {
  provide(AttachmentContextKey, value);
  watch(
    value,
    () => {
      globalAttachmentContextApi.value = unref(value);
      triggerRef(globalAttachmentContextApi);
    },
    { immediate: true, deep: true },
  );
};

export const useAttachmentContextInject = () => {
  return inject(
    AttachmentContextKey,
    computed(() => globalAttachmentContextApi.value || {}),
  );
};
export const AttachmentContextProvider = defineComponent({
  inheritAttrs: false,
  props: {
    value: objectType<AttachmentContextProps>(),
  },
  setup(props, { slots }) {
    useAttachmentContextProvider(computed(() => props.value));
    return () => {
      return slots.default?.();
    };
  },
});

export default AttachmentContextProvider;
