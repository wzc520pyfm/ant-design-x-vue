<script setup lang="tsx">
import { Bubble, Mermaid } from 'ant-design-x-vue';
import XMarkdown from '@ant-design-x-vue/x-markdown';
import { Button, Flex } from 'ant-design-vue';
import { computed, onBeforeUnmount, ref, watchEffect } from 'vue';

const text = `
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

const index = ref(0);
let timer: ReturnType<typeof setTimeout> | null = null;

watchEffect((onCleanup) => {
  if (index.value >= text.length) return;
  timer = setTimeout(() => {
    index.value = Math.min(index.value + 5, text.length);
  }, 20);
  onCleanup(() => {
    if (timer) clearTimeout(timer);
  });
});

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer);
});

const content = computed(() => text.slice(0, index.value));

const Code = (props: { className?: string; class?: string; children?: unknown }) => {
  const cls = props.className || props.class || '';
  const lang = cls.match(/language-(\w+)/)?.[1] || '';
  if (typeof props.children !== 'string') return null;
  if (lang === 'mermaid') {
    return <Mermaid>{props.children}</Mermaid>;
  }
  return <code>{props.children}</code>;
};

defineRender(() => (
  <Flex vertical gap="small" style={{ height: 600, overflow: 'auto' }}>
    <Flex justify="flex-end">
      <Button
        onClick={() => {
          index.value = 0;
        }}
      >
        Re-Render
      </Button>
    </Flex>
    <Bubble
      content={content.value}
      styles={{ content: { width: 700 } }}
      contentRender={(c: string) => (
        <XMarkdown components={{ code: Code }} paragraphTag="div">
          {c}
        </XMarkdown>
      )}
      variant="outlined"
    />
  </Flex>
));
</script>
