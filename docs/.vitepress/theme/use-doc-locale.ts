import { computed } from 'vue'
import { useData } from 'vitepress'
import { counterpartLocalePath, withLocalePrefix } from '../config/locale-path'

export function useDocLocale() {
  const { lang, localeIndex } = useData()
  const isEn = computed(() => localeIndex.value === 'en' || lang.value.startsWith('en'))
  const locale = computed(() => (isEn.value ? 'en' : 'root'))
  const lp = (path: string) => withLocalePrefix(path, locale.value)
  const otherPath = (path: string) => counterpartLocalePath(path, locale.value)
  return { isEn, lang, localeIndex, locale, lp, otherPath }
}
