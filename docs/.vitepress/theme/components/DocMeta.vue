<script setup lang="ts">
import { computed } from 'vue'
import { useDocLocale } from '../use-doc-locale'

const { isEn } = useDocLocale()

const props = defineProps<{
  name: string
  source: string
}>()

const usage = computed(() => `import { ${props.name} } from 'ant-design-x-vue'`)
</script>

<template>
  <div class="doc-meta">
    <div class="row">
      <span class="label">{{ isEn ? 'Usage' : '使用' }}</span>
      <code>{{ usage }}</code>
    </div>
    <div class="row">
      <span class="label">{{ isEn ? 'Source' : '源码' }}</span>
      <a :href="`https://github.com/wzc520pyfm/ant-design-x-vue/tree/next/packages/components/${source}`">packages/components/{{ source }}</a>
    </div>
  </div>
</template>
