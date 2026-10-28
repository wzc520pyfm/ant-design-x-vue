import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Sender from '../Sender.vue';

describe('Sender ref', () => {
  it('exposes the root element after mount', async () => {
    const wrapper = mount(Sender, {
      props: {
        value: 'hello',
      },
    });
    const exposed = wrapper.vm as unknown as {
      nativeElement?: HTMLElement;
      focus?: () => void;
      getValue?: () => { value?: string };
    };
    expect(exposed.nativeElement).toBeInstanceOf(HTMLElement);
    expect(exposed.nativeElement?.className).toContain('ant-sender');
    expect(typeof exposed.focus).toBe('function');
    expect(exposed.getValue?.().value).toBe('hello');
  });
});
