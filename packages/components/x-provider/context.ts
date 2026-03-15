import { objectType, type AnyObject, type ShortcutKeys } from '../_util/type';
import type { ActionsProps } from '../actions';
import type { AttachmentsProps } from '../attachments';
import type { BubbleProps } from '../bubble';
import {
  computed,
  type ComputedRef,
  type CSSProperties,
  defineComponent,
  inject,
  type InjectionKey,
  provide,
  shallowRef,
  triggerRef,
  unref,
  watch,
} from 'vue';
import type { ConfigProviderProps as OriAntdConfigProviderProps } from 'ant-design-vue';
import type { ConversationsProps } from '../conversations';
import type { PromptsProps } from '../prompts';
import type { SenderProps } from '../sender';
import type { SuggestionProps } from '../suggestion';
import type { ThinkProps } from '../think';
import type { ThoughtChainProps } from '../thought-chain';
import type { FileCardProps } from '../file-card';
import type { SourcesProps } from '../sources';
import type { WelcomeProps } from '../welcome';
import type { OverrideToken } from '../theme/cssinjs-utils';
import type { MarkdownComponentsConfig as XMarkdownComponentsConfig } from './XMarkdownComponents';

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

interface BaseComponentConfig {
  style: CSSProperties;
  styles: Record<string, CSSProperties>;
  className: string;
  classNames: Record<string, string>;
}

export interface XComponentConfig extends BaseComponentConfig {
  shortcutKeys: Record<string, ShortcutKeys>;
}

export type ComponentStyleConfig<
  CompProps extends AnyObject,
  PickType extends keyof CompProps = keyof BaseComponentConfig,
> = Pick<CompProps, PickType>;

export interface XComponentsConfig {
  actions?: ComponentStyleConfig<ActionsProps>;
  bubble?: ComponentStyleConfig<BubbleProps>;
  conversations?: ComponentStyleConfig<ConversationsProps, keyof XComponentConfig>;
  prompts?: ComponentStyleConfig<PromptsProps>;
  sender?: ComponentStyleConfig<SenderProps>;
  suggestion?: ComponentStyleConfig<SuggestionProps>;
  think?: ComponentStyleConfig<ThinkProps>;
  thoughtChain?: ComponentStyleConfig<ThoughtChainProps>;
  attachments?: ComponentStyleConfig<AttachmentsProps>;
  fileCard?: ComponentStyleConfig<FileCardProps>;
  sources?: ComponentStyleConfig<SourcesProps>;
  welcome?: ComponentStyleConfig<WelcomeProps>;
}

type ComponentsConfig = {
  [key in keyof OverrideToken]?: OverrideToken[key];
};

export type XProviderProps = XComponentsConfig &
  XMarkdownComponentsConfig &
  Omit<AntdConfigProviderProps, 'theme'> & {
    theme?: Omit<NonNullable<AntdConfigProviderProps['theme']>, 'components'> & {
      components?: NonNullable<AntdConfigProviderProps['theme']>['components'] & ComponentsConfig;
    };
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
