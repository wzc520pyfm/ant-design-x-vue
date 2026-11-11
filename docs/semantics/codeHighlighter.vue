<script setup lang="tsx">
import SemanticPreview from '../.vitepress/vitepress/components/semantic/preview.vue'
import { CodeHighlighter } from 'ant-design-x-vue'

const content = `import { XMarkdown } from '@ant-design-x-vue/x-markdown';

const App = () => <XMarkdown content='Hello World' />;
export default App;
`;

defineRender(() => {
  return (
    <SemanticPreview semantics={[
        { name: 'root', desc: '根节点' },
        { name: 'header', desc: '头部的容器' },
        { name: 'headerTitle', desc: '标题' },
        { name: 'code', desc: '代码容器' },
      ]}
    >
     {({ classNames }) => {
       return (
        <CodeHighlighter
          classNames={classNames}
          lang="typescript"
        >
          {content}
        </CodeHighlighter>
       )
      }
     }
  </SemanticPreview>
  )
})

</script>
