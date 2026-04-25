import type { ComputedRef, InjectionKey } from 'vue';
import { computed, inject, provide, shallowRef, unref, watch } from 'vue';
import type { LocaleContextProps } from './interface';

const LocaleContextKey: InjectionKey<ComputedRef<LocaleContextProps | undefined>> =
  Symbol('ant-design-x-vue.LocaleContext');

export const globalLocaleApi = shallowRef<LocaleContextProps | undefined>();

export function useLocaleContextProvider(value: ComputedRef<LocaleContextProps | undefined>) {
  provide(LocaleContextKey, value);
  watch(
    value,
    () => {
      globalLocaleApi.value = unref(value);
    },
    { immediate: true, deep: true },
  );
}

export function useLocaleContextInject() {
  return inject(
    LocaleContextKey,
    computed(() => globalLocaleApi.value),
  );
}

export default LocaleContextKey;
