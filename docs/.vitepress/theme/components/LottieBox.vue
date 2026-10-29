<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = withDefaults(defineProps<{
  path: string
  autoplay?: boolean
}>(), {
  autoplay: true,
})

const emit = defineEmits<{
  load: [animation: {
    play: () => void
    loop: boolean
    setSpeed: (speed: number) => void
    setDirection: (direction: number) => void
    playSegments: (segments: [number, number], force: boolean) => void
    addEventListener: (name: string, cb: () => void) => void
  }]
}>()

const el = ref<HTMLDivElement | null>(null)
let animation: { destroy: () => void } | null = null

onMounted(async () => {
  const lottie = (await import('lottie-web')).default
  if (!el.value) return
  const item = lottie.loadAnimation({
    container: el.value,
    renderer: 'svg',
    loop: false,
    autoplay: props.autoplay,
    path: props.path,
  })
  animation = item
  item.addEventListener('DOMLoaded', () => emit('load', item))
})

onBeforeUnmount(() => {
  animation?.destroy()
})

defineExpose({
  get animation() {
    return animation
  },
})
</script>

<template>
  <div ref="el" class="lottie-box" />
</template>

<style scoped>
.lottie-box {
  width: 100%;
  height: 100%;
}
</style>
