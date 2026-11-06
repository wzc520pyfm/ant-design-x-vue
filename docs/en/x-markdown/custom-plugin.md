# Custom plugin

You can use [Marked extensions](https://marked.js.org/using_advanced#extensions), or use an object with 'transform(content)' to rewrite the string before parsing. Customize the tag and then use the 'components' mapping.

## String transform

:::demo-v2 A plugin `transform` bolds `TODO` before marked runs.

x-markdown/plugins

:::

## Marked extension: footnotes

Next, use tokenizer / renderer to convert `[^n]` to `<footnote>`, then map it to a component with Popover (align with React 'CustomPlugin/custom.tsx').

:::demo-v2 Footnote syntax plus a components mapping.

x-markdown/custom-footnote

:::

## Division of work with components

| Method | Stage | Function |
| --- | --- | --- |
| `config.extensions` / marked plugin | Markdown → HTML | Recognize new syntax, output HTML tags |
| `plugins[].transform` | Before parsing | Rewrite as plain string |
| `components` | HTML → VNode | Replace tags with Vue components |

For more API details, see [Code Examples · FAQ](/en/x-markdown/examples).
