import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Conversations from '../index';

function cssTextContainingConversations() {
  return [...document.querySelectorAll('style')]
    .map((s) => s.textContent || '')
    .filter((t) => t.includes('ant-conversations'))
    .join('\n');
}

describe('Conversations group spacing', () => {
  it('keeps group list margin/padding at 0 so host vp-doc ul rules cannot inflate title→item gap', () => {
    const style = document.createElement('style');
    // Simulate VitePress docs rules that previously stacked under group titles.
    style.textContent = `
      .vp-doc ul, .vp-doc ol { padding-left: 1.25rem; margin: 16px 0; }
      .vp-doc li + li { margin-top: 8px; }
      .vp-doc li > ol, .vp-doc li > ul { margin: 8px 0 0; }
    `;
    document.head.appendChild(style);

    const host = document.createElement('div');
    host.className = 'vp-doc';
    document.body.appendChild(host);

    const wrapper = mount(Conversations, {
      props: {
        defaultActiveKey: 'item1',
        items: [
          { key: 'item1', label: 'Conversation Item 1', group: 'Today' },
          { key: 'item2', label: 'Conversation Item 2', group: 'Today' },
          { key: 'item3', label: 'Conversation Item 3', group: 'Yesterday' },
        ],
        groupable: true,
      },
      attachTo: host,
    });

    const lists = host.querySelectorAll('.ant-conversations-list');
    expect(lists.length).toBe(2);
    lists.forEach((list) => {
      const cs = getComputedStyle(list as HTMLElement);
      expect(cs.marginTop).toBe('0px');
      expect(cs.marginBottom).toBe('0px');
      expect(cs.paddingLeft).toBe('0px');
      expect(cs.paddingRight).toBe('0px');
    });

    wrapper.unmount();
    host.remove();
    style.remove();
  });

  it('keeps collapsible group list paddingBlockStart at paddingXXS (4px) like React', async () => {
    const style = document.createElement('style');
    style.textContent = `
      .vp-doc ul, .vp-doc ol { padding-left: 1.25rem; margin: 16px 0; }
      .vp-doc li + li { margin-top: 8px; }
    `;
    document.head.appendChild(style);

    const host = document.createElement('div');
    host.className = 'vp-doc';
    document.body.appendChild(host);

    const wrapper = mount(Conversations, {
      props: {
        defaultActiveKey: 'item1',
        items: [
          { key: 'item1', label: 'Conversation Item 1', group: 'Today' },
          { key: 'item2', label: 'Conversation Item 2', group: 'Today' },
        ],
        groupable: {
          collapsible: true,
          defaultExpandedKeys: ['Today'],
        },
      },
      attachTo: host,
    });

    await wrapper.vm.$nextTick();

    const list = host.querySelector(
      '.ant-conversations-group-collapsible-list',
    ) as HTMLElement | null;
    expect(list).not.toBeNull();
    const cs = getComputedStyle(list!);
    expect(cs.marginTop).toBe('0px');
    expect(cs.marginBottom).toBe('0px');
    expect(cs.paddingLeft).toBe('0px');

    // React parity: paddingBlockStart = token.paddingXXS = 4px.
    // Assert registered CSS (happy-dom does not always map padding-block-start → paddingTop).
    expect(cssTextContainingConversations()).toMatch(
      /\.ant-conversations-group-collapsible-list\{[^}]*padding-block-start:\s*4px/,
    );

    wrapper.unmount();
    host.remove();
    style.remove();
  });
});
