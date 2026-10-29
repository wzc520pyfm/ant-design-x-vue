<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useData, useRoute } from 'vitepress'
import VersionSwitch from './VersionSwitch.vue'

const items = [
  { key: 'design', text: '设计', href: '/design/introduce', base: '/design' },
  { key: 'development', text: '研发', href: '/development/introduce', base: '/development' },
  { key: 'components', text: '组件', href: '/component/overview', base: '/component' },
  { key: 'markdown', text: 'X Markdown', href: '/x-markdown/introduce', base: '/x-markdown' },
  { key: 'sdk', text: 'X SDK', href: '/x-sdk/introduce', base: '/x-sdk' },
  { key: 'playground', text: '演示', href: '/playground/ultramodern', base: '/playground' },
]

const route = useRoute()
const { isDark } = useData()

const scrollY = ref(0)
const direction = ref<'up' | 'down' | ''>('')
const menuOpen = ref(false)
const narrow = ref(false)

const activeKey = computed(() => {
  const path = route.path
  return items.find((item) => path === item.base || path.startsWith(`${item.base}/`))?.key
})

const isMini = computed(() => {
  if (narrow.value || typeof window === 'undefined') return false
  const clientHeight = document.body.clientHeight || 1080
  const innerHeight = window.innerHeight || 1080
  return scrollY.value > Math.min(innerHeight * 0.5, clientHeight * 0.25)
})

const isHidden = computed(() => {
  if (typeof window === 'undefined') return false
  const clientHeight = document.body.clientHeight || 1080
  const innerHeight = window.innerHeight || 1080
  return scrollY.value > Math.min(innerHeight * 1.5, clientHeight * 0.5) && direction.value === 'down'
})

const actionsHidden = computed(() => scrollY.value > 200 && !narrow.value)

function toggleTheme() {
  isDark.value = !isDark.value
}

let lastY = 0
let ticking = false

function onScroll() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(() => {
    const next = window.scrollY
    direction.value = lastY > next ? 'up' : 'down'
    lastY = next
    scrollY.value = next
    ticking = false
  })
}

function onResize() {
  narrow.value = window.innerWidth < 768
  if (!narrow.value) menuOpen.value = false
}

onMounted(() => {
  lastY = window.scrollY
  scrollY.value = lastY
  onResize()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onResize)
})
</script>

<template>
  <header
    class="x-header"
    :class="{
      mini: isMini && !narrow,
      hidden: isHidden && !menuOpen,
      glass: isMini || narrow,
      narrow,
    }"
  >
    <a class="x-logo" href="/" aria-label="Ant Design X Vue">
      <img
        src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original"
        alt=""
        width="32"
        height="32"
      />
      <span>Ant Design X</span>
      <span class="brand-vue">Vue</span>
    </a>

    <button
      v-if="narrow"
      type="button"
      class="x-icon-btn"
      aria-label="打开菜单"
      @click="menuOpen = !menuOpen"
    >
      <span v-if="menuOpen">✕</span>
      <span v-else>☰</span>
    </button>

    <nav v-if="!narrow" class="x-nav" :class="{ mini: isMini }" aria-label="主导航">
      <a
        v-for="item in items"
        :key="item.key"
        :href="item.href"
        :class="{ active: activeKey === item.key }"
      >{{ item.text }}</a>
    </nav>

    <div v-if="!narrow && !actionsHidden" class="x-actions">
      <VersionSwitch />
      <button
        type="button"
        class="x-icon-btn"
        :aria-label="isDark ? '切换到浅色' : '切换到深色'"
        :title="isDark ? '切换到浅色' : '切换到深色'"
        @click="toggleTheme"
      >
        <span v-if="isDark" aria-hidden="true">☀</span>
        <span v-else aria-hidden="true">☾</span>
      </button>
      <a
        class="x-icon-btn"
        href="https://github.com/wzc520pyfm/ant-design-x-vue"
        target="_blank"
        rel="noreferrer"
        aria-label="GitHub"
        title="GitHub"
      >
        <svg viewBox="64 64 896 896" width="1.1em" height="1.1em" fill="currentColor" aria-hidden="true">
          <path d="M511.6 76.3C264.3 76.2 64 276.4 64 523.5 64 718.9 189.3 885 363.8 946c23.5 5.9 19.9-10.8 19.9-22.2v-77.5c-135.7 15.9-141.2-73.9-150.3-88.9C215 726 171.5 718 184.5 703c30.9-15.9 62.4 4 98.9 57.9 26.4 39.1 77.9 32.5 104 26 5.7-23.5 17.9-44.5 34.7-60.8-140.6-25.2-199.2-111-199.2-213 0-49.5 16.3-95 48.3-131.7-20.4-60.5 1.9-112.3 4.9-120 58.1-5.2 118.5 41.6 123.2 45.3 33-8.9 70.7-13.6 112.9-13.6 42.4 0 80.2 4.9 113.5 13.9 11.3-8.6 67.3-48.8 121.3-43.9 2.9 7.7 24.7 58.3 5.5 118 32.4 36.8 48.9 82.7 48.9 132.3 0 102.2-59 188.1-200 212.9a127.5 127.5 0 0138.1 91v112.5c.8 9 0 17.9 15 17.9 177.1-59.7 304.6-227 304.6-424.1 0-247.2-200.4-447.3-447.5-447.3z" />
        </svg>
      </a>
    </div>

    <div v-if="narrow && menuOpen" class="x-drawer">
      <nav>
        <a
          v-for="item in items"
          :key="item.key"
          :href="item.href"
          :class="{ active: activeKey === item.key }"
          @click="menuOpen = false"
        >{{ item.text }}</a>
      </nav>
      <div class="x-actions">
        <VersionSwitch />
        <button type="button" class="x-icon-btn" aria-label="切换主题" @click="toggleTheme">
          {{ isDark ? '浅色' : '深色' }}
        </button>
        <a class="x-icon-btn" href="https://github.com/wzc520pyfm/ant-design-x-vue" target="_blank" rel="noreferrer">GitHub</a>
      </div>
    </div>
  </header>
