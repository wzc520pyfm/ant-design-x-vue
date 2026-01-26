<script setup lang="tsx">
import classnames from 'classnames';
import { useEventCallback } from '../_util/hooks/use-event-callback';
import pickAttrs from '../_util/pick-attrs';
import { useXProviderContext } from '../x-provider';
import Bubble from './Bubble.vue';
import DividerBubble from './Divider.vue';
import SystemBubble from './System.vue';
import BubbleContextProvider from './context';
import useDisplayData from './hooks/useDisplayData';
import useListData from './hooks/useListData';
import type {
  BubbleItemType,
  BubbleListProps,
  BubbleListRef,
  BubbleRef,
  FuncRoleProps,
  RoleProps,
} from './interface';
import useStyle from './style';
import useState from '../_util/hooks/use-state';
import {
  computed,
  type HTMLAttributes,
  mergeProps,
  nextTick,
  onWatcherCleanup,
  ref,
  unref,
  useAttrs,
  watch,
  watchPostEffect,
  type VNode,
} from 'vue';

defineOptions({ name: 'AXBubbleList', inheritAttrs: false });

const attrs = useAttrs();

const TOLERANCE = 1;

const props = withDefaults(defineProps<BubbleListProps>(), {
  autoScroll: true,
  items: () => [],
  styles: () => ({}),
  classNames: () => ({}),
});

const slots = defineSlots<{
  avatar?(props: { item: BubbleItemType }): VNode;
  header?(props: { item: BubbleItemType }): VNode | string;
  footer?(props: { item: BubbleItemType }): VNode | string;
  extra?(props: { item: BubbleItemType }): VNode | string;
  loading?(props: { item: BubbleItemType }): VNode;
  content?(props: { item: BubbleItemType }): VNode | string;
}>();

const domProps = computed(
  () =>
    pickAttrs(mergeProps(props, attrs), {
      attr: true,
      aria: true,
    }) as HTMLAttributes,
);

const items = ref<BubbleItemType[]>(props.items);
const roles = ref(props.roles);

watch(
  () => props.items,
  () => {
    items.value = props.items;
  },
);

watch(
  () => props.roles,
  () => {
    roles.value = props.roles;
  },
);

// ============================= Refs =============================
const listRef = ref<HTMLDivElement | null>(null);
const scrollBoxRef = ref<HTMLDivElement | null>(null);
const bubbleRefs = ref<Record<string | number, BubbleRef>>({});

// ============================ Prefix ============================
const { getPrefixCls } = useXProviderContext();

const prefixCls = getPrefixCls('bubble', props.prefixCls);
const listPrefixCls = `${prefixCls}-list`;

const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

// ============================ Typing ============================
const [initialized, setInitialized] = useState(false);

watchPostEffect(() => {
  setInitialized(true);
  onWatcherCleanup(() => {
    setInitialized(false);
  });
});

// ============================= Data =============================
const mergedData = useListData(items, roles as any);

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

  props.onScroll?.(e);
};

// Only scroll when data change and scroll is at end
watch([updateCount, scrollBoxRef, scrollReachEnd], () => {
  if (props.autoScroll && unref(scrollBoxRef) && unref(scrollReachEnd)) {
    nextTick(() => {
      unref(scrollBoxRef)?.scrollTo({
        top: unref(scrollBoxRef)!.scrollHeight,
      });
    });
  }
});

// Always scroll to bottom when data change
watch(
  () => unref(displayData).length,
  () => {
    if (props.autoScroll) {
      // New data come, the origin last one is the second last one
      const lastItemKey = unref(displayData)[unref(displayData).length - 2]?.key;
      const bubbleInst = unref(bubbleRefs)[lastItemKey!];

      // Auto scroll if last 2 item is visible
      if (bubbleInst) {
        const { nativeElement } = bubbleInst;
        const { top = 0, bottom = 0 } = nativeElement?.getBoundingClientRect() ?? {};
        const scrollBox = unref(scrollBoxRef);
        if (scrollBox) {
          const { top: listTop, bottom: listBottom } = scrollBox.getBoundingClientRect();

          const isVisible = top < listBottom && bottom > listTop;
          if (isVisible) {
            setUpdateCount(unref(updateCount) + 1);
            setScrollReachEnd(true);
          }
        }
      }
    }
  },
);

// =========================== Context ============================
// When bubble content update, we try to trigger `autoScroll` for sync
const onBubbleUpdate = useEventCallback<void>(() => {
  if (props.autoScroll) {
    setUpdateCount(unref(updateCount) + 1);
  }
});

const mergedClassNames = computed(() =>
  classnames(listPrefixCls, props.rootClassName, hashId.value, cssVarCls, props.classNames.root, {
    [`${listPrefixCls}-reach-end`]: scrollReachEnd.value,
  }),
);

const mergedStyle = computed(() => ({
  ...props.styles.root,
  ...(props.style as object),
}));

function roleCfgIsFunction(roleCfg: RoleProps | FuncRoleProps): roleCfg is FuncRoleProps {
  return typeof roleCfg === 'function' && roleCfg instanceof Function;
}

