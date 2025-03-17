<script setup lang="tsx">
import classnames from 'classnames';
import { useEventCallback } from '../_util/hooks/use-event-callback';
import pickAttrs from '../_util/pick-attrs';
import { useXProviderContext } from '../x-provider';
import Bubble from './Bubble.vue';
import type { BubbleRef, RolesType } from './interface';
import useDisplayData from './hooks/useDisplayData';
import useListData from './hooks/useListData';
import type { BubbleListProps } from './interface';
import useStyle from './style';
import { computed, type HTMLAttributes, mergeProps, onWatcherCleanup, ref, unref, useAttrs, watch, watchPostEffect, nextTick, type VNode } from 'vue';
import useState from '../_util/hooks/use-state';
import type { AvoidValidation } from '../type-utility';
import BubbleContextProvider from './context';

defineOptions({ name: "AXBubbleList", inheritAttrs: false });

const attrs = useAttrs();

const TOLERANCE = 1;

const {
  prefixCls: customizePrefixCls,
  rootClassName,
  items: itemsProp,
  autoScroll = true,
  roles: rolesProp,
  ...restProps
} = defineProps<BubbleListProps>();

const slots = defineSlots<{
  avatar?(props: {
    item: BubbleListProps['items'][number];
  }): VNode;
  header?(props: {
    item: BubbleListProps['items'][number];
  }): VNode | string;
  footer?(props: {
    item: BubbleListProps['items'][number];
  }): VNode | string;
  loading?(props: {
    item: BubbleListProps['items'][number];
  }): VNode;
  message?(props: {
    item: BubbleListProps['items'][number];
  }): VNode | string;
}>();

const domProps = computed(() => pickAttrs(mergeProps(restProps, attrs), {
  attr: true,
  aria: true,
}) as HTMLAttributes);

const items = ref<BubbleListProps['items']>(itemsProp);
const roles = ref<AvoidValidation<RolesType>>(rolesProp);

watch(() => itemsProp, () => {
  items.value = itemsProp;
})

watch(() => rolesProp, () => {
  roles.value = rolesProp;
})

// ============================= Refs =============================
// const listRef = useTemplateRef<HTMLDivElement>(null);
const listRef = ref<HTMLDivElement>(null);

const bubbleRefs = ref<Record<string, BubbleRef>>({});

// ============================ Prefix ============================
const { getPrefixCls } = useXProviderContext();

const prefixCls = getPrefixCls('bubble', customizePrefixCls);
const listPrefixCls = `${prefixCls}-list`;

const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

// ============================ Typing ============================
const [initialized, setInitialized] = useState(false);

watchPostEffect(() => {
  setInitialized(true);
  onWatcherCleanup(() => {
    setInitialized(false);
  })
});

// ============================= Data =============================
// @ts-expect-error
const mergedData = useListData(items, roles);

const [displayData, onTypingComplete] = useDisplayData(mergedData);

// ============================ Scroll ============================
// Is current scrollTop at the end. User scroll will make this false.
const [scrollReachEnd, setScrollReachEnd] = useState(true);

const [updateCount, setUpdateCount] = useState(0);

const onInternalScroll = (e: Event) => {
  const target = e.target as HTMLElement;

  setScrollReachEnd(
    target.scrollHeight - Math.abs(target.scrollTop) - target.clientHeight <= TOLERANCE,
  );
};

watch([updateCount, listRef, scrollReachEnd], () => {
  if (autoScroll && unref(listRef) && unref(scrollReachEnd)) {
    nextTick(() => {
      unref(listRef).scrollTo({
        top: unref(listRef).scrollHeight,
      });
    })
  }
});

// Always scroll to bottom when data change
watch(() => unref(displayData).length, () => {
  if (autoScroll) {
    // New date come, the origin last one is the second last one
    const lastItemKey = unref(displayData)[unref(displayData).length - 2]?.key;
    const bubbleInst = unref(bubbleRefs)[lastItemKey!];

    // Auto scroll if last 2 item is visible
    if (bubbleInst) {
      const { nativeElement } = bubbleInst;
      const { top = 0, bottom = 0 } = nativeElement?.getBoundingClientRect() ?? {};
      const { top: listTop, bottom: listBottom } = unref(listRef).getBoundingClientRect();

      const isVisible = top < listBottom && bottom > listTop;
      if (isVisible) {
        setUpdateCount(unref(updateCount) + 1);
        setScrollReachEnd(true);
      }
    }
  }
});

// =========================== Context ============================
// When bubble content update, we try to trigger `autoScroll` for sync
const onBubbleUpdate = useEventCallback<void>(() => {
  if (autoScroll) {
    setUpdateCount(unref(updateCount) + 1);
  }
});

const context = computed(() => ({
  onUpdate: onBubbleUpdate,
}));

defineRender(() => {
  return wrapCSSVar(
    <BubbleContextProvider value={context.value}>
      <div
        {...domProps.value}
        class={classnames(listPrefixCls, rootClassName, hashId.value, cssVarCls, {
          [`${listPrefixCls}-reach-end`]: scrollReachEnd.value,
        })}
        ref={listRef}
        onScroll={onInternalScroll}
      >
        <Bubble
          v-for={({ key, onTypingComplete: onTypingCompleteBubble, ...bubble }) in unref(displayData)}
          {...bubble}
          avatar={slots.avatar ? () => slots.avatar?.({ item: { key, ...bubble } }) : bubble.avatar}
          header={slots.header?.({ item: { key, ...bubble } }) ?? bubble.header}
          footer={slots.footer?.({ item: { key, ...bubble } }) ?? bubble.footer}
          loadingRender={slots.loading ? () => slots.loading({ item: { key, ...bubble } }) : bubble.loadingRender}
          content={slots.message?.({ item: { key, ...bubble } }) ?? bubble.content}
          key={key}
          // 用于更新滚动的ref
          ref={(node) => {
            if (node) {
              bubbleRefs.value[key] = node;
            } else {
              delete bubbleRefs.value[key];
            }
          }}
          typing={initialized.value ? bubble.typing : false}
          onTypingComplete={() => {
            onTypingCompleteBubble?.();
            onTypingComplete(key);
          }}
        />
      </div>
    </BubbleContextProvider>,
  )
})

defineExpose({
  nativeElement: listRef,
  scrollTo: ({ key, offset, behavior = 'smooth', block }: {
    offset?: number;
    key?: string | number;
    behavior?: ScrollBehavior;
    block?: ScrollLogicalPosition;
  }) => {
    if (typeof offset === 'number') {
      // Offset scroll
      unref(listRef)!.scrollTo({
        top: offset,
        behavior,
      });
    } else if (key !== undefined) {
      // Key scroll
      const bubbleInst = unref(bubbleRefs)[key];

      if (bubbleInst) {
        // Block current auto scrolling
        const index = unref(displayData).findIndex((dataItem) => dataItem.key === key);
        setScrollReachEnd(index === unref(displayData).length - 1);

        // Do native scroll
        bubbleInst.nativeElement.scrollIntoView({
          behavior,
          block,
        });
      }
    }
  }
});
</script>
