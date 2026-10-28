export type DocVersionId = 'v1' | 'v2'

/**
 * Cross-site version switch, same idea as React `docVersions` in
 * `packages/x/.dumi/theme/themeConfig.ts`: the header select leaves this origin.
 *
 * 1.x is the pre-2.0 Netlify docs. 2.x is this VitePress site. `x-vue.ant.design`
 * is the package homepage; change `V2_DOCS_ORIGIN` when that host is live.
 */
export const V1_DOCS_ORIGIN = 'https://antd-design-x-vue.netlify.app'
export const V2_DOCS_ORIGIN = 'https://x-vue.ant.design'

/** Tracks `packages/ant-design-x-vue` so the header matches the published 2.x line. */
export const V2_VERSION_LABEL = '2.0.0'
export const V1_VERSION_LABEL = '1.x'

/** Pages that exist on the 1.x site. Anything else falls back by section. */
export const V1_SITE_PATHS = [
  '/',
  '/component/overview',
  '/component/bubble',
  '/component/conversations',
  '/component/welcome',
  '/component/prompts',
  '/component/sender',
  '/component/attachments',
  '/component/suggestion',
  '/component/thought-chain',
  '/component/actions',
  '/component/use-x-agent',
  '/component/use-x-chat',
  '/component/x-stream',
  '/component/x-request',
  '/component/x-provider',
  '/development/introduce',
  '/development/compatible-style',
  '/playground/independent',
  '/playground/copilot',
] as const

/** Pages published by this 2.x docs build. */
export const V2_SITE_PATHS = [
  '/',
  '/component/overview',
  '/component/bubble',
  '/component/conversations',
  '/component/notification',
  '/component/welcome',
  '/component/prompts',
  '/component/sender',
  '/component/suggestion',
  '/component/file-card',
  '/component/think',
  '/component/thought-chain',
  '/component/sources',
  '/component/sdk',
  '/component/x-sdk-introduce',
  '/component/x-sdk-chat-provider',
  '/component/x-sdk-use-x-chat',
  '/component/x-sdk-use-x-conversations',
  '/component/x-sdk-x-request',
  '/component/x-sdk-x-stream',
  '/component/x-markdown',
  '/component/x-markdown-plugins',
  '/component/x-markdown-themes',
  '/component/x-markdown-streaming',
  '/component/x-provider',
  '/development/introduce',
  '/development/compatible-style',
  '/development/migration-v2',
  '/development/spec',
  '/development/release-checklist',
  '/playground/independent',
  '/playground/copilot',
  '/playground/ultramodern',
  '/playground/agent-tbox',
] as const

/** 2.x path, 1.x path. Used when the filename changed between majors. */
export const PAGE_ALIASES: ReadonlyArray<readonly [string, string]> = [
  ['/component/x-sdk-chat-provider', '/component/use-x-agent'],
  ['/component/x-sdk-use-x-chat', '/component/use-x-chat'],
  ['/component/x-sdk-x-request', '/component/x-request'],
  ['/component/x-sdk-x-stream', '/component/x-stream'],
]

/**
 * Old 2.x slugs (`bubble-v2`) now live at the clean path on this site.
 * 1.x-only pages are not hosted here; the header select opens `V1_DOCS_ORIGIN`.
 */
export const LEGACY_REDIRECTS: Record<string, string> = {
  '/component/bubble-v2': '/component/bubble',
  '/component/conversations-v2': '/component/conversations',
  '/component/welcome-v2': '/component/welcome',
  '/component/prompts-v2': '/component/prompts',
  '/component/sender-v2': '/component/sender',
  '/component/suggestion-v2': '/component/suggestion',
  '/component/thought-chain-v2': '/component/thought-chain',
  '/component/x-provider-v2': '/component/x-provider',
  '/component/notification-v2': '/component/notification',
  '/component/file-card-v2': '/component/file-card',
  '/component/think-v2': '/component/think',
  '/component/sources-v2': '/component/sources',
  '/component/sdk-v2': '/component/sdk',
  '/component/x-markdown-v2': '/component/x-markdown',
}

const V1_PATH_SET = new Set<string>(V1_SITE_PATHS)
const V2_PATH_SET = new Set<string>(V2_SITE_PATHS)

export function legacyRewriteMap(): Record<string, string> {
  return Object.fromEntries(
    Object.keys(LEGACY_REDIRECTS).map((from) => {
      const dest = `${from.slice(1)}.md`
      const source = `redirects/${dest.split('/').pop()}`
      return [source, dest]
    }),
  )
}

export function redirectPageMarkdown(target: string): string {
  return `---
search: false
aside: false
outline: false
sidebar: false
title: 文档已移动
head:
  - - meta
    - name: robots
      content: noindex
---

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vitepress'

const router = useRouter()
onMounted(() => {
  router.go(${JSON.stringify(target)})
})
</script>

正在打开对应文档：[继续访问](${target})
`
}

export function normalizeOrigin(origin: string): string {
  return origin.trim().replace(/\/$/, '').toLowerCase()
}

export function normalizePath(input: string): string {
  const withoutSuffix = input.split('#')[0].split('?')[0]
  let path = withoutSuffix
  if (/^https?:\/\//i.test(withoutSuffix)) {
    try {
      path = new URL(withoutSuffix).pathname
    } catch {
      path = withoutSuffix
    }
  }
  path = path.replace(/\.html$/, '')
  if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1)
  if (!path.startsWith('/')) path = `/${path}`
  return path || '/'
}

/** Local preview and the 2.x host both read as 2.x. Only the 1.x origin reads as 1.x. */
export function currentDocsVersion(origin: string): DocVersionId {
  return normalizeOrigin(origin) === normalizeOrigin(V1_DOCS_ORIGIN) ? 'v1' : 'v2'
}

export function versionOrigin(version: DocVersionId): string {
  return version === 'v1' ? V1_DOCS_ORIGIN : V2_DOCS_ORIGIN
}

function pathsFor(version: DocVersionId): Set<string> {
  return version === 'v1' ? V1_PATH_SET : V2_PATH_SET
}

function aliasTarget(path: string, target: DocVersionId): string | undefined {
  for (const [v2, v1] of PAGE_ALIASES) {
    if (target === 'v1' && path === v2) return v1
    if (target === 'v2' && path === v1) return v2
  }
  return undefined
}

function fallbackPath(path: string, pages: Set<string>): string {
  if (path.startsWith('/component/') && pages.has('/component/overview')) return '/component/overview'
  if (path.startsWith('/development/') && pages.has('/development/introduce')) return '/development/introduce'
  if (path.startsWith('/playground/') && pages.has('/playground/independent')) return '/playground/independent'
  return '/'
}

/**
 * Path on the other site. Same pathname when that site has the page, then a
 * known SDK rename, then the section index (component overview, introduce, or
 * the independent playground). React does the same kind of section landing
 * when it swaps origins.
 */
export function resolveVersionPath(pathname: string, target: DocVersionId): string {
  const path = normalizePath(pathname)
  const pages = pathsFor(target)
  const aliased = aliasTarget(path, target)
  if (aliased && pages.has(aliased)) return aliased
  if (pages.has(path)) return path
  return fallbackPath(path, pages)
}

export function resolveVersionHref(pathname: string, target: DocVersionId): string {
  const path = resolveVersionPath(pathname, target)
  return `${versionOrigin(target)}${path}`
}
