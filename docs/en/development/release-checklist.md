# 2.0 checklist

Compare React `@ant-design/x@2.0.0` (tag `2.0.0`). This page records the alignment of this branch relative to that version.

Local verification (2026-10-28, Asia/Shanghai):

- `vue-tsc --project tsconfig.build.json --noEmit` exit code 0. The declared products include `Actions.vue.d.ts`, `ActionsItem.vue.d.ts`, `ImageLoading.vue.d.ts`.
- `vitest run`: 9 files, 22 tests passed.
- `pnpm --filter` builds `@ant-design-x-vue/x-sdk`, `@ant-design-x-vue/x-markdown`, `ant-design-x-vue` successfully.
- `pnpm docs:build` completed.
- Local `npm pack` (unpublished): None of the three packages have `workspace:*`. The SDK has no runtime dependencies. The main package depends on two `2.0.0` sub-packages. Markdown depends on `ant-design-x-vue@2.0.0`.

## Already aligned

- The main package exports 2.0's `useXChat`, `useXConversations`, `XRequest`, `XStream`, and `OpenAIChatProvider`, `DeepSeekChatProvider`, `DefaultChatProvider`, `AbstractChatProvider`.
- `createOpenAIChatProvider` / `resolvePresetApiKey` connected to 1.x default protocol: manual `XRequest` + OpenAI Chat Completions. `useXAgent` still only serves 1.x examples.
- XMarkdown page covers plugins, Latex, HighlightCode, Mermaid, Think mapping, light/dark themes, streaming unfinished syntax.
- SDK page coverage introduction, Provider, useXChat, useXConversations, XRequest, XStream; API table alignment React 2.0.0 depth.
- In addition to independent style and assistant style, the model room adds modernity and treasure chest layout.
- Document the `roles` of `Bubble.List`, the `key` of `FileCard` list items, and the root node `class` in the migration document.
- The design site (RICH, etc.) has been moved to [Design](/en/design/introduce); developer-side access is via [Design Paradigm](/en/development/spec).

## Intentionally different

- Use Vue `class` on the root node. For components that declare `className`, collect both.
- The `FileCard` component props do not include `key`. The stable identifier is on the item in `FileCard.List`.
- `Bubble.List` accepts both `roles` and `role`; if both are passed, use `roles`.

## Not mirrored

- Modern design does not call DeepSeek, and the toolbox does not call `tbox-nodejs-sdk`. The latter is a Node SDK, while the documentation site runs in the browser.
- React scaffold pages (Next, Umi, Rsbuild, CRA) and React FAQ are not migrated.
- XMarkdown does not have separate browser `dist/plugins/*.min.js`. Use the package entry or the `plugins/*` subpath.

## Publish

Do not run `npm publish` on this branch. When all three packages are `2.0.0`, first publish `@ant-design-x-vue/x-sdk`, then `ant-design-x-vue` and `@ant-design-x-vue/x-markdown`. Do not leave `workspace:*` in the packages.
