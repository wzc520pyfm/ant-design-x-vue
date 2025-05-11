import useState from "../../_util/hooks/use-state";
import { computed, toValue, watch } from "vue";
import type { MaybeRefOrGetter, Ref } from "vue";

export type CollapsibleOptions = {
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

type UseCollapsible = (
  collapsible?: MaybeRefOrGetter<Collapsible>,
  prefixCls?: string,
  rootPrefixCls?: string,
) => [
    Ref<boolean>,
    Ref<RequiredCollapsibleOptions['expandedKeys']>,
    ((curKey: string) => void) | undefined,
    // CSSMotionProps,
  ];

const useCollapsible: UseCollapsible = (collapsible, prefixCls, rootPrefixCls) => {
  // ============================ Collapsible ============================
  const collapsibleState = computed(() => {
    const _collapsible = toValue(collapsible);
    let baseConfig: RequiredCollapsibleOptions = {
      expandedKeys: [],
      onExpand: () => { },
    };
    if (!_collapsible) {
      return {
        enableCollapse: false,
        customizeExpandedKeys: baseConfig.expandedKeys,
        customizeOnExpand: baseConfig.onExpand
      }
    }
    if (typeof _collapsible === 'object') {
      baseConfig = { ...baseConfig, ..._collapsible };
    }

    return {
      enableCollapse: true,
      customizeExpandedKeys: baseConfig.expandedKeys,
      customizeOnExpand: baseConfig.onExpand
    }
  });

  // ============================ ExpandedKeys ============================
  const [mergedExpandedKeys, setMergedExpandedKeys] =
    useState<RequiredCollapsibleOptions['expandedKeys']>(collapsibleState.value.customizeExpandedKeys);

  // ============================ Event ============================
  const onItemExpand = (curKey: string) => {
    if (!collapsibleState.value.enableCollapse) {
      return;
    }
    const keys = mergedExpandedKeys.value.includes(curKey)
      ? mergedExpandedKeys.value.filter((key) => key !== curKey)
      : [...mergedExpandedKeys.value, curKey];

    collapsibleState.value.customizeOnExpand?.(keys);

    // 受控模式下，由监听函数设置节点展开/关闭状态
    if (typeof toValue(collapsible) !== 'object') {
      setMergedExpandedKeys(keys);
    }
  };

  // 监听 collapsibleState 的变化，更新节点展开状态
  watch(
    collapsibleState,
    (newValue) => {
      setMergedExpandedKeys(newValue.customizeExpandedKeys);
    },
    {
      deep: 1,
    },
  );

  // ============================ Motion ============================
  // const collapseMotion: CSSMotionProps = React.useMemo(() => {
  //   if (!enableCollapse) return {};

  //   return {
  //     ...initCollapseMotion(rootPrefixCls),
  //     motionAppear: false,
  //     leavedClassName: `${prefixCls}-content-hidden`,
  //   };
  // }, [rootPrefixCls, prefixCls, enableCollapse]);

  // ============================ Return ============================
  return [
    computed(() => collapsibleState.value.enableCollapse),
    mergedExpandedKeys,
    onItemExpand,
    // collapseMotion,
  ];
}

export default useCollapsible;
