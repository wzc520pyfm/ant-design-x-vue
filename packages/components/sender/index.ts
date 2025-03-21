import SenderComponent from './Sender.vue';
import SenderHeader from './SenderHeader.vue';

export type { SenderProps } from './interface';

const Sender = Object.assign(SenderComponent, {
  Header: SenderHeader,
});

export default Sender;

export {
  Sender,
}
