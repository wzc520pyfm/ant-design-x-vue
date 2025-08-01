import { createTheme, useCacheToken } from '../_util/cssinjs';
import { theme as antdTheme } from 'ant-design-vue';
import { ignore, unitless } from './patch-antd';
import formatToken from 'ant-design-vue/es/theme/util/alias.js';

import version from '../version';

import type { Theme } from '../_util/cssinjs';
import type { DesignTokenProviderProps } from './patch-antd';
import type { AliasToken, GlobalToken, SeedToken } from './cssinjs-utils';
import { computed, type Ref, unref } from 'vue';

const defaultTheme: Theme<SeedToken, AliasToken> = createTheme(antdTheme.defaultAlgorithm);

const preserve: {
  [key in keyof AliasToken]?: boolean;
} = {
  screenXS: true,
  screenXSMin: true,
  screenXSMax: true,
  screenSM: true,
  screenSMMin: true,
  screenSMMax: true,
  screenMD: true,
  screenMDMin: true,
  screenMDMax: true,
  screenLG: true,
  screenLGMin: true,
  screenLGMax: true,
  screenXL: true,
  screenXLMin: true,
  screenXLMax: true,
  screenXXL: true,
  screenXXLMin: true,
};

export const getComputedToken = (
  originToken: SeedToken,
  overrideToken: DesignTokenProviderProps['components'] & {
    override?: Partial<AliasToken>;
  },
  theme: Theme<any, any>,
) => {
  const derivativeToken = theme.getDerivativeToken(originToken);

  const { override, ...components } = overrideToken;

  // Merge with override
  let mergedDerivativeToken = {
    ...derivativeToken,
    override,
  };

  // Format if needed
  mergedDerivativeToken = formatToken(mergedDerivativeToken);

  if (components) {
    Object.entries(components).forEach(([key, value]) => {
      const { theme: componentTheme, ...componentTokens } = value;
      let mergedComponentToken = componentTokens;
      if (componentTheme) {
        mergedComponentToken = getComputedToken(
          {
            ...mergedDerivativeToken,
            ...componentTokens,
          },
          {
            override: componentTokens,
          },
          componentTheme as unknown as Theme<any, any>,
        );
      }
      mergedDerivativeToken[key] = mergedComponentToken;
    });
  }

  return mergedDerivativeToken;
};
export function useInternalToken(): [
  theme: Ref<Theme<SeedToken, AliasToken>>,
  token: GlobalToken,
  hashId: Ref<string>,
  realToken: Ref<GlobalToken>,
  cssVar?: DesignTokenProviderProps['cssVar'],
] {
  const { token: myToken, hashId: myHashId, theme: myTheme } = antdTheme.useToken();
  const designToken = computed(() => {
    return {
      token: myToken.value,
      hashed: myHashId.value,
      theme: myTheme.value
    }
  });
  const {
    // @ts-expect-error
    override,
    // @ts-expect-error
    cssVar,
  } = unref(designToken);

  const rootDesignToken = computed(() => designToken.value.token);
  const hashed = computed(() => designToken.value.hashed);
  const theme = computed(() => designToken.value.theme ?? defaultTheme);

  const catchToken = useCacheToken<GlobalToken, SeedToken>(
    // @ts-expect-error
    computed(() => theme.value),
    computed(() => [antdTheme.defaultSeed, rootDesignToken.value]),
    computed(() => ({
      salt: `${version}-${hashed.value || ''}`,
      override,
      getComputedToken,
      cssVar: cssVar && {
        prefix: cssVar.prefix,
        key: cssVar.key,
        unitless,
        ignore,
        preserve,
      },
    })),
  );
  const [
    _, // token
    __, // hashId
    // @ts-expect-error
    realToken,
  ] = unref(catchToken);
  const token = computed(() => catchToken.value[0]);
  const hashId = computed(() => hashed.value ? catchToken.value[1] : '');
  return [theme as Ref<Theme<SeedToken, AliasToken>>, realToken, hashId, token, cssVar];
}

export default function useToken() {
  const [theme, token, hashId] = useInternalToken();

  return { theme, token, hashId };
}
