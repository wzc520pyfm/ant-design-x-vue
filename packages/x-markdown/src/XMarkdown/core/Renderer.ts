import type { Token, Tokens } from '../interface';

/**
 * Render tokens to HTML string
 * TODO: Implement full functionality
 */
export class Renderer {
  render(tokens: Tokens): string {
    return tokens
      .map((token) => this.renderToken(token))
      .join('');
  }

  renderToken(token: Token): string {
    switch (token.type) {
      case 'paragraph':
        return `<p>${token.text}</p>`;
      case 'heading':
        return `<h${token.depth}>${token.text}</h${token.depth}>`;
      case 'code':
        return `<pre><code class="language-${token.lang || ''}">${token.text}</code></pre>`;
      case 'blockquote':
        return `<blockquote>${token.text}</blockquote>`;
      case 'list':
        const tag = token.ordered ? 'ol' : 'ul';
        const items = token.items?.map((item: Token) => `<li>${item.text}</li>`).join('') || '';
        return `<${tag}>${items}</${tag}>`;
      case 'space':
        return '';
      default:
        return token.raw || '';
    }
  }
}

export default Renderer;
