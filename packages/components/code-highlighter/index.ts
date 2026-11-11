import type { App } from 'vue';
import CodeHighlighter from './CodeHighlighter.vue';

export type {
  CodeHighlighterProps,
  CodeHighlighterHighlightProps,
  CodeHighlighterSemanticType,
  SemanticType as CodeHighlighterSemanticTypeName,
} from './interface';

// @ts-ignore
CodeHighlighter.install = function (app: App) {
  app.component(CodeHighlighter.name, CodeHighlighter);
  return app;
};

export default CodeHighlighter;

export { CodeHighlighter };
