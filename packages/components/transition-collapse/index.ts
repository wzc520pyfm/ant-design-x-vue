import type { App, Plugin } from 'vue';
import TransitionCollapse from './TransitionCollapse.vue';

TransitionCollapse.install = function (app: App) {
  app.component(TransitionCollapse.name, TransitionCollapse);
  return app;
};

export { TransitionCollapse };

export { genTransitionCollapseStyle } from './style';

export default TransitionCollapse as typeof TransitionCollapse & Plugin;
