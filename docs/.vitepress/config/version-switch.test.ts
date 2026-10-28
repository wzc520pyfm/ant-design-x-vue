import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import {
  LEGACY_REDIRECTS,
  V1_PAGES,
  V1_VERSION_LABEL,
  V2_PAGES,
  V2_VERSION_LABEL,
  legacyRewriteMap,
  resolveVersionTarget,
} from './version-switch'

const docsRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')

describe('version switch', () => {
  it('keeps the 2.x label aligned with the published package', () => {
    const pkg = JSON.parse(
      fs.readFileSync(
        path.resolve(docsRoot, '../packages/ant-design-x-vue/package.json'),
        'utf8',
      ),
    ) as { version: string }
    expect(V2_VERSION_LABEL).toBe(pkg.version)
    expect(V1_VERSION_LABEL).toBe('1.x')
  })

  it('points each catalog entry at a real markdown file', () => {
    for (const page of V2_PAGES) {
      expect(fs.existsSync(path.join(docsRoot, page)), page).toBe(true)
    }
    for (const page of V1_PAGES) {
      expect(fs.existsSync(path.join(docsRoot, 'v1', page)), page).toBe(true)
    }
  })

  it('opens the same page on the other major when it exists', () => {
    expect(resolveVersionTarget('component/bubble.md', 'v1')).toBe('/v1/component/bubble')
    expect(resolveVersionTarget('v1/component/bubble.md', 'v2')).toBe('/component/bubble')
    expect(resolveVersionTarget('index.md', 'v1')).toBe('/v1/')
    expect(resolveVersionTarget('v1/index.md', 'v2')).toBe('/')
    expect(resolveVersionTarget('component/overview.md', 'v1')).toBe('/v1/component/overview')
  })

  it('follows renamed SDK pages', () => {
    expect(resolveVersionTarget('component/x-sdk-use-x-chat.md', 'v1')).toBe(
      '/v1/component/use-x-chat',
    )
    expect(resolveVersionTarget('component/x-sdk-x-request.md', 'v1')).toBe(
      '/v1/component/x-request',
    )
    expect(resolveVersionTarget('component/x-sdk-x-stream.md', 'v1')).toBe('/v1/component/x-stream')
    expect(resolveVersionTarget('component/x-sdk-chat-provider.md', 'v1')).toBe(
      '/v1/component/use-x-agent',
    )
    expect(resolveVersionTarget('v1/component/use-x-chat.md', 'v2')).toBe(
      '/component/x-sdk-use-x-chat',
    )
    expect(resolveVersionTarget('v1/component/x-request.md', 'v2')).toBe(
      '/component/x-sdk-x-request',
    )
    expect(resolveVersionTarget('v1/component/use-x-agent.md', 'v2')).toBe(
      '/component/x-sdk-chat-provider',
    )
  })

  it('falls back to the component index or the version home', () => {
    expect(resolveVersionTarget('component/notification.md', 'v1')).toBe('/v1/component/overview')
    expect(resolveVersionTarget('component/file-card.md', 'v1')).toBe('/v1/component/overview')
    expect(resolveVersionTarget('v1/component/attachments.md', 'v2')).toBe('/component/overview')
    expect(resolveVersionTarget('v1/component/actions.md', 'v2')).toBe('/component/overview')
    expect(resolveVersionTarget('playground/independent.md', 'v1')).toBe('/v1/')
    expect(resolveVersionTarget('development/introduce.md', 'v1')).toBe('/v1/')
    expect(resolveVersionTarget('v1/component/bubble.md', 'v1')).toBe('/v1/component/bubble')
  })

  it('writes a redirect stub for every legacy URL', () => {
    const rewrites = legacyRewriteMap()
    expect(Object.keys(rewrites)).toHaveLength(Object.keys(LEGACY_REDIRECTS).length)
    for (const [from, target] of Object.entries(LEGACY_REDIRECTS)) {
      const source = rewrites[`redirects/${from.split('/').pop()}.md`]
      expect(source).toBe(`${from.slice(1)}.md`)
      const file = path.join(docsRoot, 'redirects', `${from.split('/').pop()}.md`)
      const markdown = fs.readFileSync(file, 'utf8')
      expect(markdown).toContain(`](${target})`)
      expect(markdown).toContain(JSON.stringify(target))
    }
  })
})
