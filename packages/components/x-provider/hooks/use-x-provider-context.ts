import { useConfigContextInject } from 'ant-design-vue/es/config-provider/context.js';

export const defaultPrefixCls = 'ant';

function useXProviderContext() {
  const { getPrefixCls, direction, csp, iconPrefixCls, theme } = useConfigContextInject();

  return {
    theme,
    getPrefixCls,
    direction,
    csp,
    iconPrefixCls,
  };
}

export default useXProviderContext;
