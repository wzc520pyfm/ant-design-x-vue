<script setup lang="tsx">
import { Mermaid } from 'ant-design-x-vue';

defineRender(() => (
  <Mermaid>
    {`graph TD
    A[开始] --> B{条件判断}
    B -->|是| C[执行操作A]
    B -->|否| D[执行操作B]
    C --> E[结束]
    D --> E`}
  </Mermaid>
));
</script>
