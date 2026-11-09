# Folder

A file tree for hierarchical file structures. Aligned with React `@ant-design/x` Folder (2.4+, including the 2.8 context menu).

> 中文：[Folder 文件夹](/component/folder)

## When to use

- Show file / folder hierarchies
- Need selection, expand/collapse, preview, and a context menu
- Need to drag-resize the tree and preview panes

## Examples

### Basic

::::demo-v2 File tree with inline content preview. Drag the divider between the tree and preview to resize.

folder/basic

::::

### Custom file service

::::demo-v2 Load file content dynamically with `fileContentService`.

folder/custom-service

::::

### Controlled file selection

::::demo-v2 Control selection with `selectedFile` / `onSelectedFileChange`.

folder/file-controlled

::::

### Custom icons

::::demo-v2 Customize directory and extension icons with `directoryIcons`. Set `false` to hide icons.

folder/custom-icons

::::

### Context menu

::::demo-v2 Global `contextMenu` with per-node overrides (including `false` to disable). Use ref methods `updateNode` / `deleteNode` / `addNode` for immutable updates.

folder/context-menu

::::

### Custom preview

::::demo-v2 Customize the preview pane with `previewRender`.

folder/preview-render

::::

## API

### FolderProps

| Prop | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| treeData | Tree data | [FolderTreeData](#foldertreedata)[] | `[]` | - |
| selectable | Enable selection | boolean | `true` | - |
| selectedFile | Selected file path (controlled) | string[] | - | - |
| defaultSelectedFile | Default selected file path | string[] | `[]` | - |
| onSelectedFileChange | Selection change | (file: { path: string[]; title?: FolderTreeData\['title'\]; content?: string }) => void | - | - |
| directoryTreeWith | Initial directory tree width (drag the divider to resize) | number \| string | `278` | - |
| emptyRender | Empty state; `false` hides it | false \| VNode \| string \| (() => VNode \| string \| null) | - | - |
| previewRender | Custom preview | VNode \| string \| ((file, info) => VNode \| string \| null) | - | - |
| expandedPaths | Expanded paths (controlled) | string[] | - | - |
| defaultExpandedPaths | Default expanded paths | string[] | - | - |
| defaultExpandAll | Expand all by default | boolean | `true` | - |
| onExpandedPathsChange | Expand/collapse change | (paths: string[]) => void | - | - |
| fileContentService | File content loader | [FileContentService](#filecontentservice) | - | - |
| onFileClick | File click | (filePath: string, content?: string) => void | - | - |
| onFolderClick | Folder click | (folderPath: string) => void | - | - |
| directoryTitle | Tree title; `false` hides it | false \| VNode \| string \| (() => VNode \| string \| null) | - | - |
| previewTitle | Preview title | false \| VNode \| string \| (({ title, path, content }) => VNode \| string \| null) | - | - |
| directoryIcons | Custom icons; `false` hides them | false \| Record<'directory' \| string, VNode \| string \| (() => ...)\> | - | - |
| contextMenu | Global context menu, overridable per node | MenuProps\['items'\] \| ((node, key) => MenuProps\['items'\]) | - | - |
| onRightClick | Right-click callback | (info: { event, node }) => void | - | - |
| classNames | Semantic class names | Record\<SemanticType, string\> | - | - |
| styles | Semantic styles | Record\<SemanticType, CSSProperties\> | - | - |

SemanticType: `root` \| `directoryTree` \| `directoryTitle` \| `filePreview` \| `previewTitle` \| `previewRender`

### FolderTreeData

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| title | Display name | string \| VNode | - |
| path | Path segment | string | - |
| content | Optional file content | string | - |
| children | Children | FolderTreeData[] | - |
| contextMenu | Node menu; `false` disables it | MenuProps\['items'\] \| false \| ((key) => ...) | - |

### FileContentService

```ts
interface FileContentService {
  loadFileContent(filePath: string): Promise<string>;
}
```

### Ref methods

```ts
const folderRef = ref<FolderRef>();

folderRef.value?.getNode(['src', 'App.tsx']);
folderRef.value?.updateNode(['src', 'App.tsx'], { title: 'Main.tsx', path: 'Main.tsx' });
folderRef.value?.deleteNode(['src', 'unused.ts']);
folderRef.value?.addNode(['src'], { title: 'new.ts', path: 'new.ts', content: '' });
```

| Method | Description | Type |
| --- | --- | --- |
| getNode | Get a node by path | (path: string[]) => FolderTreeData \| undefined |
| updateNode | Immutable update; returns new treeData | (path, data) => FolderTreeData[] |
| deleteNode | Immutable delete; returns new treeData | (path) => FolderTreeData[] |
| addNode | Immutable add; returns new treeData | (parentPath, node) => FolderTreeData[] |

## Semantic structure

:::semantic

folder

:::
