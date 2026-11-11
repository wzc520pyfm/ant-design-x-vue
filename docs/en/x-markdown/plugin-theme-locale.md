# Theme and copy

Use [XProvider](/en/component/x-provider) as the global copy of the plug-in; the highlight/Mermaid appearance can follow the ant-design-vue Design Token, or be customized through the component `styles` / `classNames`.

## Usage notes

`XProvider` inherits `ConfigProvider` of ant-design-vue and provides global configuration for `ant-design-x-vue` components (including Markdown plug-in copywriting). If the project is already using `ConfigProvider`, please change it to:

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

Merge the language package of `ant-design-vue` with the `zh_CN` / `en_US` of `ant-design-x-vue` and pass it to `locale`. The "Copy" of `HighlightCode` and the toolbar copy of `Mermaid` will be switched accordingly.

## Examples

### Internationalization

:::demo-v2 Switch between Chinese and English to see HighlightCode copy and Mermaid toolbar copy.

x-markdown/xprovider-locale

:::

### Theme colors

:::demo-v2 Adjust container colors with XProvider `theme.token`. The HighlightCode header follows tokens such as `colorFillContent`.

x-markdown/xprovider-theme

:::

## Related

- Component-level API: `styles` / `classNames` See [HighlightCode](/en/x-markdown/rich-text), [Mermaid](/en/x-markdown/data-display)
- Markdown body light / dark CSS: [theme](/en/x-markdown/themes)
- XProvider full API: [XProvider](/en/component/x-provider)
