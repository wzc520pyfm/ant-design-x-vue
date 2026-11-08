import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { h, nextTick } from 'vue';
import FilePreview from '../FilePreview.vue';

describe('Folder FilePreview highlighting', () => {
  it('uses CodeHighlighter for the default preview', async () => {
    const wrapper = mount(FilePreview, {
      props: {
        selectedFile: ['src', 'App.tsx'],
        fileContent: 'const answer: number = 42;',
      },
    });

    await flushPromises();
    await nextTick();

    expect(wrapper.find('.ant-folder-preview-code.ant-codeHighlighter').exists()).toBe(true);
    expect(wrapper.find('.ant-codeHighlighter-header').exists()).toBe(false);
    expect(wrapper.find('code.language-tsx').text()).toContain('const answer');
  });

  it('passes the highlighted node as originNode to previewRender', async () => {
    let receivedOriginNode = false;
    const wrapper = mount(FilePreview, {
      props: {
        selectedFile: ['README.md'],
        fileContent: '# Hello',
        previewRender: (
          _info: unknown,
          { originNode }: { originNode: ReturnType<typeof h> },
        ) => {
          receivedOriginNode = !!originNode;
          return h('div', { class: 'custom-preview' }, 'custom');
        },
      },
    });

    await flushPromises();
    await nextTick();

    expect(wrapper.find('.custom-preview').exists()).toBe(true);
    expect(receivedOriginNode).toBe(true);
  });
});
