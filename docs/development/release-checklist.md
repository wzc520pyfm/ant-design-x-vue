# 2.10.0 核对清单

对照 React `@ant-design/x@2.10.0`（tag `2.10.0`，commit `da08db1`）。本页记录当前 `dev` 相对该版本的功能、测试与文档核对结果，以及发布前仍需满足的条件。

本地验证（2026-11-08，Asia/Shanghai）：

- `pnpm test`：79 个测试文件、589 个用例通过。
- `pnpm exec vue-tsc --project tsconfig.build.json --noEmit`：退出码 0。
- `pnpm build:all`：5 个包构建成功。
- `pnpm docs:build`：完成。
- `pnpm pack`：5 个包均为 `2.10.0`，tarball 内没有 `workspace:*`。
- 5 个 tarball 在全新临时项目中一起安装，`vite build` 通过；`x-skill` CLI 版本为 `2.10.0`。

## 功能对齐（2.10.0）

- Prompts：可点击项渲染为原生 `button`，支持 Tab 聚焦、Enter/空格触发和禁用态。
- Mermaid：首次渲染不再空白；并发渲染只保留最后一次结果；独立组件与 XMarkdown 插件均改为跨实例共享串行渲染队列，并使用全局唯一 id，文档页 4 个示例均可渲染；缩放不设 3 倍上限；PNG 导出按图表 viewBox 计算，不受当前缩放影响。
- Folder：展开按钮沿用 React 的 10px switcher 结构；浏览器检查确认悬停时无异常背景（React 本身也未额外添加背景）。
- CodeHighlighter：流式更新时仅 `domNode` 变化不会重复高亮；Folder 预览默认使用 CodeHighlighter；常见 Prism 语法改为静态映射，Vite 下 `typescript`、`json` 等非核心语言可以正常加载。
- XMarkdown：`streaming` 支持布尔预设；`streaming.incremental` 支持按标题分段和 `keepSectionsOnEnd`；`incompleteMarkdown: 'complete'` 立即显示未闭合的强调、行内代码、链接文字和列表项；`streaming.typewriter` 支持逐字/逐句和 `animationConfig.splitBy`；`componentsProps` 按标签名传递属性；导出 `arePropsEqualIgnoringDomNode`。
- LaTeX：正文金额不再误判为公式；单美元行内公式遵循 Pandoc 定界规则，支持公式内转义美元；双美元公式行为保留。
- XRequest：JSON 返回 `{ success: false }` 后结束 `isRequesting`；旧请求的业务错误不会清除新请求的进行中状态。
- XStream：迭代提前退出时取消 reader 并释放锁。
- x-skill：React 2.10 的路径穿越、符号链接和重定向凭据修复针对远端下载；Vue 包只从包内复制 skill 目录，不走远端下载，因此该风险不适用。

### 2.8 / 2.9 延续项

- Folder 右键菜单、Splitter 分栏与拖拽。
- `useMobile` 及 Actions / Conversations 移动端行为，含 `touch-action: manipulation`。
- Think、ThoughtChain 的 `destroyOnHidden`；ThoughtChain item 的 `disabled` 与语义化样式。
- Sender `slotConfig` 引用变化时恢复运行时插入的 slot；borderless 输入聚焦不显示外层 outline；卸载时停止 SpeechRecognition 并清空回调。
- Suggestion 弹层超过 256px 时内部滚动；Sources CarouselCard 跟随受控 `activeKey`。
- `marked` 升级到 16.x。

## 测试对齐

- React 使用 RTL，Vue 使用 Vue Test Utils；两边不追求测试文件逐条对应，按 2.10 行为逐项建用例。
- 2.10 新增或补强的用例：`prompts/keyboard-a11y`、`mermaid/index`（首渲染、并发、多实例唯一 id、缩放）、`mermaid/zoom-export`、`mermaid/render-id`（插件多实例唯一 id）、`code-highlighter/streaming-cache`、`code-highlighter/loadLanguage`（`vue` → `markup`、TypeScript/JSON 静态加载）、`folder/splitter`、`folder/file-preview-highlight`、`thought-chain/disabled`、`sender/use-speech-cleanup`、`sources/carousel-active-key`、`x-markdown/preset`（布尔预设、incremental、complete、`arePropsEqualIgnoringDomNode`）、`x-markdown/Latex`、`x-sdk/json-state`、`x-sdk/x-stream`（提前退出）。
- `x-markdown/index` 覆盖 `componentsProps` 与 `debug`；`x-markdown/useTypewriter` 覆盖打字机分片。
- 全量：79 个文件、589 个用例通过。

## 浏览器验收

2026-11-09 在本地文档构建上完成：

- Folder：展开按钮结构与 React 一致，悬停时无异常背景。
- Mermaid：4 个示例全部渲染；放大到 3.4 倍仍正常；导出的 PNG 尺寸为 333×470，与图表 viewBox 一致，不受当前缩放影响。
- 移动端（Pixel 10 UA / 360px）：Actions 操作项与 Feedback 悬停均不出现 Tooltip；Conversations 菜单图标带 `ant-conversations-menu-icon-mobile` 且始终可见。

## 文档对齐

- 中英文页面集合一致：组件 19 页、XMarkdown 13 页、X SDK 10 页、XCard 3 页、XSkill 3 页；`development` 页面也保持成对。
- 安装片段、页头版本、FAQ、迁移文档、包 README 和 skill 文案统一到 `2.10.0`。
- XCard 的 v0.8 / v0.9 场景、XSkill 安装说明、XMarkdown 流式 API 表均已补齐。
- 代码块高亮将 `vue` 映射到 Prism 的 `markup` 语法，避免 Vue 示例报“语言不存在”。

## 有意不同

- 根节点使用 Vue `class`；声明了 `className` 的组件同时接收两者。
- `Bubble.List` 以 `roles` 为准，同时保留 React 兼容别名 `role`；两者同时传入时用 `roles`。
- Vue 没有公开的 `React.memo` 渲染跳过机制；`arePropsEqualIgnoringDomNode` 用于自定义缓存层或第三方渲染适配器。
- `@ant-design-x-vue/x-skill` 只复制包内 skill，不下载远端 skill，因此没有 React 的远端下载校验逻辑。
- XMarkdown 不提供单独的浏览器 `dist/plugins/*.min.js`，使用包入口或 `plugins/*` 子路径。

## 发布前门槛

以下条件全部满足后才可发布：

1. 截至 2026-11-09，PR #536 为 OPEN、MERGEABLE/CLEAN，head `c3f9c2d` 已包含 #537–#543；提交本次 2.10 对齐修改并推送后重新确认 PR 状态。
2. 工作区干净，CI 全绿，review 通过。
3. 重新执行本页的测试、类型检查、全量构建、文档构建和 5 个包的 pack 检查。
4. 确认 5 个包版本都是 `2.10.0`，tarball 中没有 `workspace:*`。

## 发布顺序

1. `@ant-design-x-vue/x-sdk`
2. `@ant-design-x-vue/x-markdown` 与 `ant-design-x-vue`
3. `@ant-design-x-vue/x-card` 与 `@ant-design-x-vue/x-skill`

第 2 步的两个包互相依赖 `2.10.0`，必须同批连续发布；单独先发任何一个，都会出现一段依赖尚未上架的不可安装窗口。`npm publish` 不校验依赖是否已存在，因此发布后还要用 registry 上的版本做一次全新安装验证。全部包可安装后再打 tag。