// Helper to get role config
const getRoleConfig = (item: BubbleItemType) => {
  if (item.role && roles.value) {
    const cfg = (roles.value as any)[item.role];
    return roleCfgIsFunction(cfg) ? cfg(item) : cfg;
  }
  return {};
};

const renderBubble = (item: BubbleItemType, roleConfig: RoleProps) => {
  const {
    key,
    role,
    status,
    extraInfo,
    classNames: itemClassNames = {},
    styles: itemStyles = {},
    ...restProps
  } = item;

  const {
    bubble: bubbleClassName,
    divider: dividerClassName,
    system: systemClassName,
    ...otherClassNames
  } = itemClassNames;
  const {
    bubble: bubbleStyle,
    divider: dividerStyle,
    system: systemStyle,
    ...otherStyles
  } = itemStyles;

  const mergedProps = { ...roleConfig, ...restProps };

  const initBubbleRef = (node: any) => {
    if (node) {
      bubbleRefs.value[key] = node;
    } else {
      delete bubbleRefs.value[key];
    }
  };

  const contextValue = computed(() => ({
    key,
    status,
    extraInfo,
    onUpdate: onBubbleUpdate,
  }));

  if (role === 'divider') {
    return (
      <BubbleContextProvider key={key} value={contextValue.value}>
        <DividerBubble
          ref={initBubbleRef}
          style={dividerStyle}
          class={dividerClassName}
          classNames={otherClassNames}
          styles={otherStyles}
          {...mergedProps}
        />
      </BubbleContextProvider>
    );
  }

  if (role === 'system') {
    return (
      <BubbleContextProvider key={key} value={contextValue.value}>
        <SystemBubble
          ref={initBubbleRef}
          style={systemStyle}
          class={systemClassName}
          classNames={otherClassNames}
          styles={otherStyles}
          {...mergedProps}
        />
      </BubbleContextProvider>
    );
  }

  return (
    <BubbleContextProvider key={key} value={contextValue.value}>
      <Bubble
        ref={initBubbleRef}
        style={bubbleStyle}
        class={bubbleClassName}
        classNames={otherClassNames}
        styles={otherStyles}
        avatar={slots.avatar ? () => slots.avatar?.({ item }) : mergedProps.avatar}
        header={slots.header ? slots.header({ item }) : mergedProps.header}
        footer={slots.footer ? slots.footer({ item }) : mergedProps.footer}
        extra={slots.extra ? slots.extra({ item }) : mergedProps.extra}
        loadingRender={slots.loading ? () => slots.loading?.({ item }) : mergedProps.loadingRender}
        {...mergedProps}
        content={slots.content ? slots.content({ item }) : mergedProps.content}
        _key={key}
        typing={initialized.value ? mergedProps.typing : false}
        onTypingComplete={(content) => {
          mergedProps.onTypingComplete?.(content);
          onTypingComplete(key);
        }}
      />
    </BubbleContextProvider>
  );
};

defineRender(() => {
  return wrapCSSVar(
    <div {...domProps.value} class={mergedClassNames.value} style={mergedStyle.value} ref={listRef}>
      <div
        class={classnames(`${listPrefixCls}-scroll-box`, props.classNames.scroll, {
          [`${listPrefixCls}-autoscroll`]: props.autoScroll,
        })}
        style={props.styles.scroll}
        ref={scrollBoxRef}
        onScroll={onInternalScroll}
      >
        {unref(displayData).map((item) => {
          const roleConfig = getRoleConfig(item);
          return renderBubble(item, roleConfig);
        })}
      </div>
    </div>,
  );
});

defineExpose<BubbleListRef>({
  nativeElement: listRef as any,
  scrollTo: ({
    key,
    top,
    offset,
    behavior = 'smooth',
    block,
  }: {
    key?: string | number;
    top?: number | 'bottom' | 'top';
    offset?: number;
    behavior?: ScrollBehavior;
    block?: ScrollLogicalPosition;
  }) => {
    const scrollBox = unref(scrollBoxRef);
    if (!scrollBox) return;

    const { scrollHeight, clientHeight } = scrollBox;

    if (typeof offset === 'number') {
      // Offset scroll
      scrollBox.scrollTo({
        top: offset,
        behavior,
      });
    } else if (typeof top === 'number') {
      scrollBox.scrollTo({
        top: props.autoScroll ? -scrollHeight + clientHeight + top : top,
        behavior,
      });
    } else if (top === 'bottom') {
      const bottomOffset = props.autoScroll ? 0 : scrollHeight;
      scrollBox.scrollTo({ top: bottomOffset, behavior });
    } else if (top === 'top') {
      const topOffset = props.autoScroll ? -scrollHeight : 0;
      scrollBox.scrollTo({ top: topOffset, behavior });
    } else if (key !== undefined && unref(bubbleRefs)[key]) {
      // Block current auto scrolling
      const index = unref(displayData).findIndex((dataItem) => dataItem.key === key);
      setScrollReachEnd(index === unref(displayData).length - 1);

      // Do native scroll
      unref(bubbleRefs)[key].nativeElement?.scrollIntoView({
        behavior,
        block,
      });
    }
  },
});
</script>
