import type { App } from 'vue';

import * as components from './components';
import cssinjs from './_util/cssinjs';

export * from './components';
export * from './hooks';

export * from './theme';
export * from './_util/cssinjs';

export const install = function (app: App) {
  Object.keys(components).forEach(key => {
    // @ts-ignore
    const component = components[key];
    if (component.install) {
      app.use(component);
    }
  });
  app.use(cssinjs.StyleProvider);
  return app;
};

export default {
  install,
};
