<script setup lang="ts">
import { Select } from 'ant-design-vue'
import { onMounted, ref } from 'vue'
import {
  V1_VERSION_LABEL,
  V2_VERSION_LABEL,
  currentDocsVersion,
  resolveVersionHref,
  type DocVersionId,
} from '../../config/version-switch'

defineOptions({ name: 'VpVersionSwitch' })

const options = [
  { label: V2_VERSION_LABEL, value: 'v2' },
  { label: V1_VERSION_LABEL, value: 'v1' },
]

// SSR and the first client render agree. The 1.x origin is detected after mount.
const current = ref<DocVersionId>('v2')

onMounted(() => {
  current.value = currentDocsVersion(window.location.origin)
})

const onChange = (value: unknown) => {
  if (value !== 'v1' && value !== 'v2') return
  if (value === current.value) return
  window.location.assign(resolveVersionHref(window.location.pathname, value))
}
</script>

<template>
  <div class="version-switch">
    <Select
      :value="current"
      :options="options"
      aria-label="文档版本"
      @change="onChange"
    />
  </div>
</template>
