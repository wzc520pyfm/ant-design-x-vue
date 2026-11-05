import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ThoughtChainItem from '../ThoughtChainItem.vue';

function collectedCss() {
  return Array.from(document.querySelectorAll('style'))
    .map((node) => node.textContent || '')
    .join('\n');
}

function readDemo(relativeFromRepoRoot: string) {
  return readFileSync(resolve(__dirname, '../../../../', relativeFromRepoRoot), 'utf8');
}

describe('ThoughtChain.Item description layout', () => {
  it('keeps a long URL description on one line (no chip compression)', () => {
    const wrapper = mount(ThoughtChainItem, {
      props: {
        title: 'Opening Webpage',
        description: 'https://x.ant.design/docs/playground/copilot',
      },
    });

    const css = collectedCss();
    // The whole chip must refuse to shrink so that a wrapping Flex row
    // moves the chip to the next line instead of pushing the URL under
    // the title inside the chip.
    expect(css).toMatch(/\.ant-thought-chain-item\{[^}]*flex-shrink:0/);
    expect(wrapper.find('.ant-thought-chain-item-description').text()).toBe(
      'https://x.ant.design/docs/playground/copilot',
    );

    wrapper.unmount();
  });

  it('simple demos use string wrap="wrap" and non-shrinking labels (Vue Flex API)', () => {
    // ant-design-vue Flex only enables flex-wrap when wrap === 'wrap'.
    // JSX/template bare `wrap` is boolean true and is a no-op, which lets
    // flex-shrink:0 chips crush the row label instead of wrapping.
    const demos = [
      'docs/examples-v2/thought-chain/simple.vue',
      'docs/examples-v2-setup/thought-chain/simple.vue',
    ].map(readDemo);

    for (const src of demos) {
      expect(src).toMatch(/wrap=["']wrap["']/);
      expect(src).not.toMatch(/<(?:Flex|a-flex)[^>]*\swrap(?:\s|>)/);
      expect(src.includes('flexShrink: 0') || src.includes('flex-shrink: 0')).toBe(true);
      expect(src.includes("whiteSpace: 'nowrap'") || src.includes('white-space: nowrap')).toBe(
        true,
      );
    }
  });
});
