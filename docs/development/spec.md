---
search: false
aside: false
outline: false
sidebar: false
title: 文档已移动
---

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vitepress'

const router = useRouter()
onMounted(() => {
  router.go('/design/introduce')
})
</script>

设计文已收到顶栏的 [设计](/design/introduce)。
