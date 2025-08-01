import type { App } from 'vue';
import Conversations from './Conversations.vue';

export type { ConversationsProps, Conversation } from './interface';

// @ts-ignore
Conversations.install = function(app: App) {
  app.component(Conversations.name, Conversations);
  return app;
}

export default Conversations;

export {
  Conversations,
}
