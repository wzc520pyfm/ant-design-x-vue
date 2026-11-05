<script setup lang="ts">
import { CodeHighlighter } from 'ant-design-x-vue';

defineOptions({ name: 'AXCodeHighlighterBasicSetup' });

const code = `import { ref } from 'vue';
import { Button } from 'ant-design-vue';

const count = ref(0);
`;

const css = `.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}`;

const html = `<!DOCTYPE html>
<html>
<head>
  <title>My Page</title>
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>`;
</script>

<template>
  <div>
    <h3 style="margin-bottom: 8px">JavaScript Code</h3>
    <CodeHighlighter lang="javascript" :children="code" />

    <h3 style="margin: 8px 0">CSS Code</h3>
    <CodeHighlighter lang="css" :children="css" />

    <h3 style="margin: 8px 0">HTML Code</h3>
    <CodeHighlighter lang="html" :children="html" />

    <h3 style="margin: 8px 0">Prism Light Mode</h3>
    <p style="margin-bottom: 8px; color: #666">
      使用 <code>prismLightMode</code> 按需加载语言，减小打包体积。
    </p>
    <CodeHighlighter lang="javascript" :children="code" prism-light-mode />
  </div>
</template>
