<script setup lang="ts">
import { useStorage } from '@vueuse/core'
import { onMounted, ref } from 'vue'

defineOptions({ name: 'VpPreferenceSwitch' })

const preferLocal = useStorage('antdx-docs-preference', 'tsx')
const mode = ref<'tsx' | 'setup'>('tsx')

function apply(prefer: 'tsx' | 'setup') {
  mode.value = prefer
  preferLocal.value = prefer
  if (typeof document === 'undefined') return
  const classList = document.documentElement.classList
  classList.remove('prefer-tsx', 'prefer-setup')
  classList.add(`prefer-${prefer}`)
}

onMounted(() => {
  apply(preferLocal.value === 'setup' ? 'setup' : 'tsx')
})
</script>

<template>
  <div class="prefer">
    <span class="prefer-label">风格偏好</span>
    <div class="prefer-seg" role="group" aria-label="风格偏好">
      <button type="button" :class="{ on: mode === 'tsx' }" @click="apply('tsx')">tsx</button>
      <button type="button" :class="{ on: mode === 'setup' }" @click="apply('setup')">setup</button>
    </div>
  </div>
</template>

<style scoped>
.prefer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin: 16px 0 8px;
}

.prefer-label {
  color: var(--vp-c-text-2);
  font-size: 13px;
  white-space: nowrap;
}

.prefer-seg {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 132px;
  padding: 2px;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
}

.prefer-seg button {
  height: 26px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--vp-c-text-2);
  font-size: 12px;
  cursor: pointer;
}

.prefer-seg button.on {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12);
}
</style>
