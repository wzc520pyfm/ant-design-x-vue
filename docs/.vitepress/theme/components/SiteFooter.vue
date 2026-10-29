<template>
  <footer class="site-footer">
    <div class="cols">
      <div>
        <strong>Ant Design X Vue</strong>
        <p>RICH 设计范式的 Vue 实现。组件 API 与 React 2.0 对齐，写法保持 Vue。</p>
      </div>
      <div>
        <strong>文档</strong>
        <a href="/design/introduce">设计</a>
        <a href="/component/overview">组件</a>
        <a href="/x-markdown/introduce">X Markdown</a>
        <a href="/x-sdk/introduce">X SDK</a>
      </div>
      <div>
        <strong>相关</strong>
        <a href="https://x.ant.design/index-cn" target="_blank" rel="noreferrer">Ant Design X</a>
        <a href="https://www.antdv.com/components/overview-cn" target="_blank" rel="noreferrer">Ant Design Vue</a>
        <a href="https://github.com/wzc520pyfm/ant-design-x-vue" target="_blank" rel="noreferrer">GitHub</a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  border-top: 1px solid var(--vp-c-divider);
  padding: 36px 8vw 48px;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg);
}

.cols {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr;
  gap: 24px;
  max-width: 1120px;
}

strong {
  display: block;
  margin-bottom: 8px;
  color: var(--vp-c-text-1);
}

p {
  margin: 0;
  max-width: 360px;
  line-height: 1.7;
}

a {
  display: block;
  margin: 6px 0;
  color: var(--vp-c-text-2);
  text-decoration: none;
}

a:hover {
  color: var(--vp-c-brand-1, #1677ff);
}

@media (max-width: 720px) {
  .cols {
    grid-template-columns: 1fr;
  }
}
</style>
