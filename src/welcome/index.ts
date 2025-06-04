import type { App } from 'vue';
import Welcome from './Welcome.vue';

export type { WelcomeProps } from './interface';

// @ts-ignore
Welcome.install = function(app: App) {
  app.component(Welcome.name, Welcome);
  return app;
}

export default Welcome;

export {
  Welcome
}
