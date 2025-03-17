import { useXProviderContextInject } from '../../x-provider/context';

import type { XComponentStyleConfig, XComponentsConfig } from '../../x-provider/context';
import { computed, Ref, unref } from 'vue';

const defaultXComponentStyleConfig: XComponentStyleConfig = {
  classNames: {},
  styles: {},
  className: '',
  style: {},
};

const useXComponentConfig = <C extends keyof XComponentsConfig>(
  component: C,
): Ref<Required<XComponentsConfig>[C] & XComponentStyleConfig> => {
  const xProviderContext = useXProviderContextInject();

  return computed(() => ({
    ...defaultXComponentStyleConfig,
    ...unref(xProviderContext)[component],
  }));
};

export default useXComponentConfig;
