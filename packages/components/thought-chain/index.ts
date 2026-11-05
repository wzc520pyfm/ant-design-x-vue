import type { App } from 'vue';
import ThoughtChainComponent from './ThoughtChain.vue';
import ThoughtChainItemComponent from './ThoughtChainItem.vue';

export type { ThoughtChainProps, ThoughtChainItemType, ThoughtChainItemProps } from './interface';

type ThoughtChainType = typeof ThoughtChainComponent & {
  Item: typeof ThoughtChainItemComponent;
};

const ThoughtChain = ThoughtChainComponent as ThoughtChainType;
ThoughtChain.Item = ThoughtChainItemComponent;

ThoughtChain.install = function (app: App) {
  app.component(ThoughtChain.name!, ThoughtChain);
  app.component(ThoughtChainItemComponent.name!, ThoughtChainItemComponent);
  return app;
};

export default ThoughtChain;

export { ThoughtChain, ThoughtChainItemComponent as ThoughtChainItem };
