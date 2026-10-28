import { globals } from '../vitepress'
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import './style.css'
import './custom.css'
import { computed, defineComponent, h, onMounted } from 'vue'
import { theme, XProvider } from 'ant-design-x-vue'
import PreferenceSwitch from './components/PreferenceSwitch.vue'
import VersionSwitch from './components/VersionSwitch.vue'
import { useData } from 'vitepress'
import { DocsStyleCollector } from './docs-style'
import { antdDark, bindAntdAppearance } from './antd-appearance'

const define = <T>(value: T): T => value

const Layout = defineComponent({
  name: 'AntdxDocsLayout',
  setup() {
    const { frontmatter } = useData()
    onMounted(bindAntdAppearance)
    const themeConfig = computed(() => ({
      algorithm: antdDark.value ? theme.darkAlgorithm : theme.defaultAlgorithm,
      inherit: false,
    }))
    // Do not key this provider on the algorithm. Swapping the key remounts the
    // hydrated page and aborts mid-patch (`nextSibling` of null), which leaves
    // the first demos on the SSR dark stylesheet.
    return () => h(XProvider, {
      theme: themeConfig.value,
    }, () => [
      h(DefaultTheme.Layout, { class: frontmatter.value.customClass }, {
        'sidebar-nav-before': () => h(PreferenceSwitch),
        'nav-bar-content-after': () => h(VersionSwitch),
        'nav-screen-content-after': () => h(VersionSwitch),
      }),
      h(DocsStyleCollector),
    ])
  },
})

export default define<Theme>({
  extends: DefaultTheme,
  Layout,
  enhanceApp: ({ app }) => {
    globals.forEach(([name, Comp]) => {
      app.component(name, Comp)
    })
  },
})
