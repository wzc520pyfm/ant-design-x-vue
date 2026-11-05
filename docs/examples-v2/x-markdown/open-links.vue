<script setup lang="tsx">
defineOptions({ name: 'AXXMarkdownOpenLinksV2' });

import { XMarkdown } from '@ant-design-x-vue/x-markdown';
import { Flex } from 'ant-design-vue';
import '@ant-design-x-vue/x-markdown/themes/light.css';

const content = `
### Open links in a new tab

- [Ant Design](https://ant.design)
- [GitHub](https://github.com)

### Reference link

This is a [reference-style link][1].

[1]: https://ant.design/components/overview
`;

defineRender(() => (
  <Flex vertical gap={24}>
    <div>
      <h4 style={{ marginTop: 0 }}>openLinksInNewTab enabled</h4>
      <XMarkdown className="x-markdown-light" openLinksInNewTab content={content} />
    </div>
    <div>
      <h4 style={{ marginTop: 0 }}>Default (same tab)</h4>
      <XMarkdown className="x-markdown-light" content={content} />
    </div>
  </Flex>
));
</script>
