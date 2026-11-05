import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ThoughtChain from '../index';
import ThoughtChainItem from '../ThoughtChainItem.vue';

describe('ThoughtChain refs', () => {
  it('exposes the list root element', () => {
    const wrapper = mount(ThoughtChain, {
      props: {
        items: [{ key: 'a', title: 'Think' }],
      },
    });
    const exposed = wrapper.vm as unknown as { nativeElement?: HTMLElement };
    expect(exposed.nativeElement).toBeInstanceOf(HTMLElement);
    expect(exposed.nativeElement?.className).toContain('ant-thought-chain');
  });

  it('exposes the item root element', () => {
    const wrapper = mount(ThoughtChainItem, {
      props: {
        title: 'Step',
      },
    });
    const exposed = wrapper.vm as unknown as { nativeElement?: HTMLElement };
    expect(exposed.nativeElement).toBeInstanceOf(HTMLElement);
    expect(exposed.nativeElement?.className).toContain(
      'ant-thought-chain-item',
    );
  });
});
