import type { App } from 'vue';
import SenderComponent from './Sender.vue';
import SenderHeader from './SenderHeader.vue';
import SenderSwitch from './SenderSwitch.vue';

export type {
  SenderProps,
  SenderRef,
  ActionsComponents,
  SenderComponents,
  SlotConfigType,
  SubmitType,
  SenderSwitchProps,
} from './interface';

export { SenderContextProvider } from './context';

type SenderType = typeof SenderComponent & {
  Header: typeof SenderHeader;
  Switch: typeof SenderSwitch;
};

const Sender = SenderComponent as SenderType;
Sender.Header = SenderHeader;
Sender.Switch = SenderSwitch;

// @ts-ignore
Sender.install = function (app: App) {
  app.component(Sender.name!, Sender);
  app.component(SenderHeader.name!, SenderHeader);
  app.component(SenderSwitch.name!, SenderSwitch);
  return app;
};

export default Sender;

export { Sender, SenderHeader, SenderSwitch };
