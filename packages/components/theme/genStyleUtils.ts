import { genStyleUtils } from '../_util/cssinjs-utils';

import { useXProviderContext } from '../x-provider';
import { useInternalToken } from './useToken';

import type { ComponentTokenMap } from './components';
import type { AliasToken, SeedToken } from './cssinjs-utils';
import { unref } from 'vue';

export const { genStyleHooks, genComponentStyleHook, genSubStyleComponent } = genStyleUtils<
  ComponentTokenMap,
  AliasToken,
  SeedToken
>({
  usePrefix: () => {
    const { getPrefixCls, iconPrefixCls } = useXProviderContext();
    return {
      iconPrefixCls: unref(iconPrefixCls),
      rootPrefixCls: getPrefixCls(),
    };
  },
  useToken: () => {
    const [theme, realToken, hashId, token, cssVar] = useInternalToken();
    return { theme, realToken, hashId, token, cssVar };
  },
  useCSP: () => {
    const { csp } = useXProviderContext();
    return csp?.value ?? {};
  },
  layer: {
    name: 'antdx',
    dependencies: ['antd'],
  },
});
