<script lang="ts" setup>
import { computed, Transition, type RendererElement } from 'vue'

defineOptions({ name: 'AXCollapseTransition' })

const props = defineProps<{
  prefixCls: string
}>()

const name = computed(() => {
  return props.prefixCls + '-collapse-transition'
})

const on = {
  beforeEnter (el: RendererElement) {
    if (!el.dataset)
      el.dataset = {}

    el.dataset.oldPaddingTop = el.style.paddingTop
    el.dataset.oldPaddingBottom = el.style.paddingBottom

    el.style.maxHeight = 0
    el.style.paddingTop = 0
    el.style.paddingBottom = 0
  },

  enter (el: RendererElement) {
    el.dataset.oldOverflow = el.style.overflow

    if (el.scrollHeight !== 0) {
      el.style.maxHeight = `${el.scrollHeight}px`
      el.style.paddingTop = el.dataset.oldPaddingTop
      el.style.paddingBottom = el.dataset.oldPaddingBottom
    }
    else {
      el.style.maxHeight = `${el.dataset.oldMaxHeight || 999}px`
      el.style.paddingTop = el.dataset.oldPaddingTop
      el.style.paddingBottom = el.dataset.oldPaddingBottom
    }

    el.style.overflow = 'hidden'
  },

  afterEnter (el: RendererElement) {
    el.style.maxHeight = ''
    el.style.overflow = el.dataset.oldOverflow
  },

  beforeLeave (el: RendererElement) {
    if (!el.dataset)
      el.dataset = {}
    el.dataset.oldMaxHeight = el.scrollHeight
    el.dataset.oldPaddingTop = el.style.paddingTop
    el.dataset.oldPaddingBottom = el.style.paddingBottom
    el.dataset.oldOverflow = el.style.overflow

    el.style.overflow = 'hidden'
    el.style.maxHeight = `${el.scrollHeight}px`
  },

  leave (el: RendererElement) {
    if (el.scrollHeight !== 0) {
      el.style.maxHeight = 0
      el.style.paddingTop = 0
      el.style.paddingBottom = 0
    }
  },

  afterLeave (el: RendererElement) {
    el.style.maxHeight = ''
    el.style.overflow = el.dataset.oldOverflow
    el.style.paddingTop = el.dataset.oldPaddingTop
    el.style.paddingBottom = el.dataset.oldPaddingBottom
  },
}
</script>

<template>
  <Transition
    :name="name"
    v-on="on"
  >
    <slot />
  </Transition>
</template>

