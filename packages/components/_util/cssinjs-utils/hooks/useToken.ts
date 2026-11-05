import type { MaybeRef, Ref } from 'vue';
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
  /**
   * Derivative token including component overrides.
   * Vue does not re-run this hook on theme changes, so this stays a ref.
   * `genStyleHooks` reads it again whenever styles are regenerated.
   */
  realToken?: MaybeRef<GlobalToken<CompTokenMap, AliasToken>>;
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
