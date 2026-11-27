---
aside: false
---

# Tbox

Layout matches React 2.10 agent-tbox: side logo / conversations (create, rename stub, delete, `[Current Conversation]` prefix) and Avatar footer; empty Welcome + two Prompts cards; Sender-row prompts; per-bubble ThoughtChain.Item status header, XMarkdown (`ext_text` → `<think>`) + Think, and Actions (pagination stub / retry / copy / audio mock / feedback).

React uses Node-only `tbox-nodejs-sdk`, which cannot ship in the browser docs. This page uses a local `MockTboxProvider` (`AbstractChatProvider` + `AbstractXRequestClass`) cached per conversation, streaming the same `{ text, ext_text }` payload shape as React's Tbox transform.

:::demo

playground/agent-tbox

:::