</template>

<style scoped>
.x-header {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 80px;
  padding-inline-end: 8px;
  color: var(--vp-c-text-1);
  transition: opacity 0.2s ease, transform 0.2s ease, width 0.2s ease, height 0.2s ease, margin 0.2s ease;
}

.x-header.hidden {
  opacity: 0;
  pointer-events: none;
}

.x-header.glass {
  background: linear-gradient(117deg, rgba(255, 255, 255, 0.1) 17%, rgba(255, 255, 255, 0.05) 51%);
  backdrop-filter: blur(40px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.x-header.narrow {
  top: 16px;
  width: calc(100% - 48px);
  height: 48px;
  margin: 0 24px;
  padding: 0 16px;
  border-radius: 24px;
}

.x-header.mini {
  top: 16px;
  left: 50%;
  width: max-content;
  max-width: calc(100vw - 32px);
  height: 48px;
  margin: 0;
  padding: 0 18px 0 8px;
  gap: 24px;
  border-radius: 24px;
  transform: translateX(-50%);
}

.x-logo {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 80px;
  padding-inline-start: 32px;
  color: inherit;
  font-size: 20px;
  font-weight: 400;
  letter-spacing: -0.18px;
  text-decoration: none;
  white-space: nowrap;
}

.mini .x-logo,
.narrow .x-logo {
  height: 48px;
  padding-inline-start: 8px;
  font-size: 16px;
  gap: 4px;
}

.mini .x-logo img,
.narrow .x-logo img {
  width: 24px;
  height: 24px;
}

.x-logo img {
  width: 32px;
  height: 32px;
}

.brand-vue {
  display: inline-flex;
  align-items: center;
  height: 18px;
  padding: 0 6px;
  border: 1px solid currentColor;
  border-radius: 9px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  opacity: 0.75;
}

.x-nav {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 24px;
  height: 48px;
  padding: 0 24px;
  border-radius: 24px;
  background: linear-gradient(117deg, rgba(255, 255, 255, 0.1) 17%, rgba(255, 255, 255, 0.05) 51%);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(40px);
  transform: translate(-50%, -50%);
}

.x-nav.mini {
  position: static;
  height: auto;
  padding: 0;
  background: none;
  box-shadow: none;
  backdrop-filter: none;
  transform: none;
}

.x-nav a,
.x-drawer a {
  color: var(--vp-c-text-2);
  font-size: 16px;
  text-decoration: none;
  white-space: nowrap;
}

.x-nav a:hover,
.x-nav a.active,
.x-drawer a.active {
  color: var(--vp-c-text-1);
  font-weight: 500;
}

.x-actions {
  display: flex;
  align-items: center;
  margin-inline-end: 8px;
}

.x-icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: none;
  border-radius: 20px;
  background: transparent;
  color: inherit;
  font-size: 16px;
  cursor: pointer;
  text-decoration: none;
}

.x-icon-btn:hover {
  background: rgba(127, 127, 127, 0.12);
}

.x-drawer {
  position: fixed;
  inset: 72px 16px 16px;
  z-index: 999;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 24px;
  border-radius: 24px;
  background: var(--vp-c-bg);
  box-shadow: var(--vp-shadow-3);
}

.x-drawer nav {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.x-drawer .x-actions {
  justify-content: center;
}
</style>
