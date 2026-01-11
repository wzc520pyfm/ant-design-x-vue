import { computed, ComputedRef, defineComponent, inject, InjectionKey, provide, shallowRef, triggerRef, unref, watch } from 'vue';
import rcWarning, { resetWarned as rcResetWarned } from '../vc-util/warning';
import { objectType } from './type';

/* istanbul ignore next */
export function noop() {}

let deprecatedWarnList: Record<string, string[]> | null = null;

export function resetWarned() {
  deprecatedWarnList = null;
  rcResetWarned();
}

type Warning = (valid: boolean, component: string, message?: string) => void;

let warning: Warning = noop;
if (process.env.NODE_ENV !== 'production') {
  warning = (valid, component, message) => {
    rcWarning(valid, `[antd: ${component}] ${message}`);

    // StrictMode will inject console which will not throw warning in React 17.
    if (process.env.NODE_ENV === 'test') {
      resetWarned();
    }
  };
}

type BaseTypeWarning = (
  valid: boolean,
  /**
   * - deprecated: Some API will be removed in future but still support now.
   * - usage: Some API usage is not correct.
   * - breaking: Breaking change like API is removed.
   */
  type: 'deprecated' | 'usage' | 'breaking',
  message?: string,
) => void;

type TypeWarning = BaseTypeWarning & {
  deprecated: (valid: boolean, oldProp: string, newProp: string, message?: string) => void;
};

export interface WarningContextProps {
  /**
   * @descCN 设置警告等级，设置 `false` 时会将废弃相关信息聚合为单条信息。
   * @descEN Set the warning level. When set to `false`, discard related information will be aggregated into a single message.
   */
  strict?: boolean;
}

const WarningContextKey: InjectionKey<ComputedRef<WarningContextProps>> =
  Symbol('WarningContext');

export const globalWarningContextApi = shallowRef<WarningContextProps>();

export const useWarningContextProvider = (value: ComputedRef<WarningContextProps>) => {
  provide(WarningContextKey, value);
  watch(
    value,
    () => {
      globalWarningContextApi.value = unref(value);
      triggerRef(globalWarningContextApi);
    },
    { immediate: true, deep: true },
  );
};

export const useWarningContextInject = () => {
  return inject(
    WarningContextKey,
    computed(() => globalWarningContextApi.value || {}),
  );
};
export const WarningContextProvider = defineComponent({
  props: {
    value: objectType<WarningContextProps>(),
  },
  setup(props, { slots }) {
    useWarningContextProvider(computed(() => props.value));
    return () => {
      return slots.default?.();
    };
  },
});
/**
 * This is a hook but we not named as `useWarning`
 * since this is only used in development.
 * We should always wrap this in `if (process.env.NODE_ENV !== 'production')` condition
 */
export const devUseWarning: (component: string) => TypeWarning =
  process.env.NODE_ENV !== 'production'
    ? (component) => {
        const { strict } = unref(useWarningContextInject());

        const typeWarning: TypeWarning = (valid, type, message) => {
          if (!valid) {
            if (strict === false && type === 'deprecated') {
              const existWarning = deprecatedWarnList;

              if (!deprecatedWarnList) {
                deprecatedWarnList = {};
              }

              deprecatedWarnList[component] = deprecatedWarnList[component] || [];

              if (!deprecatedWarnList[component].includes(message || '')) {
                deprecatedWarnList[component].push(message || '');
              }

              // Warning for the first time
              if (!existWarning) {
                // eslint-disable-next-line no-console
                console.warn(
                  '[antd] There exists deprecated usage in your code:',
                  deprecatedWarnList,
                );
              }
            } else {
              warning(valid, component, message);
            }
          }
        };

        typeWarning.deprecated = (valid, oldProp, newProp, message) => {
          typeWarning(
            valid,
            'deprecated',
            `\`${oldProp}\` is deprecated. Please use \`${newProp}\` instead.${
              message ? ` ${message}` : ''
            }`,
          );
        };

        return typeWarning;
      }
    : () => {
        const noopWarning: TypeWarning = () => {};

        noopWarning.deprecated = noop;

        return noopWarning;
      };

export default warning;
