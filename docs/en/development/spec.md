---
search: false
aside: false
outline: false
sidebar: false
title: Documentation has been moved
---

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vitepress'

const router = useRouter()
onMounted(() => {
  router.go('/en/design/introduce')
})
</script>

Design documents are accessible from the top bar [Design](/en/design/introduce).
