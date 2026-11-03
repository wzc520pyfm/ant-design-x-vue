<script setup lang="tsx">
defineOptions({ name: 'AXXMarkdownMermaidStreamingV2' });

import { onUnmounted, ref, watchEffect } from 'vue';
import { Bubble } from 'ant-design-x-vue';
import { XMarkdown } from '@ant-design-x-vue/x-markdown';
import Mermaid from '@ant-design-x-vue/x-markdown/plugins/Mermaid';
import { Button, Flex } from 'ant-design-vue';
import { codeRenderer } from '../_shared/markdown-code';

const fullContent = `
Here are several Mermaid diagram examples

#### 1. Flowchart (Vertical)

\`\`\` mermaid
graph TD
    A[Start] --> B{Data Valid?}
    B -->|Yes| C[Process Data]
    B -->|No| D[Error Handling]
    C --> E[Generate Report]
    D --> E
    E --> F[End]
\`\`\`

#### 2. Sequence Diagram

\`\`\` mermaid
sequenceDiagram
    participant Client
    participant Server
    participant Database

    Client->>Server: POST /api/data
    Server->>Database: INSERT record
    Database-->>Server: Success
    Server-->>Client: 201 Created
\`\`\`
`;

const isClient = typeof window !== 'undefined';

const Code = codeRenderer((props, lang, codeText) => {
  if (lang === 'mermaid') return <Mermaid children={codeText} />;
  return <code class={props.className}>{codeText}</code>;
});

const index = ref(0);
const isServer = import.meta.env.SSR;

watchEffect((onCleanup) => {
  if (isServer || index.value >= fullContent.length) return;
  const timerId = setTimeout(() => {
    index.value = Math.min(fullContent.length, index.value + 5);
  }, 20);
  onCleanup(() => clearTimeout(timerId));
});

onUnmounted(() => {
  index.value = fullContent.length;
});

defineRender(() => (
  <Flex vertical gap="small">
    <Button style={{ alignSelf: 'flex-end' }} onClick={() => (index.value = 0)}>
      Re-Render
    </Button>
    {isClient ? (
      <Bubble
        content={fullContent.slice(0, index.value)}
        contentRender={(content) => (
          <XMarkdown
            content={content as string}
            components={{ code: Code }}
            paragraphTag="div"
          />
        )}
        variant="outlined"
      />
    ) : (
      <pre>{fullContent}</pre>
    )}
  </Flex>
));
</script>
