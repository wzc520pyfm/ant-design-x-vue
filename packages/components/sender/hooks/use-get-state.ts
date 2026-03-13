import { ref, watch, type Ref } from 'vue';
import type { SlotConfigType } from '../interface';

const buildSlotValues = (
  slotConfig: SlotConfigType[],
  slotConfigMap: Map<string, SlotConfigType>,
) => {
  if (Array.isArray(slotConfig)) {
    return slotConfig?.reduce(
      (acc, node) => {
        if (node.key) {
          if (node.type === 'input' || node.type === 'select' || node.type === 'custom') {
            acc[node.key] = node.props?.defaultValue || '';
          } else {
            acc[node.key] = '';
          }
          slotConfigMap.set(node.key, node);
        }

        return acc;
      },
      {} as Record<string, any>,
    );
  }
  return {};
};

function useGetState(
  slotConfig: Ref<SlotConfigType[]>,
): [
  Map<string, SlotConfigType>,
  () => Record<string, any>,
  (newValue: Record<string, any> | ((prev: Record<string, any>) => Record<string, any>)) => void,
] {
  const state = ref<Record<string, any>>({});
  const slotConfigMap = new Map<string, SlotConfigType>();

  watch(slotConfig, (val) => {
    const slotValue = buildSlotValues(val, slotConfigMap);
    state.value = slotValue;
  }, { immediate: true });

  const setState = (newValue: Record<string, any> | ((prev: Record<string, any>) => Record<string, any>)) => {
    const value = typeof newValue === 'function' ? newValue(state.value) : newValue;
    state.value = value;
  };

  const getState = () => {
    return state.value;
  };

  return [slotConfigMap, getState, setState];
}

export default useGetState;
