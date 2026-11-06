import type { App } from 'vue';
import Mermaid from './Mermaid.vue';

export type {
  MermaidProps,
  MermaidSemanticType,
  MermaidType,
  MermaidRenderType,
  MermaidActionsConfig,
  MermaidHighlightProps,
} from './interface';

// @ts-ignore
Mermaid.install = function (app: App) {
  app.component(Mermaid.name!, Mermaid);
  return app;
};

export default Mermaid;

export { Mermaid };
