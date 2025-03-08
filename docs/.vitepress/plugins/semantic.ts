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

function getSemanticSourceFilePath(token: Token) {
   const sourceFilePath = token.children?.[0].content ?? ''
   return `${sourceFilePath.replace(/:$/, '')}`
}

function createSemanticContainer(md: MarkdownIt): ContainerOpts {
  return {
    validate(params) {
      return !!params.trim().match(/^semantic$/)
    },

    render(tokens, idx) {
      if (tokens[idx].nesting === 1 /* means the tag is opening */) {
        const semanticBlocks: Record<string, {name: string;
          desc: string;
        }[]> = {}
        let currentTokenIdx = idx
        let currentSemanticBlock:{name: string;
          desc: string;
        }[] | undefined
        let flag = false
        while (tokens[currentTokenIdx].type !== 'container_semantic_close') {
          if(tokens[currentTokenIdx].type === 'bullet_list_open') {
            flag = true
            const sourceFileToken = tokens[currentTokenIdx - 2]
            const sourceFilePath = getSemanticSourceFilePath(sourceFileToken)
            currentSemanticBlock = semanticBlocks[sourceFilePath] = []
            currentTokenIdx++
            continue
          }
          if(tokens[currentTokenIdx].type === 'bullet_list_close') {
            flag = false
            currentTokenIdx++
            continue
          }
          if (!flag && tokens[currentTokenIdx].type !== 'inline') {
            currentTokenIdx++
            continue
          }
          const semanticToken = tokens[currentTokenIdx]
          const content = semanticToken.children?.[0].content ?? ''
          if(content) {
            const [name, desc] = content.replace(/\s/g, '').split(':').filter(Boolean)
            if(name && desc) {
              currentSemanticBlock!.push({
                name,
                desc
              })
            }
          }
          currentTokenIdx++
        }
        
        if(Object.keys(semanticBlocks).length) {
          let result = ''
          for(const path in semanticBlocks) {
            const semanticBlock = semanticBlocks[path]
            const classNames: Record<string, string> = {};
            semanticBlock.forEach((semantic) => {
              classNames[semantic.name] = getMarkClassName(semantic.name);
            });

            let semanticArrayStr = '[';
            for(const block of semanticBlock) {
                semanticArrayStr += `{ name: '${block.name}', desc: '${block.desc}'},`
            }
            semanticArrayStr += ']'

            let classNamesObjStr = '{'
            for(const className in classNames) {
              classNamesObjStr += `${className}: '${classNames[className]}',`
            }
            classNamesObjStr += '}'
            result += `<Semantic :semantics="${semanticArrayStr}"><template #semantic><ax-semantic-${path.replaceAll('/', '-')} :classNames="${classNamesObjStr}" /></template></Semantic>`
          }
          console.log(result.replace(/<\/Semantic>$/, ''))
          return result.replace(/<\/Semantic>$/, '')
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
