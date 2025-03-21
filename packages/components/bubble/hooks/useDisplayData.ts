import { computed, Ref, unref, watch } from 'vue';
import { useEventCallback } from '../../_util/hooks/use-event-callback';
import useState from '../../_util/hooks/use-state';
import { ListItemType } from './useListData';

type UseDisplayDataReturn = [Ref<ListItemType[]>, (value: string | number) => void];

export default function useDisplayData(items: Ref<ListItemType[]>): UseDisplayDataReturn {
  const [displayCount, setDisplayCount] = useState(items.value.length);

  const displayList = computed(() => items.value.slice(0, unref(displayCount)));

  const displayListLastKey = computed(() => {
    const lastItem = unref(displayList)[unref(displayList).length - 1];
    return lastItem ? lastItem.key : null;
  });

  // When `items` changed, we replaced with latest one
  watch(
    items,
    () => {
      if (unref(displayList).length && unref(displayList).every((item, index) => item.key === items.value[index]?.key)) {
        return;
      }

      if (unref(displayList).length === 0) {
        setDisplayCount(1);
      } else {
        // Find diff index
        for (let i = 0; i < unref(displayList).length; i += 1) {
          if (unref(displayList)[i].key !== items.value[i]?.key) {
            setDisplayCount(i);
            break;
          }
        }
      }
    },
    { immediate: true, deep: true },
  );

  // Continue to show if last one finished typing
  const onTypingComplete = useEventCallback((key: string | number) => {
    if (key === unref(displayListLastKey)) {
      setDisplayCount(unref(displayCount) + 1);
    }
  });

  return [displayList, onTypingComplete] as const;
}
