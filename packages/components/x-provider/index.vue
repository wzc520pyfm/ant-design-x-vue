<script setup lang="tsx">
import { computed } from 'vue';
import XProviderContextProvider from './context';
import type { AntdConfigProviderProps, XComponentsConfig } from './context';
import type { MarkdownComponentsConfig } from './XMarkdownComponents';
import useXProviderContext from './hooks/use-x-provider-context';
import { ConfigProvider as AntdConfigProvider } from 'ant-design-vue';
import LocaleProvider, { ANT_MARK } from '../locale/LocaleProvider';
import type { Locale as XLocale } from '../locale/interface';

defineOptions({ name: 'AXProvider', inheritAttrs: false });

interface ResolvedXProviderTheme {
  components?: Record<string, unknown>;
  [key: string]: unknown;
}

interface ResolvedXProviderProps {
  actions?: XComponentsConfig['actions'];
  attachments?: XComponentsConfig['attachments'];
  bubble?: XComponentsConfig['bubble'];
  conversations?: XComponentsConfig['conversations'];
  prompts?: XComponentsConfig['prompts'];
  sender?: XComponentsConfig['sender'];
  suggestion?: XComponentsConfig['suggestion'];
  thoughtChain?: XComponentsConfig['thoughtChain'];
  welcome?: XComponentsConfig['welcome'];
  fileCard?: XComponentsConfig['fileCard'];
  think?: XComponentsConfig['think'];
  mermaid?: MarkdownComponentsConfig['mermaid'];
  highlightCode?: MarkdownComponentsConfig['highlightCode'];
  iconPrefixCls?: AntdConfigProviderProps['iconPrefixCls'];
  getTargetContainer?: AntdConfigProviderProps['getTargetContainer'];
  getPopupContainer?: AntdConfigProviderProps['getPopupContainer'];
  prefixCls?: AntdConfigProviderProps['prefixCls'];
  getPrefixCls?: AntdConfigProviderProps['getPrefixCls'];
  renderEmpty?: AntdConfigProviderProps['renderEmpty'];
  transformCellText?: AntdConfigProviderProps['transformCellText'];
  csp?: AntdConfigProviderProps['csp'];
  input?: AntdConfigProviderProps['input'];
  autoInsertSpaceInButton?: AntdConfigProviderProps['autoInsertSpaceInButton'];
  locale?: XLocale;
  pageHeader?: AntdConfigProviderProps['pageHeader'];
  componentSize?: AntdConfigProviderProps['componentSize'];
  componentDisabled?: AntdConfigProviderProps['componentDisabled'];
  direction?: AntdConfigProviderProps['direction'];
  space?: AntdConfigProviderProps['space'];
  virtual?: AntdConfigProviderProps['virtual'];
  dropdownMatchSelectWidth?: AntdConfigProviderProps['dropdownMatchSelectWidth'];
  form?: AntdConfigProviderProps['form'];
  pagination?: AntdConfigProviderProps['pagination'];
  theme?: ResolvedXProviderTheme;
  select?: AntdConfigProviderProps['select'];
  wave?: AntdConfigProviderProps['wave'];
}

const {
  actions,
  attachments,
  bubble,
  conversations,
  prompts,
  sender,
  suggestion,
  thoughtChain,
  welcome,
  fileCard,
  think,
  mermaid,
  highlightCode,
  ...antdConfProps
} = defineProps<ResolvedXProviderProps>();

const slots = defineSlots<{
  default(props?: any): any
}>();

const xProviderProps = computed(() => ({
  actions,
  attachments,
  bubble,
  conversations,
  prompts,
  sender,
  suggestion,
  thoughtChain,
  fileCard,
  think,
  mermaid,
  highlightCode,
  welcome,
}));

const { theme: parentTheme } = useXProviderContext();

const mergedTheme = computed(() => ({
  ...(parentTheme?.value || {}),
  ...antdConfProps.theme,
}));

const childNode = computed(() => slots.default?.());

defineRender(() => {
  return (
    <XProviderContextProvider value={xProviderProps.value as any}>
      <AntdConfigProvider
        {...antdConfProps}
        locale={antdConfProps.locale as any}
        theme={mergedTheme.value as any}
      >
        <LocaleProvider
          locale={antdConfProps.locale as any}
          {...{ _ANT_MARK__: ANT_MARK }}
        >
          {childNode.value}
        </LocaleProvider>
      </AntdConfigProvider>
    </XProviderContextProvider>
  )
});
</script>
