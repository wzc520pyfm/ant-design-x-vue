import mdContainer from 'markdown-it-container'
import createDemoContainer from '../plugins/demo'
import type MarkdownIt from 'markdown-it'
import createSemanticContainer from '../plugins/semantic'

export const mdPlugin = (md: MarkdownIt) => {
  md.use(mdContainer, 'demo', createDemoContainer(md))
  md.use(mdContainer, 'semantic', createSemanticContainer(md))
}
