import type { App } from 'vue';
import Sources from './Sources.vue';

export type { SourcesProps, SourcesItem, SemanticType as SourcesSemanticType } from './interface';

// @ts-ignore
Sources.install = function (app: App) {
  app.component(Sources.name, Sources);
  return app;
};

export default Sources;

export { Sources };
