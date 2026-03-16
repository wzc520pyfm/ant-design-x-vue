<script setup lang="tsx">
import { LinkOutlined } from '@ant-design/icons-vue'
import { Sources } from 'ant-design-x-vue'
import SemanticPreview from '../.vitepress/vitepress/components/semantic/preview.vue'

defineOptions({ name: 'DocSemanticSources' })

const items = [
  {
    key: '1',
    title: 'Ant Design X Vue',
    url: 'https://github.com/ant-design/x',
    icon: <LinkOutlined />,
  },
  {
    key: '2',
    title: 'Ant Design Vue',
    url: 'https://antdv.com',
    icon: <LinkOutlined />,
  },
]

defineRender(() => {
  return (
    <SemanticPreview
      semantics={[
        { name: 'root', desc: '来源组件的根容器' },
        { name: 'title', desc: '标题区域容器' },
        { name: 'content', desc: '来源内容区域容器' },
      ]}
    >
      {({ classNames }) => {
        return (
          <Sources
            title="Sources"
            items={items}
            classNames={classNames}
          />
        )
      }}
    </SemanticPreview>
  )
})
</script>
