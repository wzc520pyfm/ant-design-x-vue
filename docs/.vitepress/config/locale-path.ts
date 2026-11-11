/** Locale prefix used by the English VitePress tree (`docs/en/**` → `/en/...`). */
export const EN_LOCALE_PREFIX = '/en'

export function stripLocalePrefix(input: string): string {
  let path = input.split('#')[0].split('?')[0]
  path = path.replace(/\.html$/, '')
  if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1)
  if (!path.startsWith('/')) path = `/${path}`
  if (path === EN_LOCALE_PREFIX) return '/'
  if (path.startsWith(`${EN_LOCALE_PREFIX}/`)) {
    const rest = path.slice(EN_LOCALE_PREFIX.length)
    return rest || '/'
  }
  return path || '/'
}

export function isEnglishPath(input: string): boolean {
  const path = input.split('#')[0].split('?')[0].replace(/\.html$/, '')
  return path === EN_LOCALE_PREFIX || path.startsWith(`${EN_LOCALE_PREFIX}/`) || path === `${EN_LOCALE_PREFIX}/`
}

export function withLocalePrefix(path: string, locale: 'root' | 'en' | string): string {
  const clean = path.startsWith('/') ? path : `/${path}`
  if (locale !== 'en') {
    return clean === EN_LOCALE_PREFIX ? '/' : clean.startsWith(`${EN_LOCALE_PREFIX}/`) ? clean.slice(EN_LOCALE_PREFIX.length) : clean
  }
  if (clean === '/') return `${EN_LOCALE_PREFIX}/`
  if (clean === EN_LOCALE_PREFIX || clean.startsWith(`${EN_LOCALE_PREFIX}/`)) return clean
  return `${EN_LOCALE_PREFIX}${clean}`
}

export function counterpartLocalePath(path: string, currentLocale: 'root' | 'en' | string): string {
  const logical = stripLocalePrefix(path)
  if (currentLocale === 'en' || isEnglishPath(path)) {
    return logical
  }
  return withLocalePrefix(logical, 'en')
}
