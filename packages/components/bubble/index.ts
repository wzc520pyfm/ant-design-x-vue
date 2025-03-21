import BubbleComponent from './Bubble.vue';
import BubbleList from './BubbleList.vue';

export type { BubbleProps, BubbleListProps } from './interface';

const Bubble = Object.assign(BubbleComponent, {
  List: BubbleList,
});

export default Bubble;

export {
  Bubble,
  BubbleList
}
