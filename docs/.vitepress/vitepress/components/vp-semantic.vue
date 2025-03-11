<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'

const { component } = defineProps<{
  component: string
}>()

const normalizedComponent = computed(() => component.slice(0, 1).toLowerCase() + component.slice(1))

const SemanticComponent = defineAsyncComponent(() => import(`../../../semantics/${normalizedComponent.value}.vue`))


</script>

<template>
  <SemanticComponent />
</template>