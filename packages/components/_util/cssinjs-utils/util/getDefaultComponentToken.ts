import type { TokenType } from '../../cssinjs';
import { merge as mergeToken } from './statistic';
import type { GetDefaultToken, GetDefaultTokenFn } from './genStyleUtils';
import type { GlobalToken, TokenMap, TokenMapKey } from '../interface';

function getDefaultComponentToken<
  CompTokenMap extends TokenMap,
  AliasToken extends TokenType,
  C extends TokenMapKey<CompTokenMap>,
>(
  component: C,
  token: GlobalToken<CompTokenMap, AliasToken> = {} as any,
  getDefaultToken: GetDefaultToken<CompTokenMap, AliasToken, C>,
): any {
  if (typeof getDefaultToken === 'function') {
    return (getDefaultToken as GetDefaultTokenFn<CompTokenMap, AliasToken, C>)(
      mergeToken<any>(token, token[component] ?? {}),
    );
  }
  return getDefaultToken ?? {};
}

export default getDefaultComponentToken;
