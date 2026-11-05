import {
  computed,
  onBeforeUnmount,
  ref,
  toValue,
  watch,
  type ComputedRef,
  type MaybeRefOrGetter,
  type Ref,
} from 'vue';
import type { XComponentsConfig } from '../../x-provider/context';
import type { CodeKeyType, PrefixKeysType, ShortcutKeys } from '../type';
import warning from '../warning';
import useXComponentConfig from './use-x-component-config';

/**
 * Key codes aligned with `rc-util/lib/KeyCode`, which `@ant-design/x` uses
 * for Conversations shortcut keys.
 */
export const KeyCode = {
  BACKSPACE: 8,
  TAB: 9,
  ENTER: 13,
  SHIFT: 16,
  CTRL: 17,
  ALT: 18,
  ESC: 27,
  SPACE: 32,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  DELETE: 46,
  ZERO: 48,
  ONE: 49,
  TWO: 50,
  THREE: 51,
  FOUR: 52,
  FIVE: 53,
  SIX: 54,
  SEVEN: 55,
  EIGHT: 56,
  NINE: 57,
  A: 65,
  B: 66,
  C: 67,
  D: 68,
  E: 69,
  F: 70,
  G: 71,
  H: 72,
  I: 73,
  J: 74,
  K: 75,
  L: 76,
  M: 77,
  N: 78,
  O: 79,
  P: 80,
  Q: 81,
  R: 82,
  S: 83,
  T: 84,
  U: 85,
  V: 86,
  W: 87,
  X: 88,
  Y: 89,
  Z: 90,
  META: 91,
} as const;

export type ShortcutKeyActionType = {
  actionShortcutKey: ShortcutKeys<number>;
  actionKeyCode: number;
  name: string;
  timeStamp: number;
  actionKeyCodeNumber: number | false;
  index?: number;
};

export type ShortcutKeyInfoType = {
  shortcutKeys: ShortcutKeys | ShortcutKeys[];
  shortcutKeysIcon: string[] | string[][];
};

type ShortcutKeysInfo = Record<string, ShortcutKeyInfoType>;

type FlattenShortcutKeysType = {
  name: string;
  shortcutKey: ShortcutKeys<number>;
  index?: number;
}[];

type Observer = (shortcutKeyAction: ShortcutKeyActionType) => void;
type Subscribe = (fn: Observer) => void;

const PrefixKeys: PrefixKeysType = {
  Alt: ['altKey', '⌥', 'Alt'],
  Ctrl: ['ctrlKey', '⌃', 'Ctrl'],
  Meta: ['metaKey', '⌘', 'Win'],
  Shift: ['shiftKey', '⇧', 'Shift'],
};

const NumberKeyCode: number[] = Array.from(
  { length: 9 },
  (_, i) => KeyCode.ONE + i,
);

const isAppleDevice = /(mac|iphone|ipod|ipad)/i.test(
  typeof navigator !== 'undefined' ? navigator?.platform : '',
);

const getShortcutKeysIcon = (key: CodeKeyType): string => {
  if (key === 'number') {
    return key;
  }
  if (typeof key === 'string' && PrefixKeys?.[key]?.[isAppleDevice ? 1 : 2]) {
    return PrefixKeys[key][isAppleDevice ? 1 : 2];
  }
  return Object.entries(KeyCode).find(([, value]) => value === key)?.[0] || '';
};

const getShortcutAction = (
  shortcutKey: ShortcutKeys<number>,
  event: KeyboardEvent,
): false | Omit<ShortcutKeyActionType, 'name' | 'index'> => {
  const copyShortcutKey = [...shortcutKey];
  const keyCode = copyShortcutKey.pop();
  const signKeys = copyShortcutKey as (keyof PrefixKeysType)[];

  const hitKey = signKeys.reduce((value, signKey) => {
    if (!value) return value;
    const eventKey = PrefixKeys?.[signKey]?.[0];
    return eventKey ? Boolean(event[eventKey]) : false;
  }, keyCode === event.keyCode);

  if (hitKey) {
    return {
      actionShortcutKey: shortcutKey,
      actionKeyCodeNumber:
        NumberKeyCode.indexOf(event.keyCode) > -1
          ? NumberKeyCode.indexOf(event.keyCode)
          : false,
      actionKeyCode: event.keyCode,
      timeStamp: event.timeStamp,
    };
  }
  return false;
};

const getDecomposedShortcutKeys = (
  shortcutKeys: ShortcutKeys,
): { prefixKeys: (keyof PrefixKeysType)[]; keyCodeDict: number[] } => {
  const copyShortcutKey = [...shortcutKeys];
  const keyCode = copyShortcutKey.pop() as number | 'number';
  const prefixKeys = copyShortcutKey as (keyof PrefixKeysType)[];
  const keyCodeDict = keyCode === 'number' ? NumberKeyCode : [keyCode];
  return {
    keyCodeDict,
    prefixKeys,
  };
};

const warnSameShortcut = (
  flattenShortcutKeys: FlattenShortcutKeysType,
  shortcutKey: ShortcutKeys<number>,
  component: keyof XComponentsConfig,
) => {
  const sameShortcutKeys = !!flattenShortcutKeys.find(
    ({ shortcutKey: oriShortcutKey }) =>
      oriShortcutKey.toString() === shortcutKey.toString(),
  );

  warning(
    !sameShortcutKeys,
    String(component),
    `Same shortcutKey ${shortcutKey.toString()}`,
  );
};

