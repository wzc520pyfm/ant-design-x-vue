import { enableAutoUnmount, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h, markRaw, nextTick } from 'vue';
import Sender from '../Sender.vue';
import type { SenderComponents, SenderProps } from '../interface';

enableAutoUnmount(afterEach);

describe('Sender autofocus', () => {
  it.each([undefined, false, true])('passes autofocus=%s to the textarea only', (autofocus) => {
    const wrapper = mount(Sender, {
      props: { autofocus },
      attachTo: document.body,
    });

    expect(wrapper.get('textarea').element.hasAttribute('autofocus')).toBe(autofocus === true);
    expect(wrapper.element.hasAttribute('autofocus')).toBe(false);
  });

  it('supports the boolean attribute in templates', () => {
    const wrapper = mount(defineComponent({
      components: { Sender },
      template: '<Sender autofocus />',
    }));

    expect(wrapper.get('textarea').element.hasAttribute('autofocus')).toBe(true);
    expect(wrapper.element.hasAttribute('autofocus')).toBe(false);
  });

  it('passes autofocus to a custom input component', () => {
    const CustomInput = markRaw(defineComponent({
      props: { autofocus: Boolean },
      setup: (props) => () => h('textarea', { autofocus: props.autofocus }),
    }));
    const wrapper = mount(Sender, {
      props: {
        autofocus: true,
        components: { input: CustomInput as unknown as SenderComponents['input'] },
      },
      attachTo: document.body,
    });

    expect(wrapper.getComponent(CustomInput).props('autofocus')).toBe(true);
    expect(wrapper.get('textarea').element.hasAttribute('autofocus')).toBe(true);
  });

  const slotModes: { name: string; props: SenderProps }[] = [
    { name: 'empty slots', props: { slotConfig: [] } },
    { name: 'slots', props: { slotConfig: [{ type: 'text', value: 'Hello' }] } },
    { name: 'skill only', props: { skill: { value: 'writing', title: 'Writing' } } },
  ];

  describe.each(slotModes)('$name', ({ props }) => {
    it.each([undefined, false])('does not focus when autofocus=%s', async (autofocus) => {
      const wrapper = mount(Sender, {
        props: { ...props, autofocus },
        attachTo: document.body,
      });
      await nextTick();
      await nextTick();

      expect(document.activeElement).not.toBe(wrapper.get('[role="textbox"]').element);
    });

    it('focuses the editor after initialization and emits focus', async () => {
      const onFocus = vi.fn();
      const wrapper = mount(Sender, {
        props: { ...props, autofocus: true, onFocus },
        attachTo: document.body,
      });
      await nextTick();
      await nextTick();

      const editor = wrapper.get('[role="textbox"]').element;
      expect(document.activeElement).toBe(editor);
      expect(onFocus).toHaveBeenCalledOnce();
      expect(onFocus).toHaveBeenCalledWith(expect.objectContaining({ type: 'focus' }));
      expect(wrapper.element.hasAttribute('autofocus')).toBe(false);
      if (props.slotConfig?.length) {
        expect(editor.textContent).toBe('Hello');
      }
      if (props.skill) {
        expect(wrapper.find('.ant-sender-skill-tag').exists()).toBe(true);
      }
    });

    it('does not autofocus a disabled editor', async () => {
      const onFocus = vi.fn();
      const wrapper = mount(Sender, {
        props: { ...props, autofocus: true, disabled: true, onFocus },
        attachTo: document.body,
      });
      await nextTick();
      await nextTick();

      expect(document.activeElement).not.toBe(wrapper.get('[role="textbox"]').element);
      expect(onFocus).not.toHaveBeenCalled();
    });

    it('does not steal focus back on updates', async () => {
      const wrapper = mount(Sender, {
        props: { ...props, autofocus: true },
        attachTo: document.body,
      });
      await nextTick();
      await nextTick();

      const editor = wrapper.get('[role="textbox"]').element as HTMLElement;
      editor.blur();
      await wrapper.setProps({ placeholder: 'Updated placeholder' });
      await wrapper.setProps({ autofocus: false });
      await wrapper.setProps({ autofocus: true });

      expect(document.activeElement).not.toBe(editor);
    });
  });
});
