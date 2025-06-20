import useXProviderContext, {
  defaultPrefixCls,
} from './hooks/use-x-provider-context';
import XProvider from './index.vue';

export type { XProviderProps } from './context';

// @ts-ignore
XProvider.install = function(app: App) {
  app.component(XProvider.name, XProvider);

  // @deprecated
  app.component('AXConfigProvider', XProvider);

  return app;
}

export { XProvider, defaultPrefixCls, useXProviderContext };

export default XProvider;
