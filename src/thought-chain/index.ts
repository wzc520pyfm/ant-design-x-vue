import type { App } from 'vue';
import ThoughtChain from './ThoughtChain.vue';

export type { ThoughtChainProps, ThoughtChainItem } from './interface';

// @ts-ignore
ThoughtChain.install = function(app: App) {
  app.component(ThoughtChain.name, ThoughtChain);
  return app;
}

export default ThoughtChain;

export {
  ThoughtChain,
}
