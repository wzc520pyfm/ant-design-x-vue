export type DocVersionId = 'v1' | 'v2'

/** Tracks `packages/ant-design-x-vue` so the header matches the published 2.x line. */
export const V2_VERSION_LABEL = '2.0.0'
export const V1_VERSION_LABEL = '1.x'

/**
 * Locale-relative markdown paths. Root locale is 2.x (`/`), `v1` locale is `/v1/`.
 * Same relative path means the pages are counterparts (Bubble, Sender, …).
 */
export const V2_PAGES = [
  'index.md',
  'component/overview.md',
  'component/bubble.md',
  'component/conversations.md',
  'component/notification.md',
  'component/welcome.md',
  'component/prompts.md',
  'component/sender.md',
  'component/suggestion.md',
  'component/file-card.md',
  'component/think.md',
  'component/thought-chain.md',
  'component/sources.md',
  'component/sdk.md',
  'component/x-sdk-introduce.md',
  'component/x-sdk-chat-provider.md',
  'component/x-sdk-use-x-chat.md',
  'component/x-sdk-use-x-conversations.md',
  'component/x-sdk-x-request.md',
  'component/x-sdk-x-stream.md',
  'component/x-markdown.md',
  'component/x-markdown-plugins.md',
  'component/x-markdown-themes.md',
  'component/x-markdown-streaming.md',
  'component/x-provider.md',
  'development/introduce.md',
  'development/compatible-style.md',
  'development/migration-v2.md',
  'development/spec.md',
  'development/release-checklist.md',
  'playground/independent.md',
  'playground/copilot.md',
  'playground/ultramodern.md',
  'playground/agent-tbox.md',
] as const

export const V1_PAGES = [
  'index.md',
  'component/overview.md',
  'component/bubble.md',
  'component/conversations.md',
  'component/welcome.md',
  'component/prompts.md',
  'component/sender.md',
  'component/attachments.md',
  'component/suggestion.md',
  'component/thought-chain.md',
  'component/actions.md',
  'component/use-x-agent.md',
  'component/use-x-chat.md',
  'component/x-stream.md',
  'component/x-request.md',
  'component/x-provider.md',
] as const

/** 2.x path, 1.x path. Used when the filename changed between majors. */
export const PAGE_ALIASES: ReadonlyArray<readonly [string, string]> = [
  ['component/x-sdk-chat-provider.md', 'component/use-x-agent.md'],
  ['component/x-sdk-use-x-chat.md', 'component/use-x-chat.md'],
  ['component/x-sdk-x-request.md', 'component/x-request.md'],
  ['component/x-sdk-x-stream.md', 'component/x-stream.md'],
]

/**
 * Old flat URLs. Suffixed 2.x pages now live at the clean path.
 * 1.x-only pages moved under `/v1/`. Shared names such as `/component/bubble`
 * are the 2.x page; 1.x of that component is `/v1/component/bubble`.
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
  '/component/attachments': '/v1/component/attachments',
  '/component/actions': '/v1/component/actions',
  '/component/use-x-agent': '/v1/component/use-x-agent',
  '/component/use-x-chat': '/v1/component/use-x-chat',
  '/component/x-stream': '/v1/component/x-stream',
  '/component/x-request': '/v1/component/x-request',
}

const V2_PAGE_SET = new Set<string>(V2_PAGES)
const V1_PAGE_SET = new Set<string>(V1_PAGES)

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

export function publicPath(version: DocVersionId, page: string): string {
  const slug = page.replace(/\.md$/, '').replace(/\/index$/, '')
  if (slug === 'index' || slug === '') {
    return version === 'v1' ? '/v1/' : '/'
  }
  return version === 'v1' ? `/v1/${slug}` : `/${slug}`
}

export function splitLocaleRelative(relativePath: string): {
  version: DocVersionId
  page: string
} {
  let normalized = relativePath.replace(/\\/g, '/').replace(/^\/+/, '')
  normalized = normalized.replace(/[?#].*$/, '')
  const isV1 = normalized === 'v1' || normalized.startsWith('v1/')
  let page = isV1 ? normalized.replace(/^v1\/?/, '') : normalized
  if (!page || page.endsWith('/')) page = `${page}index.md`
  else if (page.endsWith('.html')) page = page.replace(/\.html$/, '.md')
  else if (!page.endsWith('.md')) page = `${page}.md`
  return { version: isV1 ? 'v1' : 'v2', page }
}

function pagesFor(version: DocVersionId): Set<string> {
  return version === 'v1' ? V1_PAGE_SET : V2_PAGE_SET
}

function aliasTarget(page: string, from: DocVersionId, to: DocVersionId): string | undefined {
  for (const [v2, v1] of PAGE_ALIASES) {
    if (from === 'v2' && to === 'v1' && page === v2) return v1
    if (from === 'v1' && to === 'v2' && page === v1) return v2
  }
  return undefined
}

/**
 * Pick the other major's URL. Same relative path wins, then a known rename
 * (useXChat → x-sdk useXChat). Component pages without a counterpart open that
 * version's component index; everything else opens the version home.
 */
export function resolveVersionTarget(relativePath: string, target: DocVersionId): string {
  const { version, page } = splitLocaleRelative(relativePath)
  if (version === target) return publicPath(target, page)

  const pages = pagesFor(target)
  const aliased = aliasTarget(page, version, target)
  if (aliased && pages.has(aliased)) return publicPath(target, aliased)
  if (pages.has(page)) return publicPath(target, page)
  if (page.startsWith('component/')) return publicPath(target, 'component/overview.md')
  return publicPath(target, 'index.md')
}
