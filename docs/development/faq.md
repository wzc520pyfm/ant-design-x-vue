# FAQ

## 页头的 2.0.0 和 1.x 会打开同一个站点吗？

不会。2.0.0 是当前这个文档。选 1.x 会离开本站，打开 `https://antd-design-x-vue.netlify.app`。路径能对上就打开同一页，对不上就落到该栏目的入口。

## 为什么有的侧栏写着暂不支持？

X Card、X Skill、Folder，以及独立的 CodeHighlighter，React 有，Vue 2.0 没有。侧栏保留同名条目，避免两套文档的栏目对不上，页面里写了替代物或 React 链接。

## `useXAgent` 还在吗？

还从主包导出，只给旧示例用。新的模型接入用 [Chat Provider](/x-sdk/chat-provider)。

## 演示代码为什么有 tsx 和 setup 两套？

侧栏上方的风格偏好会切换 `:::demo` 展示的源码。这是 Vue 文档自己的开关，React 站没有。
