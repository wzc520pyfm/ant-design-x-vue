import type { DefaultTheme } from 'vitepress'
import { describe, expect, it } from 'vitest'
import { sidebar as enSidebar } from './en'
import { nav as enNav } from './en'
import { nav as zhNav, sidebar as zhSidebar } from './nav'
import { stripLocalePrefix, withLocalePrefix } from './locale-path'

/**
 * Simplified copy of VitePress' `getSidebar`
 * (`theme-default/support/sidebar.ts`) for a multi-sidebar `SidebarItem[]`
 * config: pick the key with the most path segments that is a prefix of the
 * page path, then merge `base` into every item link.
 */
function getSidebar(sidebar: DefaultTheme.Sidebar, path: string): DefaultTheme.SidebarItem[] {
  if (Array.isArray(sidebar)) return addBase(sidebar)
  const page = path.startsWith('/') ? path : `/${path}`
  const dir = Object.keys(sidebar)
    .sort((a, b) => b.split('/').length - a.split('/').length)
    .find((dir) => page.startsWith(dir.startsWith('/') ? dir : `/${dir}`))
  const value = dir ? sidebar[dir] : []
  return Array.isArray(value)
    ? addBase(value)
    : addBase(value.items, (value as { base?: string }).base)
}

function addBase(items: DefaultTheme.SidebarItem[], base?: string): DefaultTheme.SidebarItem[] {
  return items.map((item) => {
    const merge = { ...item }
    const itemBase = merge.base || base
    if (itemBase && merge.link) merge.link = itemBase + merge.link
    if (merge.items) merge.items = addBase(merge.items, itemBase)
    return merge
  })
}

function collectLinks(items: DefaultTheme.SidebarItem[]): string[] {
  return items.flatMap((item) => item.link
    ? [item.link, ...collectLinks(item.items || [])]
    : collectLinks(item.items || []))
}

function resolveEnSidebar(path: string): string[] {
  return collectLinks(getSidebar(enSidebar, path))
}

describe('English VitePress sidebar keys', () => {
  it('matches every English section page to a non-empty sidebar', () => {
    for (const path of [
      '/en/component/bubble',
      '/en/x-card/introduce',
      '/en/x-skill/skills',
      '/en/design/introduce',
      '/en/development/introduce',
      '/en/x-markdown/introduce',
      '/en/x-sdk/introduce',
      '/en/playground/ultramodern',
    ]) {
      const links = resolveEnSidebar(path)
      expect(links, `${path} should match a sidebar`).not.toHaveLength(0)
      // Longest-prefix matching must not bleed across sections.
      expect(links.some((link) => stripLocalePrefix(link) === stripLocalePrefix(path)), `${path} should list itself`).toBe(true)
    }
  })

  it('resolves every sidebar link to a prefixed English path without /en/en/', () => {
    for (const items of Object.values(enSidebar)) {
      const source = Array.isArray(items) ? items : items.items
      const resolved = collectLinks(addBase(source, Array.isArray(items) ? undefined : items.base))
      expect(resolved, JSON.stringify(items)).not.toHaveLength(0)
      for (const link of resolved) {
        expect(link.startsWith('/en/'), link).toBe(true)
        expect(link.includes('/en/en/'), link).toBe(false)
        // Re-running the DocsHeader prefixing stays idempotent.
        expect(withLocalePrefix(stripLocalePrefix(link), 'en')).toBe(link)
      }
    }
  })

  it('keeps the shared English nav logical so DocsHeader can re-prefix it', () => {
    expect(enNav).not.toHaveLength(0)
    for (const item of enNav) {
      if (!('link' in item) || !item.link) continue
      expect(item.link.startsWith('/en'), item.text).toBe(false)
      expect(withLocalePrefix(item.link, 'en'), item.text).toBe(`/en${item.link}`)
      if (item.activeMatch) {
        expect(withLocalePrefix(item.activeMatch, 'en'), item.text).toBe(`/en${item.activeMatch}`)
      }
    }
  })

  it('keeps the Chinese sidebar unprefixed on Chinese paths', () => {
    const zhLinks = collectLinks(getSidebar(zhSidebar, '/component/bubble'))
    expect(zhLinks).not.toHaveLength(0)
    for (const link of zhLinks) {
      expect(link.startsWith('/en'), link).toBe(false)
    }
    // nav.ts stays wired for the root locale.
    for (const item of zhNav) {
      if ('link' in item && item.link) {
        expect(item.link.startsWith('/en'), item.text).toBe(false)
      }
    }
  })

  it('shows no docs sidebar on either homepage', () => {
    expect(resolveEnSidebar('/')).toHaveLength(0)
    expect(resolveEnSidebar('/en/')).toHaveLength(0)
    expect(collectLinks(getSidebar(zhSidebar, '/'))).toHaveLength(0)
  })
})
