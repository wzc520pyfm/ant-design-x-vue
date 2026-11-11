# Folder 文件夹

文件树组件，用于展示层级文件结构。对齐 React `@ant-design/x` Folder（2.4+，含 2.8 右键菜单）。

## 何时使用

- 展示文件/文件夹层级结构
- 需要文件选择、展开收起、预览与右键菜单
- 需要在目录树与预览区之间拖拽调整宽度

## 代码演示

### 基础用法

::::demo-v2 展示文件树与内联内容预览。目录树与预览区之间可拖拽分隔条调整宽度。

folder/basic

::::

### 自定义文件服务

::::demo-v2 通过 `fileContentService` 动态加载文件内容。

folder/custom-service

::::

### 受控文件选择

::::demo-v2 使用 `selectedFile` / `onSelectedFileChange` 受控选中文件。

folder/file-controlled

::::

### 自定义图标

::::demo-v2 通过 `directoryIcons` 自定义目录与扩展名图标；设为 `false` 可隐藏图标。

folder/custom-icons

::::

### 右键菜单

::::demo-v2 支持全局 `contextMenu` 与节点级覆盖（含 `false` 禁用）。可配合 `ref` 的 `updateNode` / `deleteNode` / `addNode` 做不可变更新。

folder/context-menu

::::

### 自定义预览

::::demo-v2 通过 `previewRender` 自定义预览区内容。

folder/preview-render

::::

## API

### FolderProps

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| treeData | 文件树数据 | [FolderTreeData](#foldertreedata)[] | `[]` | - |
| selectable | 是否开启选择功能 | boolean | `true` | - |
| selectedFile | 选中的文件路径（受控） | string[] | - | - |
| defaultSelectedFile | 默认选中的文件路径 | string[] | `[]` | - |
| onSelectedFileChange | 文件选择变化时的回调 | (file: { path: string[]; title?: FolderTreeData\['title'\]; content?: string }) => void | - | - |
| directoryTreeWith | 目录树初始宽度（可拖拽分隔条调整） | number \| string | `278` | - |
| emptyRender | 空状态展示，设为 `false` 时不展示 | false \| VNode \| string \| (() => VNode \| string \| null) | - | - |
| previewRender | 自定义文件预览内容 | VNode \| string \| ((file, info) => VNode \| string \| null) | - | - |
| expandedPaths | 展开的节点路径（受控） | string[] | - | - |
| defaultExpandedPaths | 默认展开的节点路径 | string[] | - | - |
| defaultExpandAll | 是否默认展开所有节点 | boolean | `true` | - |
| onExpandedPathsChange | 展开/收起变化回调 | (paths: string[]) => void | - | - |
| fileContentService | 文件内容服务 | [FileContentService](#filecontentservice) | - | - |
| onFileClick | 文件点击事件 | (filePath: string, content?: string) => void | - | - |
| onFolderClick | 文件夹点击事件 | (folderPath: string) => void | - | - |
| directoryTitle | 目录树标题，设为 `false` 时不展示 | false \| VNode \| string \| (() => VNode \| string \| null) | - | - |
| previewTitle | 文件预览标题 | false \| VNode \| string \| (({ title, path, content }) => VNode \| string \| null) | - | - |
| directoryIcons | 自定义图标，设为 `false` 时不展示 | false \| Record<'directory' \| string, VNode \| string \| (() => ...)> | - | - |
| contextMenu | 右键菜单（全局），可被节点 `contextMenu` 覆盖 | MenuProps\['items'\] \| ((node, key) => MenuProps\['items'\]) | - | - |
| onRightClick | 右键点击节点回调 | (info: { event, node }) => void | - | - |
| classNames | 语义化 className | Record<SemanticType, string> | - | - |
| styles | 语义化 style | Record<SemanticType, CSSProperties> | - | - |

SemanticType：`root` \| `directoryTree` \| `directoryTitle` \| `filePreview` \| `previewTitle` \| `previewRender`

### FolderTreeData

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 显示名称 | string \| VNode | - |
| path | 路径段 | string | - |
| content | 文件内容（可选） | string | - |
| children | 子项 | FolderTreeData[] | - |
| contextMenu | 节点右键菜单，`false` 禁用 | MenuProps\['items'\] \| false \| ((key) => ...) | - |

### FileContentService

```ts
interface FileContentService {
  loadFileContent(filePath: string): Promise<string>;
}
```

### Ref 方法

```ts
const folderRef = ref<FolderRef>();

folderRef.value?.getNode(['src', 'App.tsx']);
folderRef.value?.updateNode(['src', 'App.tsx'], { title: 'Main.tsx', path: 'Main.tsx' });
folderRef.value?.deleteNode(['src', 'unused.ts']);
folderRef.value?.addNode(['src'], { title: 'new.ts', path: 'new.ts', content: '' });
```

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| getNode | 根据路径获取节点 | (path: string[]) => FolderTreeData \| undefined |
| updateNode | 不可变更新节点，返回新 treeData | (path, data) => FolderTreeData[] |
| deleteNode | 不可变删除节点，返回新 treeData | (path) => FolderTreeData[] |
| addNode | 不可变新增子节点，返回新 treeData | (parentPath, node) => FolderTreeData[] |

## 语义化结构

:::semantic

folder

:::
