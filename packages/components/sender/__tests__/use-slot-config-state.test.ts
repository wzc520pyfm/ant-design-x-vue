import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { defineComponent, nextTick, ref, type Ref } from 'vue';
import useSlotConfigState from '../hooks/use-slot-config-state';
import type { SlotConfigType } from '../interface';

const propTag = (key: string): SlotConfigType => ({
  type: 'tag',
  key,
  props: { value: key, label: `#${key}` },
});

const propInput = (key: string, defaultValue: string): SlotConfigType => ({
  type: 'input',
  key,
  props: { defaultValue, placeholder: 'input' },
});

function mountHook(initial: SlotConfigType[]) {
  const slotConfig = ref(initial) as Ref<SlotConfigType[]>;
  let current: ReturnType<typeof useSlotConfigState>;

  const Comp = defineComponent({
    setup() {
      current = useSlotConfigState(slotConfig);
      return () => null;
    },
  });

  const wrapper = mount(Comp);

  return {
    get result() {
      return current;
    },
    async rerender(next: SlotConfigType[]) {
      slotConfig.value = next;
      await nextTick();
    },
    unmount: () => wrapper.unmount(),
  };
}

describe('useSlotConfigState', () => {
  it('rebuilds map and slotValues from prop on first mount', () => {
    const hook = mountHook([propTag('a'), propInput('b', 'bv')]);
    const [map, api] = hook.result;
    expect(map.get('a')?.key).toBe('a');
    expect(map.get('b')?.key).toBe('b');
    expect(api.getSlotValues()).toEqual({ a: 'a', b: 'bv' });
    hook.unmount();
  });

  it('keeps runtime-inserted entries when slotConfig prop reference changes (the bug)', async () => {
    const hook = mountHook([]);

    hook.result[1].mergeSlotConfig([propTag('runtime-1')]);

    const [mapAfterInsert] = hook.result;
    expect(mapAfterInsert.get('runtime-1')?.key).toBe('runtime-1');
    expect(hook.result[1].getSlotValues()['runtime-1']).toBe('runtime-1');

    // Parent re-render with a fresh `[]` reference — must NOT wipe the runtime entry
    await hook.rerender([]);

    const [mapAfterRerender, apiAfterRerender] = hook.result;
    expect(mapAfterRerender.get('runtime-1')?.key).toBe('runtime-1');
    expect(apiAfterRerender.getSlotValues()['runtime-1']).toBe('runtime-1');
    hook.unmount();
  });

  it('removes prop-sourced entries that disappear from the new slotConfig', async () => {
    const hook = mountHook([propTag('p1'), propTag('p2')]);

    expect(hook.result[0].get('p1')).toBeDefined();
    expect(hook.result[0].get('p2')).toBeDefined();

    await hook.rerender([propTag('p1')]);

    expect(hook.result[0].get('p1')).toBeDefined();
    expect(hook.result[0].get('p2')).toBeUndefined();
    expect(hook.result[1].getSlotValues()).toEqual({ p1: 'p1' });
    hook.unmount();
  });

  it('clear() resets map, slotValues, and runtime-keys bookkeeping', async () => {
    const hook = mountHook([propTag('p1')]);

    hook.result[1].mergeSlotConfig([propTag('runtime-1')]);
    expect(hook.result[0].size).toBe(2);

    hook.result[1].clear();
    expect(hook.result[0].size).toBe(0);
    expect(hook.result[1].getSlotValues()).toEqual({});

    // After clear, a parent re-render must not resurrect the previously-runtime key
    await hook.rerender([propTag('p1')]);
    expect(hook.result[0].get('runtime-1')).toBeUndefined();
    expect(hook.result[0].get('p1')).toBeDefined();
    hook.unmount();
  });

  it('preserves runtime slotValues edits across prop reference changes', async () => {
    const hook = mountHook([]);

    hook.result[1].mergeSlotConfig([propInput('runtime-input', 'initial')]);
    expect(hook.result[1].getSlotValues()['runtime-input']).toBe('initial');

    hook.result[1].setSlotValues((prev) => ({ ...prev, 'runtime-input': 'user-typed' }));
    expect(hook.result[1].getSlotValues()['runtime-input']).toBe('user-typed');

    await hook.rerender([]);

    expect(hook.result[1].getSlotValues()['runtime-input']).toBe('user-typed');
    hook.unmount();
  });

  it('lets runtime entries survive a prop briefly declaring then removing the same key', async () => {
    const hook = mountHook([]);

    hook.result[1].mergeSlotConfig([propTag('x')]);
    expect(hook.result[0].get('x')).toBeDefined();

    await hook.rerender([propTag('x')]);
    expect(hook.result[0].get('x')).toBeDefined();

    await hook.rerender([]);
    expect(hook.result[0].get('x')).toBeDefined();
    hook.unmount();
  });

  describe('getNodeTextValue – content type with formatResult', () => {
    it('applies formatResult to content slot value', () => {
      const contentConfig: SlotConfigType = {
        type: 'content',
        key: 'c1',
        props: { defaultValue: 'hello' },
        formatResult: (v: any) => `[${v}]`,
      };
      const hook = mountHook([contentConfig]);

      const span = document.createElement('span');
      span.dataset.slotKey = 'c1';
      span.textContent = 'hello';
      Object.defineProperty(span, 'innerText', { get: () => span.textContent, configurable: true });

      const { getNodeTextValue } = hook.result[1];
      expect(getNodeTextValue(span)).toBe('[hello]');
      hook.unmount();
    });

    it('returns raw textContent when content slot has no formatResult', () => {
      const contentConfig: SlotConfigType = {
        type: 'content',
        key: 'c2',
        props: { defaultValue: 'plain' },
      };
      const hook = mountHook([contentConfig]);

      const span = document.createElement('span');
      span.dataset.slotKey = 'c2';
      span.textContent = 'plain';
      Object.defineProperty(span, 'innerText', { get: () => span.textContent, configurable: true });

      const { getNodeTextValue } = hook.result[1];
      expect(getNodeTextValue(span)).toBe('plain');
      hook.unmount();
    });

    it('uses DOM textContent (not state) as the value for content type', () => {
      const contentConfig: SlotConfigType = {
        type: 'content',
        key: 'c3',
        props: { defaultValue: 'initial' },
        formatResult: (v: any) => `<${v}>`,
      };
      const hook = mountHook([contentConfig]);

      const span = document.createElement('span');
      span.dataset.slotKey = 'c3';
      span.textContent = 'user-edited';
      Object.defineProperty(span, 'innerText', { get: () => span.textContent, configurable: true });

      const { getNodeTextValue } = hook.result[1];
      expect(getNodeTextValue(span)).toBe('<user-edited>');
      hook.unmount();
    });
  });
});