const getFlattenShortcutKeys = (
  component: keyof XComponentsConfig,
  contextShortcutKeys: Record<string, ShortcutKeys | ShortcutKeys[]>,
  componentShortcutKeys?: Record<string, ShortcutKeys | ShortcutKeys[]>,
): {
  flattenShortcutKeys: FlattenShortcutKeysType;
  shortcutKeysInfo: ShortcutKeysInfo;
} => {
  const mergeShortcutKeys = Object.assign(
    {},
    contextShortcutKeys || {},
    componentShortcutKeys,
  );
  return Object.keys(mergeShortcutKeys).reduce(
    ({ flattenShortcutKeys, shortcutKeysInfo }, subName) => {
      const subShortcutKeys = mergeShortcutKeys[subName];
      if (!Array.isArray(subShortcutKeys)) {
        return { flattenShortcutKeys, shortcutKeysInfo };
      }
      shortcutKeysInfo = {
        ...shortcutKeysInfo,
        [subName]: {
          shortcutKeys: subShortcutKeys as ShortcutKeys | ShortcutKeys[],
          shortcutKeysIcon: [],
        },
      };

      if (subShortcutKeys.every((item) => Array.isArray(item))) {
        subShortcutKeys.forEach((shortcutKey, index) => {
          const shortcutKeyArr = shortcutKey as ShortcutKeys<number>;
          warnSameShortcut(flattenShortcutKeys, shortcutKeyArr, component);
          flattenShortcutKeys.push({
            name: subName,
            shortcutKey: shortcutKeyArr,
            index,
          });
          (shortcutKeysInfo[subName].shortcutKeysIcon as string[][]).push(
            shortcutKeyArr?.map((key) => getShortcutKeysIcon(key)),
          );
        });
      } else {
        const { keyCodeDict, prefixKeys } = getDecomposedShortcutKeys(
          subShortcutKeys as ShortcutKeys,
        );
        keyCodeDict.forEach((keyCode) => {
          const flattened = [...prefixKeys, keyCode] as ShortcutKeys<number>;
          warnSameShortcut(flattenShortcutKeys, flattened, component);
          flattenShortcutKeys.push({
            name: subName,
            shortcutKey: flattened,
          });
        });
        shortcutKeysInfo[subName].shortcutKeysIcon = (
          subShortcutKeys as CodeKeyType[]
        ).map((key) => getShortcutKeysIcon(key));
      }
      return { flattenShortcutKeys, shortcutKeysInfo };
    },
    {
      flattenShortcutKeys: [] as FlattenShortcutKeysType,
      shortcutKeysInfo: {} as ShortcutKeysInfo,
    },
  );
};

const useShortcutKeys = (
  component: keyof XComponentsConfig,
  shortcutKeys?: MaybeRefOrGetter<
    Record<string, ShortcutKeys | ShortcutKeys[]> | undefined
  >,
): [
  Ref<ShortcutKeyActionType | null>,
  ComputedRef<ShortcutKeysInfo>,
  Subscribe,
] => {
  const contextConfig = useXComponentConfig(component);
  const shortcutAction = ref<ShortcutKeyActionType | null>(null);
  const observer = ref<Observer>();
  const keyLock = ref(false);

  const parsed = computed(() => {
    const contextShortcutKeys =
      (
        contextConfig.value as {
          shortcutKeys?: Record<string, ShortcutKeys | ShortcutKeys[]>;
        }
      ).shortcutKeys || {};
    return getFlattenShortcutKeys(
      component,
      contextShortcutKeys,
      toValue(shortcutKeys),
    );
  });

  const onKeydown = (event: KeyboardEvent) => {
    for (const shortcutKeyInfo of parsed.value.flattenShortcutKeys) {
      const activeKeyInfo = getShortcutAction(
        shortcutKeyInfo.shortcutKey,
        event,
      );
      if (!activeKeyInfo) continue;
      if (keyLock.value) return;
      keyLock.value = true;
      const info: ShortcutKeyActionType = {
        ...activeKeyInfo,
        name: shortcutKeyInfo.name,
        index: shortcutKeyInfo.index,
      };
      shortcutAction.value = info;
      observer.value?.(info);
      return;
    }
  };

  const onKeyup = () => {
    keyLock.value = false;
  };

  const stop = watch(
    () => parsed.value.flattenShortcutKeys.length,
    (length, _, onCleanup) => {
      if (length === 0 || typeof document === 'undefined') return;
      document.addEventListener('keydown', onKeydown);
      document.addEventListener('keyup', onKeyup);
      onCleanup(() => {
        document.removeEventListener('keydown', onKeydown);
        document.removeEventListener('keyup', onKeyup);
      });
    },
    { immediate: true },
  );

  onBeforeUnmount(() => {
    stop();
    if (typeof document === 'undefined') return;
    document.removeEventListener('keydown', onKeydown);
    document.removeEventListener('keyup', onKeyup);
  });

  const subscribe: Subscribe = (fn) => {
    observer.value = fn;
  };

  return [
    shortcutAction,
    computed(() => parsed.value.shortcutKeysInfo),
    subscribe,
  ];
};

export default useShortcutKeys;
