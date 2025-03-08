import mdContainer from 'markdown-it-container'
import createDemoContainer from '../plugins/demo'
import type MarkdownIt from 'markdown-it'

export const mdPlugin = (md: MarkdownIt) => {
  md.use(mdContainer, 'demo', createDemoContainer(md))
}
