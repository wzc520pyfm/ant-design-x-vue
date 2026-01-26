import type { App } from 'vue';
import BubbleComponent from './Bubble.vue';
import BubbleList from './BubbleList.vue';
import BubbleDivider from './Divider.vue';
import BubbleSystem from './System.vue';

export type {
  BubbleProps,
  BubbleListProps,
  BubbleListRef,
  BubbleRef,
  BubbleItemType,
  BubbleDataType,
  RoleType,
  RolesType,
  SystemBubbleProps,
  DividerBubbleProps,
  BubbleAnimationOption,
  EditableBubbleOption,
  MessageStatus,
  Info,
} from './interface';

type BubbleType = typeof BubbleComponent & {
  List: typeof BubbleList;
  System: typeof BubbleSystem;
  Divider: typeof BubbleDivider;
};

const Bubble = BubbleComponent as BubbleType;
Bubble.List = BubbleList;
Bubble.System = BubbleSystem;
Bubble.Divider = BubbleDivider;

// @ts-ignore
Bubble.install = function (app: App) {
  app.component(Bubble.name!, Bubble);
  app.component(BubbleList.name!, BubbleList);
  app.component(BubbleSystem.name!, BubbleSystem);
  app.component(BubbleDivider.name!, BubbleDivider);
  return app;
};

export default Bubble;

export { Bubble, BubbleList, BubbleSystem, BubbleDivider };
