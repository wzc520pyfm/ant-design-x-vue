import { objectType, type AnyObject } from '../_util/type';
import { AttachmentsProps } from 'ant-design-x-vue/attachments';
import type { BubbleProps } from 'ant-design-x-vue/bubble';
import { computed, ComputedRef, CSSProperties, defineComponent, inject, InjectionKey, provide, shallowRef, triggerRef, unref, watch } from 'vue';
import type { ConfigProviderProps as OriAntdConfigProviderProps } from 'ant-design-vue';
import type { ConversationsProps } from 'ant-design-x-vue/conversations';
import type { PromptsProps } from 'ant-design-x-vue/prompts';
import type { SenderProps } from 'ant-design-x-vue/sender';
import type { SuggestionProps } from 'ant-design-x-vue/suggestion';
import type { ThoughtChainProps } from 'ant-design-x-vue/thought-chain';
import type { WelcomeProps } from 'ant-design-x-vue/welcome';

// refer from the ConfigProviderProps of ant-design-vue
export interface AntdConfigProviderProps {
  iconPrefixCls?: OriAntdConfigProviderProps['iconPrefixCls'];
  getTargetContainer?: OriAntdConfigProviderProps['getTargetContainer'];
  getPopupContainer?: OriAntdConfigProviderProps['getPopupContainer'];
  prefixCls?: OriAntdConfigProviderProps['prefixCls'];
  getPrefixCls?: OriAntdConfigProviderProps['getPrefixCls'];
  renderEmpty?: OriAntdConfigProviderProps['renderEmpty'];
  transformCellText?: OriAntdConfigProviderProps['transformCellText'];
  csp?: OriAntdConfigProviderProps['csp'];
  input?: OriAntdConfigProviderProps['input'];
  autoInsertSpaceInButton?: OriAntdConfigProviderProps['autoInsertSpaceInButton'];
  locale?: OriAntdConfigProviderProps['locale'];
  pageHeader?: OriAntdConfigProviderProps['pageHeader'];
  componentSize?: OriAntdConfigProviderProps['componentSize'];
  componentDisabled?: OriAntdConfigProviderProps['componentDisabled'];
  direction?: OriAntdConfigProviderProps['direction'];
  space?: OriAntdConfigProviderProps['space'];
  virtual?: OriAntdConfigProviderProps['virtual'];
  dropdownMatchSelectWidth?: OriAntdConfigProviderProps['dropdownMatchSelectWidth'];
  form?: OriAntdConfigProviderProps['form'];
  pagination?: OriAntdConfigProviderProps['pagination'];
  theme?: OriAntdConfigProviderProps['theme'];
  select?: OriAntdConfigProviderProps['select'];
  wave?: OriAntdConfigProviderProps['wave'];
}

export interface XComponentStyleConfig {
  classNames: Record<string, string>;
  styles: Record<string, CSSProperties>;
  className: string;
  style: CSSProperties;
}

export type DefaultPickType = keyof XComponentStyleConfig;

export type ComponentStyleConfig<
  CompProps extends AnyObject,
  PickType extends keyof CompProps = DefaultPickType,
> = Pick<CompProps, PickType | DefaultPickType>;

export interface XComponentsConfig {
  bubble?: ComponentStyleConfig<BubbleProps>;
  conversations?: ComponentStyleConfig<ConversationsProps>;
  prompts?: ComponentStyleConfig<PromptsProps>;
  sender?: ComponentStyleConfig<SenderProps>;
  suggestion?: ComponentStyleConfig<SuggestionProps>;
  thoughtChain?: ComponentStyleConfig<ThoughtChainProps>;
  attachments?: ComponentStyleConfig<AttachmentsProps>;
  welcome?: ComponentStyleConfig<WelcomeProps>;
}

export type XProviderProps = XComponentsConfig & AntdConfigProviderProps & {
  // Non-component config props
};

const XProviderContextKey: InjectionKey<ComputedRef<XProviderProps>> =
  Symbol('XProviderContext');

export const globalXProviderApi = shallowRef<XProviderProps>();

export const useXProviderContextProvider = (value: ComputedRef<XProviderProps>) => {
  provide(XProviderContextKey, value);
  watch(
    value,
    () => {
      globalXProviderApi.value = unref(value);
      triggerRef(globalXProviderApi);
    },
    { immediate: true, deep: true },
  );
};

export const useXProviderContextInject = () => {
  return inject(
    XProviderContextKey,
    computed(() => globalXProviderApi.value || {}),
  );
};
export const XProviderContextProvider = defineComponent({
  props: {
    value: objectType<XProviderProps>(),
  },
  setup(props, { slots }) {
    useXProviderContextProvider(computed(() => props.value));
    return () => {
      return slots.default?.();
    };
  },
});

export default XProviderContextProvider;
