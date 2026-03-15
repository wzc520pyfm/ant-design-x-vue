import type { App } from 'vue';
import Think from './Think.vue';

export type { ThinkProps, ThinkSemanticType } from './interface';

// @ts-ignore
Think.install = function (app: App) {
  app.component(Think.name!, Think);
  return app;
};

export default Think;

export { Think };
