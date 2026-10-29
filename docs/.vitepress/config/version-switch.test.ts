import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import {
  LEGACY_REDIRECTS,
  V1_DOCS_ORIGIN,
  V2_DOCS_ORIGIN,
  V2_VERSION_LABEL,
  currentDocsVersion,
  legacyRewriteMap,
  resolveVersionHref,
} from './version-switch'

const docsRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')

describe('cross-site version switch', () => {
  it('keeps the 2.x label aligned with the published package', () => {
    const pkg = JSON.parse(
      fs.readFileSync(
        path.resolve(docsRoot, '../packages/ant-design-x-vue/package.json'),
        'utf8',
      ),
    ) as { version: string }
    expect(V2_VERSION_LABEL).toBe(pkg.version)
    expect(V1_DOCS_ORIGIN).toBe('https://antd-design-x-vue.netlify.app')
    expect(V2_DOCS_ORIGIN).toBe('https://x-vue.ant.design')
  })

  it('treats only the 1.x origin as 1.x', () => {
    expect(currentDocsVersion('https://antd-design-x-vue.netlify.app')).toBe('v1')
    expect(currentDocsVersion('https://antd-design-x-vue.netlify.app/')).toBe('v1')
    expect(currentDocsVersion('http://127.0.0.1:4173')).toBe('v2')
    expect(currentDocsVersion('https://x-vue.ant.design')).toBe('v2')
  })

  it('opens the same component on the 1.x site', () => {
    expect(resolveVersionHref('/component/bubble', 'v1')).toBe(
      'https://antd-design-x-vue.netlify.app/component/bubble',
    )
    expect(resolveVersionHref('/component/bubble.html', 'v1')).toBe(
      'https://antd-design-x-vue.netlify.app/component/bubble',
    )
    expect(resolveVersionHref('/component/sender', 'v1')).toBe(
      'https://antd-design-x-vue.netlify.app/component/sender',
    )
    expect(resolveVersionHref('/', 'v1')).toBe('https://antd-design-x-vue.netlify.app/')
    expect(resolveVersionHref('/playground/independent', 'v1')).toBe(
      'https://antd-design-x-vue.netlify.app/playground/independent',
    )
  })

  it('follows renamed SDK pages onto the 1.x site', () => {
    expect(resolveVersionHref('/component/x-sdk-use-x-chat', 'v1')).toBe(
      'https://antd-design-x-vue.netlify.app/component/use-x-chat',
    )
    expect(resolveVersionHref('/component/x-sdk-x-request', 'v1')).toBe(
      'https://antd-design-x-vue.netlify.app/component/x-request',
    )
    expect(resolveVersionHref('/component/x-sdk-x-stream', 'v1')).toBe(
      'https://antd-design-x-vue.netlify.app/component/x-stream',
    )
    expect(resolveVersionHref('/component/x-sdk-chat-provider', 'v1')).toBe(
      'https://antd-design-x-vue.netlify.app/component/use-x-agent',
    )
  })

  it('falls back to the other site section index', () => {
    expect(resolveVersionHref('/component/notification', 'v1')).toBe(
      'https://antd-design-x-vue.netlify.app/component/overview',
    )
    expect(resolveVersionHref('/component/file-card', 'v1')).toBe(
      'https://antd-design-x-vue.netlify.app/component/overview',
    )
    expect(resolveVersionHref('/playground/agent-tbox', 'v1')).toBe(
      'https://antd-design-x-vue.netlify.app/playground/independent',
    )
    expect(resolveVersionHref('/development/migration-v2', 'v1')).toBe(
      'https://antd-design-x-vue.netlify.app/development/introduce',
    )
  })

  it('sends 1.x pages back to the 2.x origin', () => {
    expect(resolveVersionHref('/component/bubble', 'v2')).toBe(
      'https://x-vue.ant.design/component/bubble',
    )
    expect(resolveVersionHref('/component/use-x-chat', 'v2')).toBe(
      'https://x-vue.ant.design/x-sdk/use-x-chat',
    )
    expect(resolveVersionHref('/x-sdk/use-x-chat', 'v1')).toBe(
      'https://antd-design-x-vue.netlify.app/component/use-x-chat',
    )
    expect(resolveVersionHref('/x-markdown/introduce', 'v1')).toBe(
      'https://antd-design-x-vue.netlify.app/',
    )
    expect(resolveVersionHref('/design/role-design', 'v1')).toBe(
      'https://antd-design-x-vue.netlify.app/',
    )
    expect(resolveVersionHref('/component/attachments', 'v2')).toBe(
      'https://x-vue.ant.design/component/attachments',
    )
    expect(resolveVersionHref('/component/actions', 'v2')).toBe(
      'https://x-vue.ant.design/component/actions',
    )
  })

  it('writes a same-site redirect stub for every legacy 2.x slug', () => {
    const rewrites = legacyRewriteMap()
    expect(Object.keys(rewrites)).toHaveLength(Object.keys(LEGACY_REDIRECTS).length)
    for (const [from, target] of Object.entries(LEGACY_REDIRECTS)) {
      expect(target.startsWith('/v1/')).toBe(false)
      const source = rewrites[`redirects/${from.split('/').pop()}.md`]
      expect(source).toBe(`${from.slice(1)}.md`)
      const file = path.join(docsRoot, 'redirects', `${from.split('/').pop()}.md`)
      const markdown = fs.readFileSync(file, 'utf8')
      expect(markdown).toContain(`](${target})`)
      expect(markdown).toContain(JSON.stringify(target))
    }
  })
})
