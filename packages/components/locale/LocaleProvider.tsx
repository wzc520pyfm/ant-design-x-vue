import { computed, defineComponent, type PropType } from 'vue';
import { useLocaleContextProvider } from './context';
import type { Locale } from './interface';

export const ANT_MARK = 'internalMark';

export interface LocaleProviderProps {
  locale?: Locale;
  _ANT_MARK__?: string;
}

const LocaleProvider = defineComponent({
  name: 'LocaleProvider',
  inheritAttrs: false,
  props: {
    locale: Object as PropType<Locale>,
    _ANT_MARK__: String,
  },
  setup(props, { slots }) {
    const mergedLocale = computed(() => ({
      ...(props.locale || ({} as Locale)),
      exist: true,
    }));
    useLocaleContextProvider(mergedLocale);
    return () => slots.default?.();
  },
});

export default LocaleProvider;
