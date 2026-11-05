import hash from '@emotion/hash';
import { removeCSS, updateCSS } from '../../vc-util/Dom/dynamicCSS';
import canUseDom from '../../vc-util/Dom/canUseDom';

import { Theme } from './theme';

export const ATTR_TOKEN = 'data-token-hash';
export const ATTR_MARK = 'data-css-hash';
export const ATTR_CACHE_PATH = 'data-cache-path';

export type TokenWithCSSVar<
  V,
  T extends Record<string, V> = Record<string, V>,
> = {
  [key in keyof T]?: string | V;
};

// Create a cache here to avoid always loop generate
const flattenTokenCache = new WeakMap<any, string>();

export function flattenToken(token: any) {
  let str = flattenTokenCache.get(token) || '';

  if (!str) {
    Object.keys(token).forEach(key => {
      const value = token[key];
      str += key;
      if (value instanceof Theme) {
        str += value.id;
      } else if (value && typeof value === 'object') {
        str += flattenToken(value);
      } else {
        str += value;
      }
    });

    // Put in cache
    flattenTokenCache.set(token, str);
  }
  return str;
}

/**
 * Convert derivative token to key string
 */
export function token2key(token: any, salt: string): string {
  return hash(`${salt}_${flattenToken(token)}`);
}

const randomSelectorKey = `random-${Date.now()}-${Math.random()}`.replace(/\./g, '');

// Magic `content` for detect selector support
const checkContent = '_bAmBoO_';

function supportSelector(
  styleStr: string,
  handleElement: (ele: HTMLElement) => void,
  supportCheck?: (ele: HTMLElement) => boolean,
): boolean {
  if (canUseDom()) {
    updateCSS(styleStr, randomSelectorKey);

    const ele = document.createElement('div');
    ele.style.position = 'fixed';
    ele.style.left = '0';
    ele.style.top = '0';
    handleElement?.(ele);
    document.body.appendChild(ele);

    if (process.env.NODE_ENV !== 'production') {
      ele.innerHTML = 'Test';
      ele.style.zIndex = '9999999';
    }

    const support = supportCheck
      ? supportCheck(ele)
      : getComputedStyle(ele).content?.includes(checkContent);

    ele.parentNode?.removeChild(ele);
    removeCSS(randomSelectorKey);

    return support;
  }

  return false;
}

let canLayer: boolean | undefined = undefined;
export function supportLayer(): boolean {
  if (canLayer === undefined) {
    canLayer = supportSelector(
      `@layer ${randomSelectorKey} { .${randomSelectorKey} { content: "${checkContent}"!important; } }`,
      ele => {
        ele.className = randomSelectorKey;
      },
    );
  }

  return canLayer!;
}

let canWhere: boolean | undefined = undefined;
export function supportWhere(): boolean {
  if (canWhere === undefined) {
    canWhere = supportSelector(
      `:where(.${randomSelectorKey}) { content: "${checkContent}"!important; }`,
      ele => {
        ele.className = randomSelectorKey;
      },
    );
  }

  return canWhere!;
}

let canLogic: boolean | undefined = undefined;
export function supportLogicProps(): boolean {
  if (canLogic === undefined) {
    canLogic = supportSelector(
      `.${randomSelectorKey} { inset-block: 93px !important; }`,
      ele => {
        ele.className = randomSelectorKey;
      },
      ele => getComputedStyle(ele).bottom === '93px',
    );
  }

  return canLogic!;
}

export const isClientSide = canUseDom();

export function unit(num: string | number) {
  if (typeof num === 'number') {
    return `${num}px`;
  }
  return num;
}

export const token2CSSVar = (token: string, prefix = '') => {
  return `--${prefix ? `${prefix}-` : ''}${token}`
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z0-9]+)/g, '$1-$2')
    .replace(/([a-z])([A-Z0-9])/g, '$1-$2')
    .toLowerCase();
};

export function toStyleStr(
  style: string,
  tokenKey?: string,
  styleId?: string,
  customizeAttrs: Record<string, string> = {},
  plain = false,
) {
  if (plain) {
    return style;
  }
  const attrs: Record<string, string | undefined> = {
    ...customizeAttrs,
    [ATTR_TOKEN]: tokenKey,
    [ATTR_MARK]: styleId,
  };

  const attrStr = Object.keys(attrs)
    .map((attr) => {
      const val = attrs[attr];
      return val ? `${attr}="${val}"` : null;
    })
    .filter((v) => v)
    .join(' ');

  return `<style ${attrStr}>${style}</style>`;
}

export const serializeCSSVar = <T extends Record<string, any>>(
  cssVars: T,
  hashId: string,
  options?: {
    scope?: string;
  },
) => {
  if (!Object.keys(cssVars).length) {
    return '';
  }
  return `.${hashId}${
    options?.scope ? `.${options.scope}` : ''
  }{${Object.entries(cssVars)
    .map(([key, value]) => `${key}:${value};`)
    .join('')}}`;
};

export const transformToken = <
  V,
  T extends Record<string, V> = Record<string, V>,
>(
  token: T,
  themeKey: string,
  config?: {
    prefix?: string;
    ignore?: {
      [key in keyof T]?: boolean;
    };
    unitless?: {
      [key in keyof T]?: boolean;
    };
    preserve?: {
      [key in keyof T]?: boolean;
    };
    scope?: string;
  },
): [TokenWithCSSVar<V, T>, string] => {
  const cssVars: Record<string, string> = {};
  const result: TokenWithCSSVar<V, T> = {};
  Object.entries(token).forEach(([key, value]) => {
    if (config?.preserve?.[key]) {
      result[key as keyof T] = value;
    } else if (
      (typeof value === 'string' || typeof value === 'number') &&
      !config?.ignore?.[key]
    ) {
      const cssVar = token2CSSVar(key, config?.prefix);
      cssVars[cssVar] =
        typeof value === 'number' && !config?.unitless?.[key]
          ? `${value}px`
          : String(value);
      result[key as keyof T] = `var(${cssVar})`;
    }
  });
  return [result, serializeCSSVar(cssVars, themeKey, { scope: config?.scope })];
};
