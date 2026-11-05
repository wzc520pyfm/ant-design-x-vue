declare module 'ant-design-x-vue' {
  import type { Component, ComputedRef } from 'vue';

  export function useXProviderContext(): {
    getPrefixCls: (suffixCls?: string, customizePrefixCls?: string) => string;
    direction?: { value?: 'ltr' | 'rtl' };
  };

  export function useLocale(
    componentName: string,
    defaultLocale?: object,
  ): readonly [ComputedRef<Record<string, string>>, ComputedRef<string>];

  export const Actions: Component;
}
