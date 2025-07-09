import type { App } from 'vue';
import Prompts from './Prompts.vue';

export type { PromptsProps } from './interface';

// @ts-ignore
Prompts.install = function(app: App) {
  app.component(Prompts.name, Prompts);
  return app;
}

export default Prompts;

export {
  Prompts,
}
