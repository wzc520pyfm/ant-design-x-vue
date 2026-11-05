import path from 'path'
import fs from 'fs'
import { docRoot } from '@ant-design-x-vue/build-utils'
import type { MarkdownRenderer } from 'vitepress'

type DemoToken = {
  type: string
  children?: Array<{ type: string; content?: string }> | null
}

function escapeAttr(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
}

function inlineText(token: DemoToken | undefined) {
  if (!token || token.type !== 'inline') return ''
  return (token.children ?? [])
    .filter((child) => child.type === 'text' || child.type === 'code_inline')
    .map((child) => child.content || '')
    .join('')
    .replace(/\u200b/g, '')
    .trim()
}

function isHtmlOnlyInline(token: DemoToken) {
  const text = inlineText(token)
  if (!text || /^<\/?[A-Za-z][^>]*>$/.test(text)) return true
  const children = token.children ?? []
  if (!children.length) return true
  return children.every((child) => child.type === 'html_inline' || !(child.content || '').trim())
}

/**
 * Demo fences sit under an h3. `<ClientOnly>` (and the paragraph markdown-it
 * wraps it in) lands between the heading and the container, so `tokens[idx - 2]`
 * is no longer the heading inline and stringifies as the literal "undefined".
 * Walk back to the nearest heading, skipping those wrappers.
 */
function readDemoTitle(tokens: DemoToken[], openIdx: number) {
  for (let i = openIdx - 1; i >= 0; i -= 1) {
    const token = tokens[i]
    if (!token) break
    if (token.type === 'heading_open') {
      return escapeAttr(inlineText(tokens[i + 1]))
    }
    if (token.type === 'inline') {
      if (tokens[i - 1]?.type === 'heading_open') {
        return escapeAttr(inlineText(token))
      }
      if (isHtmlOnlyInline(token)) continue
      break
    }
    if (
      token.type === 'heading_close'
      || token.type === 'html_block'
      || token.type === 'html_inline'
      || token.type === 'paragraph_open'
      || token.type === 'paragraph_close'
    ) {
      continue
    }
    break
  }
  return ''
}

interface ContainerOpts {
  marker?: string | undefined
  validate?(params: string): boolean
  render?: MarkdownRenderer['renderer']['rules']['container']
}

function createDemoContainer(md: MarkdownRenderer): ContainerOpts {
  return {
    validate(params) {
      // 匹配 demo 但不匹配 demo-v2
      return !!params.trim().match(/^demo(?:\s+.*)?$/) && !params.trim().startsWith('demo-v2')
    },

    render(tokens, idx) {
      const m = tokens[idx].info.trim().match(/^demo\s*(.*)$/)
      if (tokens[idx].nesting === 1 /* means the tag is opening */) {
        const title = readDemoTitle(tokens, idx)
        const description = m && m.length > 1 ? m[1] : ''
        const sourceFileToken = tokens[idx + 2]
        let source = ''
        let sourceSetup = ''
        const sourceFile = sourceFileToken.children?.[0].content ?? ''

        if (sourceFileToken.type === 'inline') {
          source = fs.readFileSync(
            path.resolve(docRoot, 'examples', `${sourceFile}.vue`),
            'utf-8'
          )
          sourceSetup = fs.readFileSync(
            path.resolve(docRoot, 'examples-setup', `${sourceFile}.vue`),
            'utf-8'
          )
        }
        if (!source || !sourceSetup) throw new Error(`Incorrect source file: ${sourceFile}`)

        return `<Demo source="${encodeURIComponent(
          md.render(`\`\`\` ts\n${source}\`\`\``)
        )}" source-setup="${encodeURIComponent(
          md.render(`\`\`\` vue\n${sourceSetup}\`\`\``)
        )}" path="${sourceFile}" raw-source="${encodeURIComponent(
          source
        )}" raw-source-setup="${encodeURIComponent(
          sourceSetup
        )}" description="${encodeURIComponent(md.render(description))}" title="${title}">
  <template #source><ax-${sourceFile.replaceAll('/', '-')}/></template><template #source-setup><ax-${sourceFile.replaceAll('/', '-')}-setup/></template>`
      } else {
        return '</Demo>\n'
      }
    },
  }
}

// v2 版本的 demo 容器，从 examples-v2 和 examples-v2-setup 读取
function createDemoV2Container(md: MarkdownRenderer): ContainerOpts {
  return {
    validate(params) {
      return !!params.trim().match(/^demo-v2\s*(.*)$/)
    },

    render(tokens, idx) {
      const m = tokens[idx].info.trim().match(/^demo-v2\s*(.*)$/)
      if (tokens[idx].nesting === 1 /* means the tag is opening */) {
        const title = readDemoTitle(tokens, idx)
        const description = m && m.length > 1 ? m[1] : ''
        const sourceFileToken = tokens[idx + 2]
        let source = ''
        let sourceSetup = ''
        const sourceFile = sourceFileToken.children?.[0].content ?? ''

        if (sourceFileToken.type === 'inline') {
          source = fs.readFileSync(
            path.resolve(docRoot, 'examples-v2', `${sourceFile}.vue`),
            'utf-8'
          )
          sourceSetup = fs.readFileSync(
            path.resolve(docRoot, 'examples-v2-setup', `${sourceFile}.vue`),
            'utf-8'
          )
        }
        if (!source || !sourceSetup) throw new Error(`Incorrect source file: ${sourceFile}`)

        return `<Demo source="${encodeURIComponent(
          md.render(`\`\`\` ts\n${source}\`\`\``)
        )}" source-setup="${encodeURIComponent(
          md.render(`\`\`\` vue\n${sourceSetup}\`\`\``)
        )}" path="${sourceFile}" raw-source="${encodeURIComponent(
          source
        )}" raw-source-setup="${encodeURIComponent(
          sourceSetup
        )}" description="${encodeURIComponent(md.render(description))}" title="${title}">
  <template #source><ax-v2-${sourceFile.replaceAll('/', '-')}/></template><template #source-setup><ax-v2-${sourceFile.replaceAll('/', '-')}-setup/></template>`
      } else {
        return '</Demo>\n'
      }
    },
  }
}

export default createDemoContainer
export { createDemoV2Container }
