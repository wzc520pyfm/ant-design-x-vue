import { useXProviderContextInject } from '../../x-provider/context';

import { computed, Ref, unref } from 'vue';
import type {
  XComponentConfig,
  XComponentsConfig,
} from '../../x-provider/context';

const defaultXComponentStyleConfig: XComponentConfig = {
  classNames: {},
  styles: {},
  className: '',
  style: {},
  shortcutKeys: {},
};

const useXComponentConfig = <C extends keyof XComponentsConfig>(
  component: C,
): Ref<Required<XComponentsConfig>[C] & XComponentConfig> => {
  const xProviderContext = useXProviderContextInject();

  return computed(() => ({
    ...defaultXComponentStyleConfig,
    ...unref(xProviderContext)[component],
  }));
};

export default useXComponentConfig;
