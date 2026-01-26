import path from 'path'
import fs from 'fs'
import { docRoot } from '@ant-design-x-vue/build-utils'
import type { MarkdownRenderer } from 'vitepress'

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
        const title = tokens[idx - 2]?.children?.[0].content
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
