import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { KeyCode } from '../../_util/hooks/use-shortcut-keys';
import Conversations from '../index';
import type { ItemType } from '../interface';

const items: ItemType[] = [
  { key: 'demo1', label: 'What is Ant Design X ?', group: 'pinned' },
  { key: 'demo2', label: 'Getting Started' },
  { key: 'demo4', label: 'In Docker, use Ollama and initialize' },
  { key: 'demo5', label: 'Expired', disabled: true },
];

function keydown(
  target: Element | Document,
  init: { keyCode: number; altKey?: boolean },
) {
  const event = new KeyboardEvent('keydown', {
    bubbles: true,
    cancelable: true,
    altKey: !!init.altKey,
  });
  Object.defineProperty(event, 'keyCode', { get: () => init.keyCode });
  target.dispatchEvent(event);
}

describe('Conversations onActiveChange', () => {
  const mounted: { unmount: () => void }[] = [];

  afterEach(() => {
    while (mounted.length) {
      mounted.pop()?.unmount();
    }
  });

  function track<T extends { unmount: () => void }>(wrapper: T) {
    mounted.push(wrapper);
    return wrapper;
  }

  it('passes key and item on click', async () => {
    const onActiveChange = vi.fn();
    const wrapper = track(
      mount(Conversations, {
        props: {
          items,
          onActiveChange,
        },
      }),
    );

    await wrapper.get('[title="What is Ant Design X ?"]').trigger('click');
    expect(onActiveChange).toHaveBeenCalledWith(
      'demo1',
      expect.objectContaining({
        key: 'demo1',
        label: 'What is Ant Design X ?',
      }),
    );

    await wrapper
      .get('[title="In Docker, use Ollama and initialize"]')
      .trigger('click');
    expect(onActiveChange).toHaveBeenCalledWith(
      'demo4',
      expect.objectContaining({
        key: 'demo4',
        label: 'In Docker, use Ollama and initialize',
      }),
    );
  });

  it('does not fire for disabled items', async () => {
    const onActiveChange = vi.fn();
    const wrapper = track(
      mount(Conversations, {
        props: {
          items,
          onActiveChange,
        },
      }),
    );

    await wrapper.get('[title="Expired"]').trigger('click');
    expect(onActiveChange).not.toHaveBeenCalled();
  });

  it('passes key and item for shortcut selection', async () => {
    const onActiveChange = vi.fn();
    const wrapper = track(
      mount(Conversations, {
        props: {
          items,
          defaultActiveKey: 'demo1',
          onActiveChange,
          shortcutKeys: {
            items: ['Alt', 'number'],
          },
        },
      }),
    );

    keydown(document, { keyCode: KeyCode.THREE, altKey: true });
    await wrapper.vm.$nextTick();

    expect(onActiveChange).toHaveBeenCalledWith(
      'demo4',
      expect.objectContaining({
        key: 'demo4',
        label: 'In Docker, use Ollama and initialize',
      }),
    );
  });
});
