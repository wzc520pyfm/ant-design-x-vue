# FAQ

## 页头的 2.10.0 和 1.x 会打开同一个站点吗？

不会。2.10.0 是当前这个文档。选 1.x 会离开本站，打开 `https://1x-ant-design-x-vue.netlify.app`。路径能对上就打开同一页，对不上就落到该栏目的入口。

## 顶栏栏目从哪一版来？

顶栏和组件分组对齐 `@ant-design/x@2.10.0` 的 Navigation 与 `components/index.ts`：设计、研发、组件、X Markdown、X SDK、X Card、X Skill、演示。本版文档按这一组栏目组织。

## `useXAgent` 还在吗？

还从主包导出，只给旧示例用。新的模型接入用 [Chat Provider](/x-sdk/chat-provider)。

## 演示代码为什么有 tsx 和 setup 两套？

侧栏上方的风格偏好会切换 `:::demo` 展示的源码。这是 Vue 文档自己的开关，React 站没有。
