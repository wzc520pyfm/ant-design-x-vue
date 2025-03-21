import useXProviderContext, {
  defaultPrefixCls,
} from './hooks/use-x-provider-context';
import XProvider from './index.vue';

export type { XProviderProps } from './context';

export { XProvider, defaultPrefixCls, useXProviderContext };

export default XProvider;
