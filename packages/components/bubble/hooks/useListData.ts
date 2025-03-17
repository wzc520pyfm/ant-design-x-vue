import { computed, type Ref } from 'vue';
import type { BubbleDataType, BubbleListProps } from '../interface';
import type { BubbleProps } from '../interface';

export type UnRef<T extends Ref<any>> = T extends Ref<infer R> ? R : never;

export type ListItemType = UnRef<ReturnType<typeof useListData>>[number];

export default function useListData(
  items: Ref<BubbleListProps['items']>,
  roles?: Ref<BubbleListProps['roles']>,
) {
  const getRoleBubbleProps = (bubble: BubbleDataType, index: number): Partial<BubbleProps> => {
    if (typeof roles.value === 'function') {
      return roles.value(bubble, index);
    }

    if (roles) {
      return roles.value?.[bubble.role!] || {};
    }

    return {};
  }

  const listData = computed(() =>
    (items.value || []).map((bubbleData, i) => {
      const mergedKey = bubbleData.key ?? `preset_${i}`;

      return {
        ...getRoleBubbleProps(bubbleData, i),
        ...bubbleData,
        key: mergedKey,
      };
    }));

  return listData as Ref<any[]>;
}
