import { computed, MaybeRefOrGetter, toValue } from 'vue';
import type { Conversation, Groupable, ConversationsProps } from '../interface';

/**
 * 🔥 Only for handling ungrouped data. Do not use it for any other purpose! 🔥
 */
const __UNGROUPED = '__ungrouped';

type GroupList = {
  data: Conversation[];
  name?: string;
  title?: Groupable['title'];
}[];

type GroupMap = Record<string, Conversation[]>;

const useGroupable = (
  groupable?: MaybeRefOrGetter<ConversationsProps['groupable']>,
  items: MaybeRefOrGetter<Conversation[]> = [],
) => {
  const state = computed(() => {
    if (!toValue(groupable)) {
      return {
        enableGroup: false,
        sort: undefined,
        title: undefined,
      }
    }
    let baseConfig: Groupable = {
      sort: undefined,
      title: undefined,
    };

    if (typeof toValue(groupable) === 'object') {
      baseConfig = { ...baseConfig, ...toValue(groupable as object) };
    }
    return {
      enableGroup: true,
      sort: baseConfig.sort,
      title: baseConfig.title,
    }
  });

  return computed(() => {
    // 未开启分组模式直接返回
    if (!state.value.enableGroup) {
      const groupList: GroupList = [
        {
          name: __UNGROUPED,
          data: toValue(items),
          title: undefined as Groupable['title'],
        },
      ];

      return {
        groupList,
        enableGroup: state.value.enableGroup
      }
    }

    // 1. 将 data 做数据分组，填充 groupMap
    const groupMap = toValue(items).reduce<GroupMap>((acc, item) => {
      const group = item.group || __UNGROUPED;

      if (!acc[group]) {
        acc[group] = [];
      }

      acc[group].push(item);

      return acc;
    }, {});

    // 2. 存在 sort 时对 groupKeys 排序
    const groupKeys = state.value.sort ? Object.keys(groupMap).sort(state.value.sort) : Object.keys(groupMap);

    // 3. groupMap 转 groupList
    const groupList = groupKeys.map((group) => ({
      name: group === __UNGROUPED ? undefined : group,
      title: state.value.title,
      data: groupMap[group],
    }));

    return {
      groupList,
      enableGroup: state.value.enableGroup
    }
  });
};

export default useGroupable;
