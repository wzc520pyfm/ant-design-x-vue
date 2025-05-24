import { ConfigProvider } from 'ant-design-vue';

export const defaultPrefixCls = 'ant';

function useXProviderContext() {
  const { getPrefixCls, direction, csp, iconPrefixCls, theme } = ConfigProvider.useConfigContextInject();

  return {
    theme,
    getPrefixCls,
    direction,
    csp,
    iconPrefixCls,
  };
}

export default useXProviderContext;
