import { computed, type ComputedRef } from 'vue';
import defaultLocaleData from './en_US';
import type { Locale, xLocale, xMarkdownLocale } from './interface';
import { useLocaleContextInject } from './context';

type LocaleComponentName = Exclude<keyof xLocale, 'locale'>;
type MarkdownComponentName = Exclude<keyof xMarkdownLocale, 'locale'>;
type AntdLocaleComponentName = Exclude<keyof Locale, keyof xLocale | keyof xMarkdownLocale>;
type MergedLocaleComponentName =
  | LocaleComponentName
  | AntdLocaleComponentName
  | MarkdownComponentName;

export default function useLocale<C extends MergedLocaleComponentName = LocaleComponentName>(
  componentName: C,
  defaultLocale?: Locale[C] | (() => Locale[C]),
): readonly [ComputedRef<NonNullable<Locale[C]>>, ComputedRef<string>] {
  const fullLocale = useLocaleContextInject();

  const mergedLocale = computed<NonNullable<Locale[C]>>(() => {
    const fallback =
      defaultLocale ||
      (defaultLocaleData as any)?.[componentName as LocaleComponentName];
    const contextLocale = fullLocale.value?.[componentName] ?? {};
    const resolvedFallback = typeof fallback === 'function' ? (fallback as any)() : fallback;
    return {
      ...(resolvedFallback || {}),
      ...(contextLocale as object),
    } as NonNullable<Locale[C]>;
  });

  const localeCode = computed<string>(() => {
    const code = fullLocale.value?.locale;
    if (fullLocale.value?.exist && !code) {
      return defaultLocaleData.locale;
    }
    return code!;
  });

  return [mergedLocale, localeCode] as const;
}
