import mdContainer from 'markdown-it-container'
import createDemoContainer, { createDemoV2Container } from '../plugins/demo'
import type MarkdownIt from 'markdown-it'

export const mdPlugin = (md: MarkdownIt) => {
  md.use(mdContainer, 'demo', createDemoContainer(md))
  md.use(mdContainer, 'demo-v2', createDemoV2Container(md))
}
