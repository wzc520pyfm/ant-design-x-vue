<script setup lang="ts">
import { useSidebar } from 'vitepress/theme'
import { useDocLocale } from '../use-doc-locale'

const { hasSidebar } = useSidebar()
const { isEn, lp } = useDocLocale()
</script>

<template>
  <footer class="site-footer" :class="{ 'has-sidebar': hasSidebar }">
    <div class="cols">
      <div>
        <strong>Ant Design X Vue</strong>
        <p>{{ isEn
          ? 'The Vue implementation of the RICH design paradigm. Component APIs align with React 2.10 while the usage stays Vue-native.'
          : 'RICH 设计范式的 Vue 实现。组件 API 与 React 2.10 对齐，写法保持 Vue。' }}</p>
      </div>
      <div>
        <strong>{{ isEn ? 'Docs' : '文档' }}</strong>
        <a :href="lp('/design/introduce')">{{ isEn ? 'Design' : '设计' }}</a>
        <a :href="lp('/component/overview')">{{ isEn ? 'Components' : '组件' }}</a>
        <a :href="lp('/x-markdown/introduce')">X Markdown</a>
        <a :href="lp('/x-sdk/introduce')">X SDK</a>
      </div>
      <div>
        <strong>{{ isEn ? 'Related' : '相关' }}</strong>
        <a href="https://x.ant.design/index-cn" target="_blank" rel="noreferrer">Ant Design X</a>
        <a href="https://www.antdv.com/components/overview-cn" target="_blank" rel="noreferrer">Ant Design Vue</a>
        <a href="https://github.com/wzc520pyfm/ant-design-x-vue" target="_blank" rel="noreferrer">GitHub</a>
      </div>
    </div>
    <p class="netlify-credit">
      <a href="https://www.netlify.com/" target="_blank" rel="noreferrer">
        This site is powered by Netlify
      </a>
    </p>
  </footer>
</template>

<style scoped>
.site-footer {
  border-top: 1px solid var(--vp-c-divider);
  padding: 36px 8vw 48px;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg);
}

/*
 * SiteFooter is slotted into layout-bottom (sibling of fixed .VPSidebar), so it
 * does not inherit .VPContent.has-sidebar's padding-left. Without an offset the
 * first footer column sits under the aside (clipped text like 「见。组件 API…」).
 * Mirror VPContent + VPDoc horizontal inset on docs pages; homepage has no sidebar.
 */
@media (min-width: 960px) {
  .site-footer.has-sidebar {
    padding-left: calc(var(--vp-sidebar-width) + 32px);
    padding-right: 32px;
  }
}

@media (min-width: 1440px) {
  .site-footer.has-sidebar {
    padding-left: calc(
      (100vw - var(--vp-layout-max-width)) / 2 + var(--vp-sidebar-width) + 32px
    );
    padding-right: calc((100vw - var(--vp-layout-max-width)) / 2 + 32px);
  }
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

.netlify-credit {
  margin: 28px 0 0;
  max-width: 1120px;
  font-size: 13px;
  line-height: 1.6;
}

.netlify-credit a {
  display: inline;
  margin: 0;
  color: var(--vp-c-text-3);
}

.netlify-credit a:hover {
  color: var(--vp-c-brand-1, #1677ff);
}

@media (max-width: 720px) {
  .cols {
    grid-template-columns: 1fr;
  }
}
</style>
