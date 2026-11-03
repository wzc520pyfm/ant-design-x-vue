import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ThoughtChainItem from '../ThoughtChainItem.vue';

function collectedCss() {
  return Array.from(document.querySelectorAll('style'))
    .map((node) => node.textContent || '')
    .join('\n');
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
});
