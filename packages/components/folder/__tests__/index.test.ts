import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import Folder from '../index';
import type { FolderRef, FolderTreeData } from '../interface';

const mockTreeData: FolderTreeData[] = [
  {
    title: 'src',
    path: 'src',
    children: [
      {
        title: 'components',
        path: 'components',
        children: [
          {
            title: 'Button.tsx',
            path: 'Button.tsx',
            content: 'export const Button = () => <button>Click</button>;',
          },
        ],
      },
    ],
  },
  {
    title: 'package.json',
    path: 'package.json',
    content: '{ "name": "test-app" }',
  },
];

describe('Folder', () => {
  it('renders basic folder structure', () => {
    const wrapper = mount(Folder, {
      props: {
        treeData: mockTreeData,
        directoryTitle: 'Project Files',
        previewTitle: 'Custom Preview',
        class: 'custom-class',
        defaultExpandAll: false,
        style: { backgroundColor: 'red' },
      },
    });
    const root = wrapper.find('.ant-folder');
    expect(root.exists()).toBe(true);
    expect(root.classes()).toContain('custom-class');
    expect((root.element as HTMLElement).style.backgroundColor).toBe('red');
  });

  it('renders empty tree', () => {
    const wrapper = mount(Folder, { props: { treeData: [] } });
    expect(wrapper.find('.ant-folder').exists()).toBe(true);
  });

  it('applies selectable class', () => {
    const wrapper = mount(Folder, {
      props: { treeData: mockTreeData, selectable: true },
    });
    expect(wrapper.find('.ant-folder-selectable').exists()).toBe(true);
  });

  it('respects directoryTreeWith width', () => {
    const wrapper = mount(Folder, {
      props: { treeData: mockTreeData, directoryTreeWith: 300 },
    });
    const pane = wrapper.find('.ant-folder-splitter-start');
    expect(pane.exists()).toBe(true);
    expect((pane.element as HTMLElement).style.width).toBe('300px');
    expect(wrapper.find('.ant-folder-splitter-bar').exists()).toBe(true);
  });

  it('renders custom emptyRender', () => {
    const wrapper = mount(Folder, {
      props: {
        treeData: mockTreeData,
        emptyRender: () => 'Custom Empty' as any,
      },
    });
    expect(wrapper.text()).toContain('Custom Empty');
  });

  it('hides empty state when emptyRender is false', () => {
    const wrapper = mount(Folder, {
      props: { treeData: mockTreeData, emptyRender: false },
    });
    expect(wrapper.find('.ant-folder-preview-empty-container').exists()).toBe(
      false,
    );
  });

  it('exposes ref helpers', () => {
    const wrapper = mount(Folder, { props: { treeData: mockTreeData } });
    const exposed = wrapper.vm as unknown as FolderRef;
    expect(exposed.nativeElement).toBeTruthy();
    expect(exposed.getNode(['package.json'])?.title).toBe('package.json');
    expect(exposed.getNode(['missing'])).toBeUndefined();

    const updated = exposed.updateNode(['package.json'], {
      title: 'pkg.json',
      path: 'pkg.json',
    });
    expect(updated.find((n) => n.path === 'pkg.json')?.title).toBe('pkg.json');

    const deleted = exposed.deleteNode(['package.json']);
    expect(deleted.find((n) => n.path === 'package.json')).toBeUndefined();

    const added = exposed.addNode(['src'], {
      title: 'new.ts',
      path: 'new.ts',
      content: '',
    });
    const src = added.find((n) => n.path === 'src');
    expect(src?.children?.some((c) => c.path === 'new.ts')).toBe(true);
  });

  it('handles selectedFile and defaultSelectedFile', async () => {
    const wrapper = mount(Folder, {
      props: {
        treeData: mockTreeData,
        selectedFile: ['package.json'],
      },
    });
    await nextTick();
    expect(wrapper.text()).toContain('package.json');
    expect(wrapper.text()).toContain('{ "name": "test-app" }');

    const wrapper2 = mount(Folder, {
      props: {
        treeData: mockTreeData,
        defaultSelectedFile: ['package.json'],
      },
    });
    await nextTick();
    expect(wrapper2.text()).toContain('{ "name": "test-app" }');
  });

  it('ignores invalid selectedFile', async () => {
    const wrapper = mount(Folder, {
      props: {
        treeData: mockTreeData,
        selectedFile: ['a.json'],
      },
    });
    await nextTick();
    expect(wrapper.find('.ant-folder-preview-empty-container').exists()).toBe(
      true,
    );
  });

  it('fires selection callbacks on file click', async () => {
    const onSelectedFileChange = vi.fn();
    const onFileClick = vi.fn();
    const onFolderClick = vi.fn();

    const wrapper = mount(Folder, {
      props: {
        treeData: mockTreeData,
        selectable: true,
        defaultExpandAll: true,
        onSelectedFileChange,
        onFileClick,
        onFolderClick,
      },
    });
    await nextTick();

    const fileTitle = wrapper
      .findAll('.ant-tree-node-content-wrapper')
      .find((n) => n.text().includes('package.json'));
    expect(fileTitle).toBeTruthy();
    await fileTitle!.trigger('click');
    await nextTick();

    expect(onSelectedFileChange).toHaveBeenCalled();
    expect(onFileClick).toHaveBeenCalled();
  });

  it('loads content via fileContentService', async () => {
    const loadFileContent = vi.fn().mockResolvedValue('// Mock content');
    const wrapper = mount(Folder, {
      props: {
        treeData: [
          {
            title: 'a.ts',
            path: 'a.ts',
          },
        ],
        defaultSelectedFile: ['a.ts'],
        fileContentService: { loadFileContent },
      },
    });
    await nextTick();
    await nextTick();
    expect(loadFileContent).toHaveBeenCalledWith('a.ts');
    expect(wrapper.text()).toContain('// Mock content');
  });

  it('supports contextMenu prop without crashing', async () => {
    const onRightClick = vi.fn();
    const wrapper = mount(Folder, {
      props: {
        treeData: mockTreeData,
        contextMenu: [
          { key: 'copy', label: 'Copy' },
          { key: 'delete', label: 'Delete', danger: true },
        ],
        onRightClick,
      },
    });
    expect(wrapper.find('.ant-folder').exists()).toBe(true);
  });

  it('supports function contextMenu and node override', () => {
    const wrapper = mount(Folder, {
      props: {
        treeData: [
          {
            title: 'readme.md',
            path: 'readme.md',
            content: '# hi',
            contextMenu: false,
          },
        ],
        contextMenu: (_node, key) => [{ key: 'x', label: key }],
      },
    });
    expect(wrapper.find('.ant-folder').exists()).toBe(true);
  });

  it('supports custom directoryIcons false', () => {
    const wrapper = mount(Folder, {
      props: {
        treeData: mockTreeData,
        directoryIcons: false,
      },
    });
    expect(wrapper.find('.ant-folder').exists()).toBe(true);
  });

  it('supports previewRender', async () => {
    const wrapper = mount(Folder, {
      props: {
        treeData: mockTreeData,
        defaultSelectedFile: ['package.json'],
        previewRender: (file) => `LANG:${file.language}` as any,
      },
    });
    await nextTick();
    expect(wrapper.text()).toContain('LANG:json');
  });
});
