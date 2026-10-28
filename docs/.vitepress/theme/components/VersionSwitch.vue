<script setup lang="ts">
import { Select } from 'ant-design-vue'
import { computed } from 'vue'
import { useData, useRouter } from 'vitepress'
import {
  V1_VERSION_LABEL,
  V2_VERSION_LABEL,
  resolveVersionTarget,
  type DocVersionId,
} from '../../config/version-switch'

defineOptions({ name: 'VpVersionSwitch' })

const { page, localeIndex } = useData()
const router = useRouter()

const options = [
  { label: V2_VERSION_LABEL, value: 'v2' },
  { label: V1_VERSION_LABEL, value: 'v1' },
]

const current = computed<DocVersionId>(() => (localeIndex.value === 'v1' ? 'v1' : 'v2'))

const onChange = (value: DocVersionId) => {
  if (value === current.value) return
  router.go(resolveVersionTarget(page.value.relativePath, value))
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
