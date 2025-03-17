import type { App } from 'vue';
import BubbleComponent from './Bubble.vue';
import BubbleList from './BubbleList.vue';

export type { BubbleProps, BubbleListProps } from './interface';

const Bubble = Object.assign(BubbleComponent, {
  List: BubbleList,
});

// @ts-ignore
Bubble.install = function(app: App) {
  app.component(Bubble.name, Bubble);
  app.component(BubbleList.name, BubbleList);
  return app;
}

export default Bubble;

export {
  Bubble,
  BubbleList
}
