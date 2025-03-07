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
        const sourceFileName = sourceFileToken.children?.[0].content ?? '' // base
        const sourceFile = `${sourceFileName.replace(/:$/, '')}`
        let semanticTokenIdx = idx + 4
        const semantics: {
          name: string;
          desc: string
        }[] = []
        while (tokens[semanticTokenIdx].type !== 'container_semantic_close') {
          if (tokens[semanticTokenIdx].type !== 'inline') {
            semanticTokenIdx++
            continue
          }
          const semanticToken = tokens[semanticTokenIdx]
          const content = semanticToken.children?.[0].content ?? ''
          if(content) {
            const [name, desc] = content.replace(/\s/g, '').split(':').filter(Boolean)
            if(name && desc) {
              semantics.push({
                name,
                desc
              })
            }
          }
          semanticTokenIdx++
        }

        if(semantics.length) {
          const classNames: Record<string, string> = {};
          semantics.forEach((semantic) => {
            classNames[semantic.name] = getMarkClassName(semantic.name);
          });

          let semanticArrayStr = '[';
          for(const semantic of semantics) {
              semanticArrayStr += `{ name: '${semantic.name}', desc: '${semantic.desc}'},`
          }
          semanticArrayStr += ']'

          let classNamesObjStr = '{'
          for(const className in classNames) {
            classNamesObjStr += `${className}: '${classNames[className]}',`
          }
          classNamesObjStr += '}'
          return `<Semantic :semantics="${semanticArrayStr}"><template #semantic><ax-semantic-${sourceFile.replaceAll('/', '-')} :classNames="${classNamesObjStr}" /></template>`
        } else {
          return `<Semantic>`
        }
      } else {
        return `</Semantic>\n`
      }
    },
  }
}

export default createSemanticContainer
