---
search: false
aside: false
outline: false
sidebar: false
title: 文档已移动
head:
  - - meta
    - name: robots
      content: noindex
---

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vitepress'

const router = useRouter()
onMounted(() => {
  router.go("/x-markdown/themes")
})
</script>

正在打开对应文档：[继续访问](/x-markdown/themes)
