import { isExternal } from 'vitepress/dist/client/shared.js'

const endingSlashRE = /\/$/
export function createGitHubUrl(
  docsRepo: string,
  docsDir: string,
  docsBranch: string,
  path: string,
  folder = 'examples/',
  ext = '.vue'
) {
  const base = isExternal(docsRepo)
    ? docsRepo
    : `https://github.com/${docsRepo}`
  return `${base.replace(endingSlashRE, '')}/edit/${docsBranch}/${
    docsDir ? `${docsDir.replace(endingSlashRE, '')}/` : ''
  }${folder || ''}${path}${ext || ''}`
}