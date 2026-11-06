# Components (Vue)

Import everything below from `ant-design-x-vue` unless noted. Prop tables live on https://x-vue.ant.design/component/* — do not guess names from React docs.

## Bubble / Bubble.List

- Items need a unique `key`.
- `roles` configures per-role `placement`, `contentRender`, `loadingRender`, etc. `role` is an alias; `roles` wins.
- `contentRender(content, info)` should use `h()`.
- `messageRender` is deprecated.
- `streaming` / `typing` control in-bubble animation. Leave `streaming` true and the bubble never settles.
- Sub-nodes: `Bubble.System`, `Bubble.Divider`.

## Sender

- `@submit` (value: string) on send / Enter
- `@change` on each edit
- `:loading` + `@cancel` while a request is in flight
- Slot header/footer/prefix for `Attachments` and extra actions

## Conversations

- `:items` with `{ key, label, ... }`
- `:active-key` + `@active-change`
- `creation` for the “new chat” control

## Welcome / Prompts

- `Welcome`: `title`, `description`, extra slots
- `Prompts`: `:items`, `@item-click` (payload includes `data`)

## Think / ThoughtChain

- `Think`: collapsible single reasoning block
- `ThoughtChain`: ordered steps / tool calls

## Actions

Preset subcomponents `Actions.Copy`, `Actions.Feedback`, `Actions.Audio` — prefer these over one-off icon rows.

## Attachments / FileCard / Sources / Suggestion

Use site docs for item shapes. Attachments typically sit inside Sender. Sources list citations. Suggestion wraps an input to provide command palettes.

## CodeHighlighter / Mermaid

Render via `contentRender` or a components map, not inside a raw Markdown string passed as `content` without `XMarkdown`.

## Folder

Tree + preview. Width can be dragged (internal Splitter). Not exported as a standalone `Splitter` from the package entry.

## Notification / XProvider

`Notification` for in-app toasts. `XProvider` for locale, direction, theme (ant-design-vue theme), and X shortcuts — no `zeroRuntime`.
