import { globals } from '../vitepress'
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import './style.css'
import { computed, h } from 'vue'
import { theme, XProvider } from 'ant-design-x-vue'
import PreferenceSwitch from './components/PreferenceSwitch.vue'
import { useData } from 'vitepress'

const define = <T>(value: T): T => value

export default define<Theme>({
  extends: DefaultTheme,
  Layout() {
    const { isDark } = useData()
    const algorithm = computed(() => isDark.value ? theme.darkAlgorithm : theme.defaultAlgorithm)

    return h(XProvider, { theme: { algorithm: algorithm.value, } }, () => h(DefaultTheme.Layout, null, {
      'sidebar-nav-before': () => h(PreferenceSwitch),
    }));
  },
  enhanceApp: ({ app }) => {
    globals.forEach(([name, Comp]) => {
      app.component(name, Comp)
    })
  },
})
