import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import Sender from '../Sender.vue';
import type { SlotConfigType } from '../interface';

const wait = (ms = 20) => new Promise((resolve) => setTimeout(resolve, ms));

describe('Sender slotConfig runtime inserts', () => {
  it('keeps ref.insert entries after the parent slotConfig reference changes', async () => {
    const wrapper = mount(Sender, {
      props: {
        slotConfig: [] as SlotConfigType[],
      },
      attachTo: document.body,
    });
    await nextTick();
    await nextTick();

    const exposed = wrapper.vm as any;
    exposed.insert?.([
      {
        type: 'tag',
        key: 'runtime-1',
        props: { value: 'runtime-1', label: '#runtime-1' },
      },
    ]);
    await wait();
    await nextTick();

    // Fresh empty array — the React #1900 reproduction.
    await wrapper.setProps({ slotConfig: [] });
    await nextTick();

    const value = exposed.getValue?.();
    const keys = (value?.slotConfig ?? value?.config ?? []).map((item: SlotConfigType) => item.key);
    expect(keys).toContain('runtime-1');

    wrapper.unmount();
  });
});
