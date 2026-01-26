import fs from 'fs'
import path from 'path'
import { camelize } from '@vue/shared'
import glob from 'fast-glob'
import { docRoot } from '@ant-design-x-vue/build-utils'
import type { Plugin } from 'vite'

type Append = Record<'headers' | 'footers' | 'scriptSetups', string[]>

let compPaths: string[]

export function MarkdownTransform(): Plugin {
  return {
    name: 'antd-xv-md-transform',

    enforce: 'pre',

    async buildStart() {
      const pattern = `/component`

      compPaths = await glob(pattern, {
        cwd: docRoot,
        absolute: true,
        onlyDirectories: true,
      })
    },

    async transform(code, id) {
      if (!id.endsWith('.md')) return
      if (!id.includes('/component')) return

      const componentId = path.basename(id, '.md')
      const append: Append = {
        headers: [],
        footers: [],
        scriptSetups: getExampleImports(componentId),
      }

      code = transformVpScriptSetup(code, append)

      if (compPaths.some((compPath) => id.startsWith(compPath))) {
        code = transformComponentMarkdown(id, componentId, code, append)
      }

      return combineMarkdown(
        code,
        [combineScriptSetup(append.scriptSetups), ...append.headers],
        append.footers
      )
    },
  }
}

const combineScriptSetup = (codes: string[]) =>
  `\n<script setup>
${codes.join('\n')}
</script>
`

const combineMarkdown = (
  code: string,
  headers: string[],
  footers: string[]
) => {
  const frontmatterEnds = code.indexOf('---\n\n')
  const firstHeader = code.search(/\n#{1,6}\s.+/)
  const sliceIndex =
    firstHeader < 0
      ? frontmatterEnds < 0
        ? 0
        : frontmatterEnds + 4
      : firstHeader

  if (headers.length > 0)
    code =
      code.slice(0, sliceIndex) + headers.join('\n') + code.slice(sliceIndex)
  code += footers.join('\n')

  return `${code}\n`
}

const vpScriptSetupRE = /<vp-script\s(.*\s)?setup(\s.*)?>([\s\S]*)<\/vp-script>/

const transformVpScriptSetup = (code: string, append: Append) => {
  const matches = code.match(vpScriptSetupRE)
  if (matches) code = code.replace(matches[0], '')
  const scriptSetup = matches?.[3] ?? ''
  if (scriptSetup) append.scriptSetups.push(scriptSetup)
  return code
}

const transformComponentMarkdown = (
  id: string,
  componentId: string,
  code: string,
  append: Append
) => {
  return code
}

const getExampleImports = (componentId: string) => {
  const imports: string[] = []

  // 处理 v2 版本的 componentId（如 bubble-v2 -> bubble）
  const baseComponentId = componentId.replace(/-v2$/, '')

  // v1 版本的 demo
  const examplePath = path.resolve(docRoot, 'examples', baseComponentId)
  if (fs.existsSync(examplePath)) {
    const files = fs.readdirSync(examplePath)
    for (const item of files) {
      if (!/\.vue$/.test(item)) continue
      const file = item.replace(/\.vue$/, '')
      const name = camelize(`Ax-${baseComponentId}-${file}`)

      imports.push(
        `import ${name} from '../examples/${baseComponentId}/${file}.vue'`,
        `import ${name}Setup from '../examples-setup/${baseComponentId}/${file}.vue'`
      )
    }
  }

  // v2 版本的 demo
  const exampleV2Path = path.resolve(docRoot, 'examples-v2', baseComponentId)
  if (fs.existsSync(exampleV2Path)) {
    const files = fs.readdirSync(exampleV2Path)
    for (const item of files) {
      if (!/\.vue$/.test(item)) continue
      const file = item.replace(/\.vue$/, '')
      const name = camelize(`Ax-V2-${baseComponentId}-${file}`)

      imports.push(
        `import ${name} from '../examples-v2/${baseComponentId}/${file}.vue'`,
        `import ${name}Setup from '../examples-v2-setup/${baseComponentId}/${file}.vue'`
      )
    }
  }

  return imports
}
