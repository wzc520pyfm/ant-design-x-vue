import useState from '../../_util/hooks/use-state';
import { computed, type Ref, watch } from 'vue';

export interface CollapsibleOptions {
  defaultExpandedKeys?: string[];
  expandedKeys?: string[];
  onExpand?: (expandedKeys: string[]) => void;
}

type UseCollapsible = (
  options: CollapsibleOptions,
) => [
  Ref<string[]>,
  (curKey: string) => void,
];

const useCollapsible: UseCollapsible = (options) => {
  const { defaultExpandedKeys = [], expandedKeys: customExpandedKeys, onExpand } = options;

  const isControlled = computed(() => customExpandedKeys !== undefined);

  const [mergedExpandedKeys, setMergedExpandedKeys] =
    useState<string[]>(defaultExpandedKeys);

  watch(
    () => customExpandedKeys,
    (val) => {
      if (val !== undefined) {
        setMergedExpandedKeys(val);
      }
    },
    { deep: true },
  );

  const onItemExpand = (curKey: string) => {
    const currentKeys = mergedExpandedKeys.value;
    const keys = currentKeys.includes(curKey)
      ? currentKeys.filter((key) => key !== curKey)
      : [...currentKeys, curKey];

    onExpand?.(keys);

    if (!isControlled.value) {
      setMergedExpandedKeys(keys);
    }
  };

  return [mergedExpandedKeys, onItemExpand];
};

export default useCollapsible;
