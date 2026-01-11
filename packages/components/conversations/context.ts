import { shallowRef, provide, watch, unref, triggerRef, inject, computed, defineComponent } from 'vue';
import type { ComputedRef, InjectionKey } from "vue";
import type { GroupTitleContextProps } from './interface'
import { objectType } from '../_util/type';

const GroupTitleContextKey: InjectionKey<ComputedRef<GroupTitleContextProps>> =
  Symbol('GroupTitleContext');

export const globalGroupTitleContextApi = shallowRef<GroupTitleContextProps>();

// User should not care about internal state.
// Which should pass by context instead.
export const useGroupTitleContextProvider = (value: ComputedRef<GroupTitleContextProps>) => {
  provide(GroupTitleContextKey, value);
  watch(
    value,
    () => {
      globalGroupTitleContextApi.value = unref(value);
      triggerRef(globalGroupTitleContextApi);
    },
    { immediate: true, deep: true },
  );
};

export const useGroupTitleContextInject = () => {
  return inject(
    GroupTitleContextKey,
    computed(() => globalGroupTitleContextApi.value || {}),
  );
};

export const GroupTitleContextProvider = defineComponent({
  props: {
    value: objectType<GroupTitleContextProps>(),
  },
  setup(props, { slots }) {
    useGroupTitleContextProvider(computed(() => props.value));
    return () => {
      return slots.default?.();
    };
  },
});

export default GroupTitleContextProvider;

