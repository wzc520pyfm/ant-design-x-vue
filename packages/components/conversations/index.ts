import type { App } from 'vue';
import ConversationsComponent from './Conversations.vue';
import CreationComponent from './Creation.vue';

export type {
  ConversationsProps,
  Conversation,
  ConversationItemType,
  DividerItemType,
  ItemType,
  CreationProps,
  GroupableProps,
} from './interface';

type CompoundedComponent = typeof ConversationsComponent & {
  Creation: typeof CreationComponent;
};

const Conversations = ConversationsComponent as CompoundedComponent;
Conversations.Creation = CreationComponent;

Conversations.install = function (app: App) {
  app.component(Conversations.name!, Conversations);
  app.component(CreationComponent.name!, CreationComponent);
  return app;
};

export default Conversations;

export { Conversations };
