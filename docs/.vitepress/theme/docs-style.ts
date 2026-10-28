import { defineComponent, getCurrentInstance, inject } from 'vue'
import type { SSGContext } from 'vitepress'
import type CacheEntity from '../../../packages/components/_util/cssinjs/Cache'
import { extractStyle } from '../../../packages/components/_util/cssinjs/hooks/useStyleRegister'

const CACHE_KEY = '__antdxCssCache'

type DocsSSGContext = SSGContext & {
  [CACHE_KEY]?: CacheEntity
}

/**
 * Docs SSR runs in Node, where cssinjs writes nothing into the saved HTML.
 * The shared style cache is ready once the page has rendered; `postRender`
 * copies it into `teleports.body`, which VitePress emits before `#app`.
 */
export function prependDocsStyles(ctx: SSGContext) {
  const cache = (ctx as DocsSSGContext)[CACHE_KEY]
  if (!cache) return ctx
  const css = extractStyle(cache, true).replace(/<\/style/gi, '<\\/style')
  if (!css) return ctx
  const tag = `<style data-docs-cssinjs>${css}</style>`
  ctx.teleports = ctx.teleports || {}
  ctx.teleports.body = `${tag}${ctx.teleports.body || ''}`
  return ctx
}

export const DocsStyleCollector = defineComponent({
  name: 'DocsStyleCollector',
  setup() {
    const ctx = inject<DocsSSGContext | null>(Symbol.for('v-scx'), null)
    const globals = getCurrentInstance()?.appContext.config.globalProperties as
      | { __ANTDV_CSSINJS_CACHE__?: CacheEntity }
      | undefined
    const cache = globals?.__ANTDV_CSSINJS_CACHE__
    if (ctx && cache) ctx[CACHE_KEY] = cache
    return () => null
  },
})
