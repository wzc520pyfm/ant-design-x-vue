import path from 'path'
import fs from 'fs'
import { docRoot } from '../../../internal/build-utils/src'
import type MarkdownIt from 'markdown-it'
import type Token from 'markdown-it/lib/token.mjs'
import type Renderer from 'markdown-it/lib/renderer'
import { getMarkClassName } from '../vitepress/utils'

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

function createSemanticContainer(md: MarkdownIt): ContainerOpts {
  return {
    validate(params) {
      return !!params.trim().match(/^semantic$/)
    },

    render(tokens, idx) {
      if (tokens[idx].nesting === 1 /* means the tag is opening */) {
        const sourceFileToken = tokens[idx + 2]
        const sourceFile = sourceFileToken.children?.[0].content ?? ''

        const semantics: {
          name: string;
          desc: string
        }[] = []
        const semanticToken = tokens[idx + 5]
        const children = (semanticToken.children ?? []).filter(child => !!child.content)

        for(const child of children){
          const content = child.content || ''
          const [name, desc] = content.replace(/\s/g, '').split('|').filter(Boolean)
          if(name && desc) {
            semantics.push({
              name,
              desc
            })
          }
        }

        const classNames: Record<string, string> = {};
        semantics.forEach((semantic) => {
          classNames[semantic.name] = getMarkClassName(semantic.name);
        });
        // 兼容没有script setup的场景
        // 不一定是tokens[0]，需要更合理的判断
        const scriptSetupREG = /(<script\s+setup\s*>)([\s\S]*)(<\/script>)/;
        console.log('tokens[0].type', tokens[0].type)
        if(tokens[0].type === 'html_block') {
          if(scriptSetupREG.test(tokens[0].content)) {
            tokens[0].content = tokens[0].content.replace(scriptSetupREG, `$1$2\nconst semantics = ${JSON.stringify(semantics)};\nconst classNames = ${JSON.stringify(classNames)}\n$3`)
            console.log(tokens[0].content)
            return `<Semantic :semantics="semantics"><template #semantic><ax-${sourceFile.replaceAll('/', '-').replaceAll('_', '')} /></template>`
          }
          return `<Semantic>`
        }
        return `<Semantic>`
      } else {
        return `</Semantic>\n`
      }
    },
  }
}

export default createSemanticContainer
