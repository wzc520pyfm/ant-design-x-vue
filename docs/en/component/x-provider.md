
# XProvider

Provides unified global configuration for components.

## Usage notes

`XProvider` inherits from `antdv`'s `ConfigProvider` and provides global configuration for components in `ant-design-x-vue`.

If you are already using `antdv`'s `ConfigProvider`, please make the following changes to your code:

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

## Examples

### Direction

:::demo-v2 Here lists the components that support `rtl` direction, and you can switch directions in the demo.

x-provider/direction

:::

### Theme

:::demo-v2 Modify the theme through `theme`.

x-provider/theme

:::

### Internationalization

:::demo-v2 Switch component text through `locale`. You can merge the language packs of `ant-design-vue` with `ant-design-x-vue`'s `zh_CN` / `en_US` and pass it in.

x-provider/locale

:::

### Keyboard shortcuts

:::demo-v2 Set shortcut keys through `shortcutKeys`.

x-provider/shortcut-keys

:::

## API

`XProvider` fully inherits from `antdv`'s `ConfigProvider`. Refer to properties here: [Antdv ConfigProvider](https://www.antdv.com/components/config-provider-cn#api)

### Components Configuration

| Prop | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| actions | Global configuration for the action list component | ComponentStyleConfig | - | - |
| attachments | Global configuration for the attachment input component | ComponentStyleConfig | - | - |
| bubble | Global configuration for the bubble component | ComponentStyleConfig | - | - |
| conversations | Global configuration for the conversation component | ComponentStyleConfig & { shortcutKeys } | - | - |
| fileCard | Global configuration for the file card component | ComponentStyleConfig | - | - |
| prompts | Global configuration for the prompts component | ComponentStyleConfig | - | - |
| sender | Global configuration for the input box component | ComponentStyleConfig | - | - |
| sources | Global configuration for the references component | ComponentStyleConfig | - | - |
| suggestion | Global configuration for the suggestion component | ComponentStyleConfig | - | - |
| think | Global configuration for the thinking component | ComponentStyleConfig | - | - |
| thoughtChain | Global configuration for the thought chain component | ComponentStyleConfig | - | - |
| welcome | Global configuration for the welcome component | ComponentStyleConfig | - | - |

### Markdown component configuration

| Prop | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| highlightCode | Global configuration for the code highlighting component | ComponentStyleConfig | - | - |
| mermaid | Global configuration for the Mermaid chart component | ComponentStyleConfig | - | - |

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

## Design Token

XProvider itself does not provide independent Component Tokens; please configure global Tokens and individual Component Tokens through `theme`.

## Contributors

<doc-contributors component-name="x-provider" :max-count="50" :show-view-all="true" />
