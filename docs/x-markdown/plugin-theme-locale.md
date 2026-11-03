# 主题与文案

用 [XProvider](/component/x-provider) 做插件的全局文案；高亮 / Mermaid 外观可跟随 ant-design-vue Design Token，或通过组件 `styles` / `classNames` 定制。

## 使用说明

`XProvider` 继承 ant-design-vue 的 `ConfigProvider`，并为 `ant-design-x-vue` 组件（含 Markdown 插件文案）提供全局配置。若项目已在用 `ConfigProvider`，请改为：

```diff
- import { ConfigProvider } from 'ant-design-vue';
+ import { XProvider } from 'ant-design-x-vue';

  const App = () => (
-   <ConfigProvider>
+   <XProvider>
      <YourApp />
-   </ConfigProvider>
+   </XProvider>
  );
```

把 `ant-design-vue` 的语言包与 `ant-design-x-vue` 的 `zh_CN` / `en_US` 合并后传入 `locale`。`HighlightCode` 的「复制」与 `Mermaid` 的工具栏文案会跟着切换。

## 代码演示

### 国际化

:::demo-v2 切换中 / 英，观察 HighlightCode 复制按钮与 Mermaid 工具栏文案。

x-markdown/xprovider-locale

:::

### 主题色

:::demo-v2 通过 XProvider `theme.token` 调整容器色，HighlightCode 顶栏会跟随 `colorFillContent` 等 token。

x-markdown/xprovider-theme

:::

## 相关

- 组件级 API：`styles` / `classNames` 见 [HighlightCode](/x-markdown/rich-text)、[Mermaid](/x-markdown/data-display)
- Markdown 正文 light / dark CSS：[主题](/x-markdown/themes)
- XProvider 全量 API：[XProvider](/component/x-provider)
