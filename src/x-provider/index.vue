<script setup lang="tsx">
import { computed } from 'vue';
import XProviderContextProvider from './context';
import type { XProviderProps } from './context';
import useXProviderContext from './hooks/use-x-provider-context';
import { ConfigProvider as AntdConfigProvider } from 'ant-design-vue';

defineOptions({ name: 'AXConfigProvider', inheritAttrs: false });

const {
  attachments,
  bubble,
  conversations,
  prompts,
  sender,
  suggestion,
  thoughtChain,
  welcome,
  ...antdConfProps
} = defineProps<XProviderProps>();

const slots = defineSlots<{
  default(props?: any): any
}>();

const xProviderProps = computed(() => ({
  attachments,
  bubble,
  conversations,
  prompts,
  sender,
  suggestion,
  thoughtChain,
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
        // Note:  we can not set `cssVar` by default.
        //        Since when developer not wrap with XProvider,
        //        the generate css is still using css var but no css var injected.
        // Origin comment: antdx enable cssVar by default, and antd v6 will enable cssVar by default
        // theme={{ cssVar: true, ...antdConfProps?.theme }}
        theme={mergedTheme.value}
      >
        {childNode.value}
      </AntdConfigProvider>
    </XProviderContextProvider>
  )
});
</script>
