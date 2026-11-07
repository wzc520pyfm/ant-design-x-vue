# Extensions

Official plugins (named exports): `Latex`, `HighlightCode`, `Mermaid`.

```ts
import { Latex, HighlightCode, Mermaid } from '@ant-design-x-vue/x-markdown'
const plugins = [Latex, HighlightCode, Mermaid]
```

`components` maps tag names (`h1`, `pre`, `code`, `mermaid`, `think`, custom tags) to Vue components.

`paragraphTag` avoids illegal nesting when a custom block component replaces a paragraph.

`protectCustomTagNewlines` / `disableCustomTagBlockMarkdown` exist for custom tags that span lines — check the examples page before inventing new flags.
