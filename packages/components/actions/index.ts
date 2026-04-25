import type { App } from 'vue';
import ActionsComponent from './Actions.vue';
import ActionsItemComp, { ACTIONS_ITEM_STATUS } from './ActionsItem.vue';
import ActionsCopyComp from './ActionsCopy.vue';
import ActionsFeedbackComp from './ActionsFeedback.vue';
import ActionsAudioComp from './ActionsAudio.vue';

export type {
  ActionsProps,
  ActionsRef,
  ActionItem,
  ItemType,
  SubItemType,
  SemanticType,
} from './interface';

export type CompoundedActions = typeof ActionsComponent & {
  Feedback: typeof ActionsFeedbackComp;
  Copy: typeof ActionsCopyComp;
  Item: typeof ActionsItemComp;
  Audio: typeof ActionsAudioComp;
  install: (app: App) => App;
};

const Actions = ActionsComponent as CompoundedActions;

Actions.Feedback = ActionsFeedbackComp;
Actions.Copy = ActionsCopyComp;
Actions.Item = ActionsItemComp;
Actions.Audio = ActionsAudioComp;

Actions.install = function (app: App) {
  app.component((ActionsComponent as any).name, ActionsComponent);
  app.component((ActionsItemComp as any).name, ActionsItemComp);
  app.component((ActionsCopyComp as any).name, ActionsCopyComp);
  app.component((ActionsFeedbackComp as any).name, ActionsFeedbackComp);
  app.component((ActionsAudioComp as any).name, ActionsAudioComp);
  return app;
};

export { ACTIONS_ITEM_STATUS };
export {
  ActionsItemComp as ActionsItem,
  ActionsCopyComp as ActionsCopy,
  ActionsFeedbackComp as ActionsFeedback,
  ActionsAudioComp as ActionsAudio,
};

export default Actions;
export { Actions };
