# FAQ

## Do the header 2.10.0 and 1.x options open the same site?

No. 2.10.0 is the current version of this documentation. Choosing 1.x will leave this site and open `https://1x-ant-design-x-vue.netlify.app`. If the path matches, it will open the same page; if not, it will land on the entry page of that section.

## Which version do the header sections come from?

The top bar and component grouping align with `@ant-design/x@2.10.0` Navigation and `components/index.ts`: Design, Development, Components, X Markdown, X SDK, X Card, X Skill, Demo. This version of the documentation is organized by that set of sections.

## Is `useXAgent` still available?

It is still exported from the main package, only for old examples. For new model integration, use [Chat Provider](/en/x-sdk/chat-provider).

## Why do demos ship both tsx and setup variants?

The style preference at the top of the sidebar will switch the source code displayed in `:::demo`. This is a toggle specific to the Vue documentation; the React site does not have it.
