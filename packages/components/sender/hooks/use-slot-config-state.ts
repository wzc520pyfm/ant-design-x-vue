import { watch, type Ref } from 'vue';
import type { SlotConfigType } from '../interface';

interface NodeInfo {
  slotKey?: string;
  nodeType?: 'nbsp';
  skillKey?: string;
  slotConfig?: SlotConfigType;
  placeholder?: string;
  targetNode: HTMLElement;
}

type SlotValues = Record<string, any>;

const SUPPORTED_INPUT_TYPES = new Set(['input', 'select', 'custom', 'content']);

const buildSlotValues = (slotConfig: readonly SlotConfigType[]): SlotValues =>
  slotConfig?.reduce<SlotValues>((acc, node) => {
    const { key, type } = node;
    if (!key) return acc;

    const props = (node as any).props || {};
    const defaultValue = SUPPORTED_INPUT_TYPES.has(type)
      ? props.defaultValue
      : (props.value ?? props.label);

    acc[key] = defaultValue ?? '';
    return acc;
  }, {}) ?? {};

const buildSlotConfigMap = (
  slotConfig: readonly SlotConfigType[],
  slotConfigMap: Map<string, SlotConfigType>,
) => {
  slotConfig?.forEach((node) => {
    if (node.key) slotConfigMap.set(node.key, node);
  });
};

const getNodeInfoBySlotConfigMap = (
  targetNode: HTMLElement,
  slotConfigMap: Map<string, SlotConfigType>,
): NodeInfo | null => {
  if (!targetNode?.dataset) return null;
  const { dataset } = targetNode;
  return {
    slotKey: dataset.slotKey,
    placeholder: dataset.placeholder,
    nodeType: dataset.nodeType as 'nbsp' | undefined,
    skillKey: dataset.skillKey,
    slotConfig: dataset.slotKey ? slotConfigMap.get(dataset.slotKey) : undefined,
    targetNode,
  };
};

export type SlotConfigStateApi = {
  getSlotValues: () => SlotValues;
  setSlotValues: (newValue: SlotValues | ((prev: SlotValues) => SlotValues)) => void;
  mergeSlotConfig: (newSlotConfig: SlotConfigType[]) => void;
  getNodeInfo: (targetNode: HTMLElement) => NodeInfo | null;
  getNodeTextValue: (node: Node) => string;
  clear: () => void;
};

/**
 * Track Sender slotConfig so runtime inserts (ref.insert) survive a parent
 * re-render that only changes the prop reference (React @ant-design/x #1900).
 */
function useSlotConfigState(
  slotConfig: Ref<readonly SlotConfigType[] | undefined>,
): [Map<string, SlotConfigType>, SlotConfigStateApi] {
  let state: SlotValues = {};
  const slotConfigMap = new Map<string, SlotConfigType>();
  // Grows until clear(); residual cost is one string per ever-inserted key.
  const runtimeKeys = new Set<string>();

  const applyPropSlotConfig = (next?: readonly SlotConfigType[]) => {
    if (!next) return;

    slotConfigMap.forEach((_, key) => {
      if (!runtimeKeys.has(key)) slotConfigMap.delete(key);
    });

    buildSlotConfigMap(next, slotConfigMap);

    const newValues = buildSlotValues(next);
    runtimeKeys.forEach((key) => {
      if (key in state) newValues[key] = state[key];
    });
    state = newValues;
  };

  watch(
    slotConfig,
    (val) => {
      applyPropSlotConfig(val);
    },
    { immediate: true },
  );

  const setSlotValues: SlotConfigStateApi['setSlotValues'] = (newValue) => {
    state = typeof newValue === 'function' ? newValue(state) : newValue;
  };

  const mergeSlotConfig: SlotConfigStateApi['mergeSlotConfig'] = (newSlotConfig) => {
    const newValues = buildSlotValues(newSlotConfig);

    newSlotConfig.forEach((node) => {
      if (node.key) {
        slotConfigMap.set(node.key, node);
        runtimeKeys.add(node.key);
      }
    });

    state = { ...state, ...newValues };
  };

  const clear = () => {
    slotConfigMap.clear();
    runtimeKeys.clear();
    state = {};
  };

  const getNodeInfo = (targetNode: HTMLElement) =>
    getNodeInfoBySlotConfigMap(targetNode, slotConfigMap);

  const getNodeTextValue = (node: Node): string => {
    const nodeType = node.nodeType;

    if (nodeType === Node.TEXT_NODE) {
      return node.textContent || '';
    }

    if (nodeType !== Node.ELEMENT_NODE) {
      return '';
    }

    const element = node as HTMLElement;
    const nodeInfo = getNodeInfo(element);

    if (!nodeInfo) {
      return element.innerText || element.textContent || '';
    }

    const { slotKey, skillKey, nodeType: infoNodeType, slotConfig: nodeSlotConfig } = nodeInfo;
    if (skillKey) {
      return '';
    }

    const textContent = element.innerText || element.textContent || '';

    if (slotKey) {
      if (infoNodeType === 'nbsp') {
        return ' ';
      }
      if (!nodeSlotConfig) {
        return textContent;
      }
      const slotValue =
        nodeSlotConfig.type === 'content' ? textContent : (state[slotKey] ?? '');
      return nodeSlotConfig.formatResult?.(slotValue) ?? slotValue;
    }

    return textContent;
  };

  return [
    slotConfigMap,
    {
      getSlotValues: () => state,
      setSlotValues,
      mergeSlotConfig,
      getNodeInfo,
      getNodeTextValue,
      clear,
    },
  ];
}

export default useSlotConfigState;
