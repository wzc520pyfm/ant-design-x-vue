import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Conversations from '../index';

describe('Conversations item spacing', () => {
  it('keeps item margin at 0 so host li+li rules cannot inflate vertical gap', () => {
    const style = document.createElement('style');
    // Simulate VitePress docs rule that previously stacked on flex gap.
    style.textContent = '.vp-doc li + li { margin-top: 8px; }';
    document.head.appendChild(style);

    const host = document.createElement('div');
    host.className = 'vp-doc';
    document.body.appendChild(host);

    const wrapper = mount(Conversations, {
      props: {
        defaultActiveKey: 'write',
        items: [
          { key: 'write', label: 'Help Me Write' },
          { key: 'coding', label: 'AI Coding' },
          { key: 'createImage', label: 'Create Image' },
        ],
      },
      attachTo: host,
    });

    const root = host.querySelector('.ant-conversations') as HTMLElement;
    const items = host.querySelectorAll('.ant-conversations-item');
    expect(items.length).toBe(3);
    expect(getComputedStyle(root).gap).toBe('4px');
    items.forEach((item) => {
      const cs = getComputedStyle(item as HTMLElement);
      expect(cs.marginTop).toBe('0px');
      expect(cs.marginBottom).toBe('0px');
      expect(cs.height).toBe('40px');
    });

    wrapper.unmount();
    host.remove();
    style.remove();
  });
});
