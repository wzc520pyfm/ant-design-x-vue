<script setup lang="tsx">
import { computed } from 'vue';
import XProviderContextProvider from './context';
import type { XProviderProps } from './context';
import useXProviderContext from './hooks/use-x-provider-context';
import { ConfigProvider as AntdConfigProvider } from 'ant-design-vue';

defineOptions({ name: 'AXProvider', inheritAttrs: false });

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
} = defineProps<XProviderProps>();

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
    <XProviderContextProvider value={xProviderProps.value}>
      <AntdConfigProvider
        {...antdConfProps}
        theme={mergedTheme.value}
      >
        {childNode.value}
      </AntdConfigProvider>
    </XProviderContextProvider>
  )
});
</script>
