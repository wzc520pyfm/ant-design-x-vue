import path from 'path'
import fs from 'fs'
import { docRoot } from '../../../internal/build-utils/src'
import type MarkdownIt from 'markdown-it'
import type Token from 'markdown-it/lib/token'
import type Renderer from 'markdown-it/lib/renderer'

interface ContainerOpts {
  marker?: string | undefined
  validate?(params: string): boolean
  render?(
    tokens: Token[],
    index: number,
    options: any,
    env: any,
    self: Renderer
  ): string
}

function createDemoContainer(md: MarkdownIt): ContainerOpts {
  return {
    validate(params) {
      return !!params.trim().match(/^demo\s*(.*)$/)
    },

    render(tokens, idx) {
      const m = tokens[idx].info.trim().match(/^demo\s*(.*)$/)
      if (tokens[idx].nesting === 1 /* means the tag is opening */) {
        const title = tokens[idx - 2]?.children?.[0].content
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
          md.render(`\`\`\` ts\n${sourceSetup}\`\`\``)
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

export default createDemoContainer
