<script setup lang="tsx">
defineOptions({ name: 'AXXMarkdownRendererV2' });

import { XMarkdown, type ComponentProps } from '@ant-design-x-vue/x-markdown';
import '@ant-design-x-vue/x-markdown/themes/light.css';

const content = '# Render Code Text\n\n<html><form><button>Test</button><form></html>';

const DataRender = (props: ComponentProps) => {
  return <>{String((props as any)['data-info'] ?? '')}</>;
};

defineRender(() => (
  <XMarkdown
    className="x-markdown-light"
    content={content}
    components={{ data: DataRender }}
    config={{
      renderer: {
        html(token: { text?: string }) {
          return `<data data-info="${token.text ?? ''}"></data>`;
        },
        heading({ tokens, depth }: { tokens: any[]; depth: number }) {
          const text = (this as any).parser.parseInline(tokens);
          return `<h${depth}>🚀 ${text}</h${depth}>`;
        },
      },
    }}
  />
));
</script>
