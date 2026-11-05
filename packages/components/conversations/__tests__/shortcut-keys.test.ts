import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h } from 'vue';
import { KeyCode } from '../../_util/hooks/use-shortcut-keys';
import XProvider from '../../x-provider/index.vue';
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
  init: { keyCode: number; altKey?: boolean; metaKey?: boolean },
) {
  const event = new KeyboardEvent('keydown', {
    bubbles: true,
    cancelable: true,
    altKey: !!init.altKey,
    metaKey: !!init.metaKey,
  });
  Object.defineProperty(event, 'keyCode', { get: () => init.keyCode });
  target.dispatchEvent(event);
}

function keyup(target: Element | Document) {
  target.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
}

describe('Conversations shortcut keys', () => {
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

  it('selects an item with Alt + number', async () => {
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

    expect(onActiveChange).toHaveBeenCalledWith('demo4');
    expect(wrapper.find('.ant-conversations-item-active').text()).toContain(
      'Ollama',
    );
  });

  it('selects an item from an explicit shortcut list', async () => {
    const onActiveChange = vi.fn();
    const wrapper = track(
      mount(Conversations, {
        props: {
          items,
          onActiveChange,
          shortcutKeys: {
            items: [
              ['Alt', KeyCode.ONE],
              ['Alt', KeyCode.TWO],
              ['Alt', KeyCode.THREE],
            ],
          },
        },
      }),
    );

    keydown(document, { keyCode: KeyCode.THREE, altKey: true });
    await wrapper.vm.$nextTick();

    expect(onActiveChange).toHaveBeenCalledWith('demo4');
  });

  it('warns when the same shortcut is configured twice', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    track(
      mount(Conversations, {
        props: {
          items,
          shortcutKeys: {
            items: [
              ['Alt', KeyCode.ONE],
              ['Alt', KeyCode.ONE],
            ],
          },
        },
      }),
    );

    expect(error).toHaveBeenCalledWith(
      'Warning: [antd: conversations] Same shortcutKey Alt,49',
    );
    error.mockRestore();
  });

  it('triggers creation and renders the shortcut hint', async () => {
    const onClick = vi.fn();
    const wrapper = track(
      mount(Conversations, {
        props: {
          items,
          shortcutKeys: {
            creation: ['Meta', KeyCode.K],
          },
          creation: { onClick },
        },
      }),
    );

    expect(wrapper.text()).toContain('New chat');
    expect(
      wrapper.find('.ant-conversations-creation-label-shortcut-key').exists(),
    ).toBe(true);

    keydown(document, { keyCode: KeyCode.K, metaKey: true });
    await wrapper.vm.$nextTick();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not trigger a disabled creation shortcut', async () => {
    const onClick = vi.fn();
    const wrapper = track(
      mount(Conversations, {
        props: {
          items,
          shortcutKeys: {
            creation: ['Meta', KeyCode.K],
          },
          creation: { onClick, disabled: true },
        },
      }),
    );

    keydown(document, { keyCode: KeyCode.K, metaKey: true });
    keyup(wrapper.element);
    await wrapper.vm.$nextTick();
    expect(onClick).not.toHaveBeenCalled();
  });

  it('reads shortcut keys from XProvider', async () => {
    const onActiveChange = vi.fn();
    const Host = defineComponent({
      setup() {
        return () =>
          h(
            XProvider,
            {
              conversations: {
                shortcutKeys: {
                  items: ['Alt', 'number'],
                },
              },
            },
            {
              default: () =>
                h(Conversations, {
                  items,
                  defaultActiveKey: 'demo1',
                  onActiveChange,
                }),
            },
          );
      },
    });

    const wrapper = track(mount(Host));
    keydown(document, { keyCode: KeyCode.ONE, altKey: true });
    await wrapper.vm.$nextTick();
    expect(onActiveChange).toHaveBeenCalledWith('demo1');
  });
});
