
# XProvider 全局化配置

为组件提供统一的全局化配置。

## 使用说明

`XProvider` 继承了 `antdv` 的 `ConfigProvider`，且为 `ant-design-x-vue` 中的组件提供全局化配置。

如果您已经使用 `antdv` 的 `ConfigProvider`，请对您的代码做如下变更：

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

## 代码演示

### 方向

:::demo-v2 这里列出了支持 `rtl` 方向的组件，您可以在演示中切换方向。

x-provider/direction

:::

### 主题

:::demo-v2 通过 `theme` 修改主题。

x-provider/theme

:::

### 快捷键

:::demo-v2 通过 `shortcutKeys` 设置快捷键。

x-provider/shortcut-keys

:::

## API

`XProvider` 完全继承 `antdv` 的 `ConfigProvider`, 属性参考：[Antdv ConfigProvider](https://www.antdv.com/components/config-provider-cn#api)

### 组件配置

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| actions | 操作列表组件的全局配置 | ComponentStyleConfig | - | - |
| attachments | 输入附件组件的全局配置 | ComponentStyleConfig | - | - |
| bubble | 气泡组件的全局配置 | ComponentStyleConfig | - | - |
| conversations | 会话组件的全局配置 | ComponentStyleConfig & { shortcutKeys } | - | - |
| fileCard | 文件卡片组件的全局配置 | ComponentStyleConfig | - | - |
| prompts | 提示集组件的全局配置 | ComponentStyleConfig | - | - |
| sender | 输入框组件的全局配置 | ComponentStyleConfig | - | - |
| sources | 引用来源组件的全局配置 | ComponentStyleConfig | - | - |
| suggestion | 建议组件的全局配置 | ComponentStyleConfig | - | - |
| think | 思考组件的全局配置 | ComponentStyleConfig | - | - |
| thoughtChain | 思维链组件的全局配置 | ComponentStyleConfig | - | - |
| welcome | 欢迎组件的全局配置 | ComponentStyleConfig | - | - |

### Markdown 组件配置

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| highlightCode | 代码高亮组件的全局配置 | ComponentStyleConfig | - | - |
| mermaid | Mermaid 图表组件的全局配置 | ComponentStyleConfig | - | - |

### ComponentStyleConfig

```ts
interface ComponentStyleConfig {
  style: CSSProperties;
  styles: Record<string, CSSProperties>;
  className: string;
  classNames: Record<string, string>;
}
```

### ShortcutKeys

```ts
type PrefixKeysType = {
  Ctrl: [keyof KeyboardEvent, string, string];
  Alt: [keyof KeyboardEvent, string, string];
  Meta: [keyof KeyboardEvent, string, string];
  Shift: [keyof KeyboardEvent, string, string];
};

type ShortcutKeys<CustomKey = number | 'number'> =
  | [keyof PrefixKeysType, keyof PrefixKeysType, CustomKey]
  | [keyof PrefixKeysType, CustomKey];
```

## 主题变量（Design Token）

## 贡献者

<doc-contributors component-name="x-provider" :max-count="50" :show-view-all="true" />
