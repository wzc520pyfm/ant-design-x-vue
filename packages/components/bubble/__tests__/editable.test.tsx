import { EditOutlined } from '@ant-design/icons-vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { ref } from 'vue';
import { Actions, Bubble } from 'ant-design-x-vue';

describe('Bubble editable', () => {
  it('enters edit mode from the footer action and saves or cancels the text', async () => {
    const calls: string[] = [];
    const wrapper = mount({
      setup() {
        const editing = ref(false);
        const content = ref('editable bubble 1');
        return () => (
          <Bubble
            editable={editing.value}
            content={content.value}
            footer={
              <Actions
                items={[{ key: 'edit', icon: <EditOutlined />, label: 'edit' }]}
                onClick={({ key }) => {
                  calls.push(key);
                  editing.value = key === 'edit';
                }}
              />
            }
            onEditCancel={() => {
              editing.value = false;
            }}
            onEditConfirm={(val: string) => {
              content.value = val;
              editing.value = false;
            }}
          />
        );
      },
    });

    expect(wrapper.find('[contenteditable]').exists()).toBe(false);

    await wrapper.find('.ant-actions-item').trigger('click');
    expect(calls).toEqual(['edit']);

    const editor = wrapper.find('[contenteditable]');
    expect(editor.exists()).toBe(true);
    expect(editor.text()).toBe('editable bubble 1');
    editor.element.textContent = 'changed bubble';

    await wrapper.find('.ant-btn-primary').trigger('click');
    expect(wrapper.find('[contenteditable]').exists()).toBe(false);
    expect(wrapper.find('.ant-bubble-content').text()).toContain('changed bubble');

    await wrapper.find('.ant-actions-item').trigger('click');
    wrapper.find('[contenteditable]').element.textContent = 'discarded';
    await wrapper.find('.ant-btn-text').trigger('click');
    expect(wrapper.find('[contenteditable]').exists()).toBe(false);
    expect(wrapper.find('.ant-bubble-content').text()).toContain('changed bubble');
    expect(wrapper.find('.ant-bubble-content').text()).not.toContain('discarded');

    wrapper.unmount();
  });

  it('shows the editor when editable.editing is true', () => {
    const wrapper = mount(Bubble, {
      props: {
        content: 'editable bubble 2',
        editable: { editing: true, okText: 'ok', cancelText: 'cancel' },
      },
    });

    expect(wrapper.find('[contenteditable]').text()).toBe('editable bubble 2');
    expect(wrapper.find('.ant-btn-primary').text()).toBe('ok');
    expect(wrapper.find('.ant-btn-text').text()).toBe('cancel');
    expect(wrapper.find('.ant-bubble-content-editing').exists()).toBe(true);
    wrapper.unmount();
  });
});
