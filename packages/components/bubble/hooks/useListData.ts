import { computed, type Ref } from 'vue';
import type {
  BubbleItemType,
  BubbleListProps,
  FuncRoleProps,
  RoleProps,
  RoleType,
} from '../interface';

export type UnRef<T extends Ref<any>> = T extends Ref<infer R> ? R : never;

export type ListItemType = UnRef<ReturnType<typeof useListData>>[number];

function roleCfgIsFunction(roleCfg: RoleProps | FuncRoleProps): roleCfg is FuncRoleProps {
  return typeof roleCfg === 'function' && roleCfg instanceof Function;
}

export default function useListData(
  items: Ref<BubbleListProps['items']>,
  roles?: Ref<RoleType | undefined>,
) {
  const getRoleBubbleProps = (
    bubble: BubbleItemType,
    _index: number,
  ): Partial<RoleProps> => {
    if (!roles?.value) {
      return {};
    }

    const role = bubble.role;
    if (!role) {
      return {};
    }

    const cfg = (roles.value as any)[role];
    if (!cfg) {
      return {};
    }

    return roleCfgIsFunction(cfg) ? cfg(bubble) : cfg;
  };

  const listData = computed(() =>
    (items.value || []).map((bubbleData, i) => {
      const mergedKey = bubbleData.key ?? `preset_${i}`;

      return {
        ...getRoleBubbleProps(bubbleData, i),
        ...bubbleData,
        key: mergedKey,
      };
    }),
  );

  return listData as Ref<BubbleItemType[]>;
}
