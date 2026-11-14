import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { h } from 'vue';
import Attachments from '../Attachments.vue';

afterEach(() => vi.restoreAllMocks());
enableAutoUnmount(afterEach);

describe('Attachments disabled', () => {
  it.each(['placeholder', 'custom'] as const)(
    'disables mouse and keyboard selection through the %s uploader',
    async (mode) => {
      const wrapper = mount(Attachments, {
        props: {
          children: mode === 'custom' ? h('button', 'Upload') : undefined,
        },
      });
      const uploader = wrapper.get(
        mode === 'custom'
          ? '.ant-upload[role="button"]'
          : '.ant-attachment-placeholder .ant-upload[role="button"]',
      );
      const input = uploader.get('input[type="file"]')
        .element as HTMLInputElement;
      const click = vi.spyOn(input, 'click').mockImplementation(() => {});

      for (const disabled of [false, true, false]) {
        await wrapper.setProps({ disabled });
        click.mockClear();
        await uploader.trigger('click');
        await uploader.trigger('keydown', { key: 'Enter' });

        expect(click).toHaveBeenCalledTimes(disabled ? 0 : 2);
        expect(uploader.attributes('tabindex')).toBe(
          disabled ? undefined : '0',
        );
      }
    },
  );

  it.each([false, true])(
    'handles dropped files with disabled=%s',
    async (disabled) => {
      const beforeUpload = vi.fn(() => false);
      const onChange = vi.fn();
      const wrapper = mount(Attachments, {
        props: { disabled, beforeUpload, onChange },
      });
      const file = new File(['attachment'], 'example.txt', {
        type: 'text/plain',
      });

      await wrapper
        .get('.ant-attachment-placeholder .ant-upload[role="button"]')
        .trigger('drop', {
          dataTransfer: { files: [file] },
        });
      await flushPromises();

      expect(beforeUpload).toHaveBeenCalledTimes(disabled ? 0 : 1);
      expect(onChange).toHaveBeenCalledTimes(disabled ? 0 : 1);
    },
  );

  it('preserves existing files while disabled and allows removal after enabling', async () => {
    const file = {
      uid: 'existing',
      name: 'existing.txt',
      status: 'done' as const,
    };
    const onChange = vi.fn();
    const wrapper = mount(Attachments, {
      props: { disabled: true, items: [file], onChange },
    });

    expect(wrapper.findAll('.ant-attachment-list-card')).toHaveLength(1);
    expect(wrapper.find('.ant-attachment-list-card-remove').exists()).toBe(
      false,
    );
    expect(wrapper.find('.ant-attachment-list-upload-btn').exists()).toBe(
      false,
    );

    await wrapper.setProps({ disabled: false });
    expect(wrapper.find('.ant-attachment-list-upload-btn').exists()).toBe(true);
    await wrapper.get('.ant-attachment-list-card-remove').trigger('click');
    await flushPromises();

    expect(onChange).toHaveBeenCalledWith({
      file: { ...file, status: 'removed' },
      fileList: [],
    });
  });
});
