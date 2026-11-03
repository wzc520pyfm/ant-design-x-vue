<script setup lang="tsx">
defineOptions({ name: 'AXXMarkdownWalkTokensV2' });

import { XMarkdown, type Token } from '@ant-design-x-vue/x-markdown';
import '@ant-design-x-vue/x-markdown/themes/light.css';

const content = `Please check: [This is a link](https://xxxxx)`;
const message = 'Invalid link';

const walkTokens = (token: Token) => {
  if (token.type === 'link') {
    // Fake validation: replace illegal links with plain text.
    delete (token as any).tokens;
    token.raw = message;
    token.text = message;
    token.type = 'text';
  }
};

defineRender(() => (
  <XMarkdown
    className="x-markdown-light"
    content={content}
    config={{ walkTokens }}
  />
));
</script>
