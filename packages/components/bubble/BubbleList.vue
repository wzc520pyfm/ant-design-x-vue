<script setup lang="tsx">
import classnames from 'classnames';
import pickAttrs from '../_util/pick-attrs';
import { useXProviderContext } from '../x-provider';
import Bubble from './Bubble.vue';
import DividerBubble from './Divider.vue';
import SystemBubble from './System.vue';
import BubbleContextProvider from './context';
import { useCompatibleScroll } from './hooks/useCompatibleScroll';
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
  ref,
  unref,
  useAttrs,
  watch,
  watchPostEffect,
  type VNode,
} from 'vue';

defineOptions({ name: 'AXBubbleList', inheritAttrs: false });

const attrs = useAttrs();

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

const domProps = computed(() => {
  // `role` is the React roles map. pickAttrs would copy it onto the host as an
  // HTML role. `onScroll` is handled by the scroll box, matching React.
  const merged = mergeProps(props, attrs) as Record<string, unknown>;
  const { role: _role, roles: _roles, onScroll: _onScroll, ...rest } = merged;
  return pickAttrs(rest, {
    attr: true,
    aria: true,
  }) as HTMLAttributes;
});

const items = ref<BubbleItemType[]>(props.items);

// `roles` is the canonical Vue field; `role` is supported for parity with the
// React `@ant-design/x` 2.0 BubbleList API. `roles` always wins when both are set.
const resolvedRoles = computed(() => props.roles ?? props.role);
const roles = ref(resolvedRoles.value);

watch(
  () => props.items,
  () => {
    items.value = props.items;
  },
);

watch(resolvedRoles, (next) => {
  roles.value = next;
});

// ============================= Refs =============================
const listRef = ref<HTMLDivElement | null>(null);
const scrollBoxRef = ref<HTMLDivElement | null>(null);
const scrollContentRef = ref<HTMLDivElement | null>(null);
const bubbleRefs = ref<Record<string | number, BubbleRef>>({});
const { scrollTo: compatibleScrollTo } = useCompatibleScroll(scrollBoxRef, scrollContentRef);

// ============================ Prefix ============================
const { getPrefixCls } = useXProviderContext();

const prefixCls = getPrefixCls('bubble', props.prefixCls);
const listPrefixCls = `${prefixCls}-list`;

const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

// ============================ Typing ============================
const [initialized, setInitialized] = useState(false);

watchPostEffect((onCleanup) => {
  setInitialized(true);
  onCleanup(() => {
    setInitialized(false);
  });
});

// ============================= Data =============================
const mergedData = useListData(items as any, roles as any);

const mergedClassNames = computed(() =>
  classnames(listPrefixCls, props.rootClassName, hashId.value, cssVarCls, props.classNames.root),
);

function styleToObject(value: unknown): Record<string, unknown> {
  if (!value) return {};
  if (typeof value === 'string') {
    return Object.fromEntries(
      value
        .split(';')
        .map((part) => part.trim())
        .filter(Boolean)
        .map((part) => {
          const index = part.indexOf(':');
          if (index < 0) return [part, ''];
          return [part.slice(0, index).trim(), part.slice(index + 1).trim()];
        }),
    );
  }
  if (Array.isArray(value)) {
    return Object.assign({}, ...value.map(styleToObject));
  }
  if (typeof value === 'object') return value as Record<string, unknown>;
  return {};
}

const mergedStyle = computed(() => ({
  // `style` falls through as an attr because BubbleListProps vue-ignores HTMLAttributes.
  // Reading only props.style dropped the demo's height and let the scrollport grow.
  ...props.styles.root,
  ...styleToObject(attrs.style),
  ...styleToObject(props.style),
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
  }));

  if (role === 'divider') {
    return (
      <BubbleContextProvider key={key} value={contextValue.value}>
        <DividerBubble
          {...({
            ref: initBubbleRef,
            style: dividerStyle,
            class: dividerClassName,
            classNames: otherClassNames,
            styles: otherStyles,
            ...mergedProps,
          } as any)}
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
        // The slot output is already rendered content. Applying contentRender
        // or messageRender to it would stringify the VNode.
        contentRender={slots.content ? undefined : mergedProps.contentRender}
        messageRender={slots.content ? undefined : mergedProps.messageRender}
        _key={key}
        typing={initialized.value ? mergedProps.typing : false}
        onTypingComplete={mergedProps.onTypingComplete}
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
        onScroll={props.onScroll}
      >
        <div
          ref={scrollContentRef}
          class={`${listPrefixCls}-scroll-content`}
        >
          {unref(mergedData).map((item) => {
            const roleConfig = getRoleConfig(item);
            return renderBubble(item, roleConfig);
          })}
        </div>
      </div>
    </div>,
  );
});

defineExpose<BubbleListRef>({
  nativeElement: listRef as any,
  scrollBoxNativeElement: scrollBoxRef as any,
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
      compatibleScrollTo({
        top: offset,
        behavior,
      });
    } else if (typeof top === 'number') {
      compatibleScrollTo({
        top: props.autoScroll ? -scrollHeight + clientHeight + top : top,
        behavior,
      });
    } else if (top === 'bottom') {
      const bottomOffset = props.autoScroll ? 0 : scrollHeight;
      compatibleScrollTo({ top: bottomOffset, behavior });
    } else if (top === 'top') {
      const topOffset = props.autoScroll ? -scrollHeight : 0;
      compatibleScrollTo({ top: topOffset, behavior });
    } else if (key !== undefined && unref(bubbleRefs)[key]?.nativeElement) {
      // `key` 0 is valid. React's `if (key)` check drops it.
      compatibleScrollTo({
        intoView: { behavior, block },
        intoViewDom: unref(bubbleRefs)[key].nativeElement,
      });
    }
  },
});
</script>
