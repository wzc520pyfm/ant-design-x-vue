import { computed, type MaybeRefOrGetter, toValue } from 'vue';
import type { CollapsibleOptions } from '../../_util/hooks/use-collapsible';
import type {
  Collapsible,
  ConversationItemType,
  ConversationsProps,
  GroupableProps,
  GroupLabel,
  ItemType,
} from '../interface';

interface GroupConfig {
  label: GroupableProps['label'];
  collapsibleHandle: Collapsible;
  collapsibleOptions: CollapsibleOptions;
}

export interface GroupInfoType {
  data: ItemType[];
  name: string;
  label: GroupLabel;
  enableGroup: boolean;
  collapsible: boolean;
}

type GroupList = GroupInfoType[];
type KeyList = { key: string; disabled?: boolean }[];

const useGroupable = (
  groupable?: MaybeRefOrGetter<ConversationsProps['groupable']>,
  items: MaybeRefOrGetter<ItemType[]> = [],
) => {
  const groupConfig = computed<
    [GroupConfig['label'], GroupConfig['collapsibleHandle'], CollapsibleOptions]
  >(() => {
    const _groupable = toValue(groupable);
    const baseConfig: GroupConfig = {
      label: '',
      collapsibleHandle: false,
      collapsibleOptions: {},
    };

    if (!_groupable) {
      return ['', baseConfig.collapsibleHandle, baseConfig.collapsibleOptions];
    }

    if (typeof _groupable === 'object') {
      const { collapsible, defaultExpandedKeys, expandedKeys, onExpand, ...other } =
        _groupable as GroupableProps;
      Object.assign(baseConfig, {
        ...other,
        collapsibleHandle: collapsible!,
        collapsibleOptions: {
          defaultExpandedKeys,
          expandedKeys,
          onExpand,
        },
      });
    }

    return [baseConfig.label, baseConfig.collapsibleHandle, baseConfig.collapsibleOptions];
  });

  const result = computed<[GroupList, CollapsibleOptions, KeyList]>(() => {
    const _groupable = toValue(groupable);
    const _items = toValue(items) || [];
    const [label, collapsibleHandle, collapsibleOptions] = groupConfig.value;

    const groupList = _items.reduce<GroupList>((currentGroupList, item) => {
      if (item?.type === 'divider' || !(item as ConversationItemType).group || !_groupable) {
        currentGroupList.push({
          data: [item],
          name: '',
          label: '',
          enableGroup: false,
          collapsible: false,
        });
        return currentGroupList;
      }

      const baseItem = item as Required<ConversationItemType>;
      const isSome = currentGroupList.some((group, index) => {
        if (group.name === baseItem?.group) {
          currentGroupList[index].data.push(baseItem);
          return true;
        }
        return false;
      });

      const collapsible =
        typeof collapsibleHandle === 'function'
          ? collapsibleHandle(baseItem?.group)
          : collapsibleHandle;

      if (!isSome) {
        currentGroupList.push({
          data: [baseItem],
          enableGroup: true,
          name: baseItem?.group,
          label,
          collapsible: !!collapsible,
        });
      }
      return currentGroupList;
    }, []);

    const keyList = groupList.reduce<KeyList>((currentKeyList, group) => {
      group.data.forEach((item) => {
        if (item.type !== 'divider') {
          currentKeyList.push({
            key: (item as ConversationItemType).key,
            disabled: (item as ConversationItemType).disabled,
          });
        }
      });
      return currentKeyList;
    }, []);

    return [groupList, collapsibleOptions, keyList];
  });

  return result;
};

export default useGroupable;
