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
    style A fill:#2ecc71,stroke:#27ae60
    style F fill:#e74c3c,stroke:#c0392b
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

#### 3. Quadrant Chart

\`\`\`mermaid
quadrantChart
    title Reach and engagement of campaigns
    x-axis Low Reach --> High Reach
    y-axis Low Engagement --> High Engagement
    quadrant-1 We should expand
    quadrant-2 Need to promote
    quadrant-3 Re-evaluate
    quadrant-4 May be improved
    Campaign A: [0.3, 0.6]
    Campaign B: [0.45, 0.23]
    Campaign C: [0.57, 0.69]
    Campaign D: [0.78, 0.34]
    Campaign E: [0.40, 0.34]
    Campaign F: [0.35, 0.78]
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
