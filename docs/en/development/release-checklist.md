# 2.10.0 checklist

Compare React `@ant-design/x@2.10.0` (tag `2.10.0`, commit `da08db1`). This page records the feature, test, and documentation audit of the current `dev` branch, plus the remaining release gates.

Local verification (2026-11-08, Asia/Shanghai):

- `pnpm test`: 79 test files, 589 tests passed.
- `pnpm exec vue-tsc --project tsconfig.build.json --noEmit`: exit code 0.
- `pnpm build:all`: all 5 packages built.
- `pnpm docs:build`: completed.
- `pnpm pack`: all 5 packages are `2.10.0`; no tarball contains `workspace:*`.
- All 5 tarballs installed together in a fresh temporary project; `vite build` passed and the `x-skill` CLI reports `2.10.0`.

## Feature parity (2.10.0)

- Prompts: clickable items render as native `button` elements with Tab focus, Enter/Space activation, and disabled-state handling.
- Mermaid: the first render is no longer blank; concurrent renders keep only the latest result; both the standalone component and the XMarkdown plugin share a serial render queue across instances and use globally unique ids, so all 4 examples on the docs page render; zoom is not capped at 3x; PNG export uses the diagram viewBox and ignores the current zoom/pan state.
- Folder: the expand button keeps the React 10px switcher structure; browser checks confirm no unexpected hover background (React does not add one either).
- CodeHighlighter: streaming updates that only change `domNode` do not re-highlight; Folder previews use CodeHighlighter by default; common Prism grammars are statically mapped so Vite loads non-core languages such as TypeScript and JSON.
- XMarkdown: `streaming` accepts the boolean preset; `streaming.incremental` splits by heading and supports `keepSectionsOnEnd`; `incompleteMarkdown: 'complete'` immediately shows open emphasis, inline code, link text, and list items; `streaming.typewriter` supports character/sentence pacing and `animationConfig.splitBy`; `componentsProps` passes props by tag name; `arePropsEqualIgnoringDomNode` is exported.
- LaTeX: currency amounts are no longer parsed as formulas; single-dollar inline formulas follow Pandoc delimiter rules and escaped dollars inside formulas are supported; double-dollar behavior is unchanged.
- XRequest: a JSON `{ success: false }` response now ends `isRequesting`; a business error from an older request no longer clears the active state of a newer request.
- XStream: exiting iteration early cancels the reader and releases its lock.
- x-skill: the React 2.10 path-traversal, symlink, and redirect-credential fixes target remote downloads. The Vue package only copies package-local skill folders and never downloads remote skills, so those risks do not apply.

### Carried over from 2.8 / 2.9

- Folder context menu, Splitter panes, and drag resizing.
- `useMobile` and mobile behavior for Actions / Conversations, including `touch-action: manipulation`.
- `destroyOnHidden` on Think and ThoughtChain; `disabled` and semantic styles on ThoughtChain items.
- Sender restores runtime-inserted slots when the `slotConfig` reference changes, hides the outer focus outline on borderless inputs, and stops SpeechRecognition with cleared handlers on unmount.
- Suggestion menus scroll internally above 256px; Sources CarouselCard follows controlled `activeKey`.
- `marked` upgraded to 16.x.

## Test parity

- React uses RTL and Vue uses Vue Test Utils; test files are not mirrored one-to-one. Coverage is built around the 2.10 behaviors.
- New or strengthened coverage for 2.10: `prompts/keyboard-a11y`, `mermaid/index` (first render, concurrency, unique ids across instances, zoom), `mermaid/zoom-export`, `mermaid/render-id` (unique plugin ids across instances), `code-highlighter/streaming-cache`, `code-highlighter/loadLanguage` (`vue` → `markup`, static TypeScript/JSON loading), `folder/splitter`, `folder/file-preview-highlight`, `thought-chain/disabled`, `sender/use-speech-cleanup`, `sources/carousel-active-key`, `x-markdown/preset` (boolean preset, incremental, complete, `arePropsEqualIgnoringDomNode`), `x-markdown/Latex`, `x-sdk/json-state`, and `x-sdk/x-stream` (early exit).
- `x-markdown/index` covers `componentsProps` and `debug`; `x-markdown/useTypewriter` covers typewriter slicing.
- Full run: 79 files, 589 tests passed.

## Browser acceptance

Completed against the local docs build on 2026-11-09:

- Folder: the expand button matches React, with no unexpected hover background.
- Mermaid: all 4 examples render; zooming to 3.4x works; the exported PNG is 333×470, matching the diagram viewBox and ignoring the current zoom.
- Mobile (Pixel 10 UA / 360px): Actions items and Feedback show no Tooltip on hover; the Conversations menu icon carries `ant-conversations-menu-icon-mobile` and stays visible.

## Documentation parity

- Chinese and English page sets match: 19 component pages, 13 XMarkdown pages, 10 X SDK pages, 3 XCard pages, and 3 XSkill pages; `development` pages are paired as well.
- Install snippets, the header version, FAQ, migration guides, package READMEs, and skill text all say `2.10.0`.
- XCard v0.8 / v0.9 scenarios, XSkill installation, and the XMarkdown streaming API tables are complete.
- Code highlighting maps `vue` to Prism's `markup` grammar, so Vue examples no longer report a missing language.

## Intentional differences

- Root nodes use Vue `class`; components that declare `className` accept both.
- `Bubble.List` treats `roles` as canonical and keeps `role` as a React-compatible alias; `roles` wins when both are passed.
- Vue has no public `React.memo` render-bailout equivalent; `arePropsEqualIgnoringDomNode` is intended for custom caches or third-party rendering adapters.
- `@ant-design-x-vue/x-skill` copies package-local skills only and never downloads remote skills, so React's remote-download validation has no direct counterpart.
- XMarkdown does not ship standalone browser `dist/plugins/*.min.js` bundles; use the package entry or `plugins/*` subpaths.

## Release gates

Do not publish until all of the following are true:

1. As of 2026-11-09, PR #536 is OPEN and MERGEABLE/CLEAN, with head `c3f9c2d` already containing #537–#543. Commit and push the 2.10 alignment changes, then re-check the PR state.
2. The working tree is clean, CI is green, and review is approved.
3. Re-run the tests, typecheck, full build, docs build, and pack check for all 5 packages.
4. Confirm all 5 packages are `2.10.0` and no tarball contains `workspace:*`.

## Publish order

1. `@ant-design-x-vue/x-sdk`
2. `@ant-design-x-vue/x-markdown` and `ant-design-x-vue`
3. `@ant-design-x-vue/x-card` and `@ant-design-x-vue/x-skill`

The two packages in step 2 depend on each other at `2.10.0`, so they must be published back-to-back. Publishing either one alone creates a window where the other dependency is not installable. `npm publish` does not verify that dependencies already exist, so follow up with a clean install from the registry. Tag only after every package is installable.
