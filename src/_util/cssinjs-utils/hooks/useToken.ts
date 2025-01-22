import type { Ref } from 'vue';
import type { Theme, TokenType } from '../../cssinjs';

import type { OverrideTokenMap, TokenMap, GlobalToken } from '../interface';

export type TokenMapWithTheme<
  CompTokenMap extends TokenMap,
  AliasToken extends TokenType,
  DesignToken extends TokenType,
> = {
  [key in keyof OverrideTokenMap<CompTokenMap, AliasToken>]?: OverrideTokenMap<
    CompTokenMap,
    AliasToken
  >[key] & {
    theme?: Theme<DesignToken, AliasToken>;
  };
};

export interface UseTokenReturn<
  CompTokenMap extends TokenMap,
  AliasToken extends TokenType,
  DesignToken extends TokenType,
> {
  token: Ref<GlobalToken<CompTokenMap, AliasToken>>;
  realToken?: GlobalToken<CompTokenMap, AliasToken>;
  theme?: Ref<Theme<DesignToken, AliasToken>>;
  components?: TokenMapWithTheme<CompTokenMap, DesignToken, AliasToken>;
  hashId?: Ref<string>;
  hashed?: string | boolean;
  cssVar?: {
    prefix?: string;
    key?: string;
  };
}

export type UseToken<
  CompTokenMap extends TokenMap,
  DesignToken extends TokenType,
  AliasToken extends TokenType,
> = () => UseTokenReturn<CompTokenMap, DesignToken, AliasToken>;
