import type { App } from 'vue';
import Actions from './Actions.vue';

export type { ActionsProps, ActionItem, ItemType, SubItemType } from './interface';

// @ts-ignore
Actions.install = function(app: App) {
  app.component(Actions.name, Actions);
  return app;
}

export default Actions;

export {
  Actions,
}

