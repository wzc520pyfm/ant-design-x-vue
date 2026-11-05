import type { App } from 'vue';

import cssinjs from './_util/cssinjs';
import * as components from './components';

export * from './components';
export * from './hooks';
export * from './sdk';

export * from './_util/cssinjs';
export * from './theme';

export const install = function (app: App) {
  Object.keys(components).forEach((key) => {
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
