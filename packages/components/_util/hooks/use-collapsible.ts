import { computed, ref, toValue, watch, type CSSProperties, type MaybeRefOrGetter, type Ref } from 'vue';
import type { CSSMotionProps } from '../transition';
import initCollapseMotion from '../motion';

export type CollapsibleOptions = {
  /**
   * @desc 初始化展开的节点
   * @descEN default expanded keys
   */
  defaultExpandedKeys?: string[];

  /**
   * @desc 当前展开的节点
   * @descEN current expanded keys
   */
  expandedKeys?: string[];

  /**
   * @desc 展开节点变化回调
   * @descEN callback when expanded keys change
   */
  onExpand?: (expandedKeys: string[]) => void;
};

export type Collapsible = boolean | CollapsibleOptions;

type RequiredCollapsibleOptions = Required<CollapsibleOptions>;

const useCollapsible = (
  collapsible?: MaybeRefOrGetter<CollapsibleOptions>,
  prefixCls?: string,
  rootPrefixCls?: string,
): [
  Ref<boolean>,
  Ref<RequiredCollapsibleOptions['expandedKeys']>,
  ((curKey: string) => void) | undefined,
  CSSMotionProps,
] => {
  const collapsibleState = computed(() => {
    const _collapsible = toValue(collapsible);
    const baseConfig: RequiredCollapsibleOptions = {
      expandedKeys: [],
      defaultExpandedKeys: [],
      onExpand: () => {},
    };

    if (!_collapsible) {
      return {
        enableCollapse: false,
        defaultExpandedKeys: baseConfig.defaultExpandedKeys,
        customizeExpandedKeys: baseConfig.expandedKeys,
        customizeOnExpand: baseConfig.onExpand,
      };
    }

    if (typeof _collapsible === 'object') {
      Object.assign(baseConfig, _collapsible);
    }

    return {
      enableCollapse: true,
      defaultExpandedKeys: baseConfig.defaultExpandedKeys,
      customizeExpandedKeys: baseConfig.expandedKeys,
      customizeOnExpand: baseConfig.onExpand,
    };
  });

  const isUnControlled = computed(() => {
    const _collapsible = toValue(collapsible);
    return typeof _collapsible !== 'object' || _collapsible?.expandedKeys === undefined;
  });

  const mergedExpandedKeys = ref<string[]>(
    collapsibleState.value.defaultExpandedKeys || [],
  );

  watch(
    () => collapsibleState.value.customizeExpandedKeys,
    (newKeys) => {
      if (!isUnControlled.value && newKeys) {
        mergedExpandedKeys.value = newKeys;
      }
    },
  );

  const onItemExpand = (curKey: string) => {
    const targetKeys = isUnControlled.value
      ? mergedExpandedKeys.value
      : collapsibleState.value.customizeExpandedKeys;

    const keys = targetKeys.includes(curKey)
      ? targetKeys.filter((key) => key !== curKey)
      : [...targetKeys, curKey];

    collapsibleState.value.customizeOnExpand?.(keys);

    if (isUnControlled.value) {
      mergedExpandedKeys.value = keys;
    }
  };

  const motionStyle = ref<CSSProperties>({});
  const motionClassName = ref('');
  const collapseMotion: CSSMotionProps = collapsibleState.value.enableCollapse
    ? {
        ...initCollapseMotion(rootPrefixCls),
        onBeforeEnter: (node: Element) => {
          motionClassName.value = `${rootPrefixCls}-motion-collapse`;
          motionStyle.value = { height: 0, opacity: 0 };
        },
        onEnter: (node: Element) => {
          setTimeout(() => {
            motionStyle.value = {
              height: `${node.scrollHeight}px`,
              opacity: 1,
            };
          });
        },
        onAfterEnter: () => {
          motionClassName.value = '';
          motionStyle.value = {};
        },
        onBeforeLeave: (node: Element) => {
          motionClassName.value = `${rootPrefixCls}-motion-collapse`;
          motionStyle.value = { height: `${(node as HTMLElement).offsetHeight}px` };
        },
        onLeave: (node: Element) => {
          setTimeout(() => {
            motionStyle.value = { height: 0, opacity: 0 };
          });
        },
        onAfterLeave: () => {
          motionClassName.value = '';
          motionStyle.value = {};
        },
      }
    : {};

  return [
    computed(() => collapsibleState.value.enableCollapse),
    mergedExpandedKeys,
    collapsibleState.value.enableCollapse ? onItemExpand : undefined,
    collapseMotion,
  ];
};

export default useCollapsible;
