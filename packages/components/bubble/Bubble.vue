<script setup lang="tsx" generic="T extends BubbleContentType = string">
import { Avatar } from 'ant-design-vue';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import { useXProviderContext } from '../x-provider';
import { useBubbleContextInject } from './context';
import EditableContent from './EditableContent.vue';
import type {
  BubbleAnimationOption,
  BubbleContentType,
  BubbleProps,
  BubbleSlot,
  EditableBubbleOption,
  Info,
  SemanticType,
} from './interface';
import Loading from './loading.vue';
import useStyle from './style';
import TypingContent from './TypingContent.vue';
import pickAttrs from '../_util/pick-attrs';
import { computed, isVNode, ref, unref, watch, watchEffect, type VNode } from 'vue';

defineOptions({ name: 'AXBubble' });

const props = withDefaults(defineProps<BubbleProps<T>>(), {
  placement: 'start',
  loading: false,
  variant: 'filled',
  shape: 'default',
  streaming: false,
  editable: false,
  content: '' as any,
  styles: () => ({}),
  classNames: () => ({}),
});

const emit = defineEmits<{
  typingComplete: [content?: string];
  typing: [rendererContent: string, currentContent: string];
  editConfirm: [content: string];
  editCancel: [];
}>();

const slots = defineSlots<{
  avatar?(): VNode;
  header?(props: { content: T; info: Info }): VNode | string;
  footer?(props: { content: T; info: Info }): VNode | string;
  extra?(props: { content: T; info: Info }): VNode | string;
  loading?(): VNode;
  content?(props: { content: T }): VNode | string;
}>();

const content = ref(props.content);

watch(
  () => props.content,
  () => {
    content.value = props.content;
  },
);

// ============================= Bubble context ==============================
const context = unref(useBubbleContextInject());

const divRef = ref<HTMLDivElement | null>(null);

// ============================ Prefix ============================
const { direction, getPrefixCls } = useXProviderContext();

const prefixCls = getPrefixCls('bubble', props.prefixCls);

// ===================== Component Config =========================
const contextConfig = useXComponentConfig('bubble');

// ============================ Styles ============================
const [wrapCSSVar, hashId, cssVarCls] = useStyle(() => prefixCls);

const info = computed<Info>(() => ({
  key: context?.key ?? props._key,
  status: context?.status,
  extraInfo: context?.extraInfo,
}));

// ============================= process content ==============================
const memoedContent = computed(() => {
  // contentRender takes priority over messageRender
  if (props.contentRender) {
    return props.contentRender(content.value, info.value);
  }
  // Backward compatibility with messageRender
  if (props.messageRender) {
    return props.messageRender(content.value);
  }
  return content.value;
});

const mergeTyping = computed(() => {
  const typingProp = props.typing;
  if (typeof typingProp === 'function') {
    return typingProp(content.value, info.value);
  }
  return typingProp;
});

const usingInnerAnimation = computed(
  () => !!mergeTyping.value && typeof memoedContent.value === 'string',
);

/**
 * 1、启用内置动画的情况下，由 TypingContent 来负责通知。
 * 2、不启用内置动画的情况下，也应当有一个回调来反映 content 的变化。
 *    没有动画，则 content 的变化、渲染是全量的，等同于动画是瞬时完成的，合该用 onTypingComplete 来通知变化。
 * 3、流式输入 content 的场景下，应当在流式结束时（streaming === false）才执行 onTypingComplete，
 *    保证一次流式传输归属于一个动画周期。
 **/
watchEffect(() => {
  if (usingInnerAnimation.value) return;
  if (props.streaming) return;
  if (content.value) {
    props.onTypingComplete?.(content.value as string);
    emit('typingComplete', content.value as string);
  }
});

// Notify bubble update for auto scroll
watch(memoedContent, () => {
  context?.onUpdate?.();
});

// ============================= render ==============================
const _footerPlacement = computed<BubbleProps['footerPlacement']>(
  () => props.footerPlacement || (props.placement === 'start' ? 'outer-start' : 'outer-end'),
);

const isEditing = computed(
  () =>
    typeof props.editable === 'boolean'
      ? props.editable
      : (props.editable as EditableBubbleOption)?.editing,
);

const domProps = computed(() =>
  pickAttrs(props, {
    attr: true,
    aria: true,
    data: true,
  }),
);

const rootMergedStyle = computed(() => ({
  ...(contextConfig.value.style as object),
  ...(contextConfig.value.styles.root as object),
  ...(props.styles.root as object),
  ...(props.style as object),
}));

const rootMergedCls = computed(() => [
  prefixCls,
  contextConfig.value.className,
  contextConfig.value.classNames.root,
  props.classNames.root,
  props.rootClassName,
  props.class,
  hashId.value,
  cssVarCls,
  `${prefixCls}-${props.placement}`,
  {
    [`${prefixCls}-${context?.status}`]: context?.status,
    [`${prefixCls}-rtl`]: direction.value === 'rtl',
    [`${prefixCls}-loading`]: props.loading,
  },
]);

const getSlotClassName = (slotType: SemanticType) => [
  `${prefixCls}-${slotType}`,
  contextConfig.value.classNames[slotType],
  props.classNames[slotType],
];

const getSlotStyle = (slotType: SemanticType) => ({
  ...contextConfig.value.styles[slotType],
  ...props.styles[slotType],
});

const isVNodeArray = (val: any) => Array.isArray(val) && val.every(isVNode);

const renderSlot = (slot: BubbleSlot<T> | undefined) => {
  if (!slot) return null;
  return typeof slot === 'function' ? slot(content.value, info.value) : slot;
};

const renderAvatar = () => {
  if (slots.avatar) {
    return (
      <div class={getSlotClassName('avatar')} style={getSlotStyle('avatar')}>
        {slots.avatar()}
      </div>
    );
  }
  if (!props.avatar) return null;
  const avatarContent =
    typeof props.avatar === 'function'
      ? props.avatar()
      : isVNode(props.avatar) || isVNodeArray(props.avatar)
        ? props.avatar
        : typeof props.avatar === 'object' && !isVNode(props.avatar)
          ? <Avatar {...(props.avatar as any)} />
          : renderSlot(props.avatar as BubbleSlot<T>);
  return (
    <div class={getSlotClassName('avatar')} style={getSlotStyle('avatar')}>
      {avatarContent}
    </div>
  );
};

const renderExtra = () => {
  if (slots.extra) {
    return (
      <div class={getSlotClassName('extra')} style={getSlotStyle('extra')}>
        {slots.extra({ content: content.value, info: info.value })}
      </div>
    );
  }
  if (!props.extra) return null;
  return (
    <div class={getSlotClassName('extra')} style={getSlotStyle('extra')}>
      {renderSlot(props.extra)}
    </div>
  );
};

const renderHeader = () => {
  if (slots.header) {
    return (
      <div class={getSlotClassName('header')} style={getSlotStyle('header')}>
        {slots.header({ content: content.value, info: info.value })}
      </div>
    );
  }
  if (!props.header) return null;
  return (
    <div class={getSlotClassName('header')} style={getSlotStyle('header')}>
      {renderSlot(props.header)}
    </div>
  );
};

const renderFooter = () => {
  if (slots.footer) {
    const cls = [
      getSlotClassName('footer'),
      {
        [`${prefixCls}-footer-start`]: _footerPlacement.value?.includes('start'),
        [`${prefixCls}-footer-end`]: _footerPlacement.value?.includes('end'),
      },
    ];
    return (
      <div class={cls} style={getSlotStyle('footer')}>
        {slots.footer({ content: content.value, info: info.value })}
      </div>
    );
  }
  if (!props.footer) return null;
  const cls = [
    getSlotClassName('footer'),
    {
      [`${prefixCls}-footer-start`]: _footerPlacement.value?.includes('start'),
      [`${prefixCls}-footer-end`]: _footerPlacement.value?.includes('end'),
    },
  ];
  return (
    <div class={cls} style={getSlotStyle('footer')}>
      {renderSlot(props.footer)}
    </div>
  );
};

const handleTyping = (rendererContent: string, currentContent: string) => {
  props.onTyping?.(rendererContent, currentContent);
  emit('typing', rendererContent, currentContent);
  context?.onUpdate?.();
};

const handleTypingComplete = (contentVal?: string) => {
  props.onTypingComplete?.(contentVal);
  emit('typingComplete', contentVal);
};

const handleEditConfirm = (contentVal: string) => {
  props.onEditConfirm?.(contentVal);
  emit('editConfirm', contentVal);
};

const handleEditCancel = () => {
  props.onEditCancel?.();
  emit('editCancel');
};

const renderContent = () => {
  if (props.loading) {
    if (slots.loading) {
      return slots.loading();
    }
    return props.loadingRender ? props.loadingRender() : <Loading prefixCls={prefixCls} />;
  }

  const contentNode = slots.content ? (
    slots.content({ content: content.value })
  ) : usingInnerAnimation.value ? (
    <TypingContent
      prefixCls={prefixCls}
      streaming={props.streaming}
      typing={mergeTyping.value as true | BubbleAnimationOption}
      content={memoedContent.value as string}
      onTyping={handleTyping}
      onTypingComplete={handleTypingComplete}
    />
  ) : (
    memoedContent.value
  );

  const isFooterIn = _footerPlacement.value?.includes('inner');

  return (
    <div class={getSlotClassName('body')} style={getSlotStyle('body')}>
      {renderHeader()}
      <div
        style={{
          ...contextConfig.value.styles.content,
          ...props.styles.content,
        }}
        class={[
          `${prefixCls}-content`,
          `${prefixCls}-content-${props.variant}`,
          contextConfig.value.classNames.content,
          props.classNames.content,
          {
            [`${prefixCls}-content-${context?.status}`]: context?.status,
            [`${prefixCls}-content-${props.shape}`]: props.variant !== 'borderless',
            [`${prefixCls}-content-editing`]: isEditing.value,
            [`${prefixCls}-content-string`]: typeof memoedContent.value === 'string',
          },
        ]}
      >
        {isEditing.value ? (
          <EditableContent
            prefixCls={prefixCls}
            content={content.value as string}
            okText={(props.editable as EditableBubbleOption)?.okText}
            cancelText={(props.editable as EditableBubbleOption)?.cancelText}
            onEditConfirm={handleEditConfirm}
            onEditCancel={handleEditCancel}
          />
        ) : (
          <>
            {isFooterIn ? (
              <div class={`${prefixCls}-content-with-footer`}>{contentNode}</div>
            ) : (
              contentNode
            )}
            {isFooterIn && renderFooter()}
          </>
        )}
      </div>
      {!isEditing.value && !isFooterIn && renderFooter()}
    </div>
  );
};

defineRender(() => {
  return wrapCSSVar(
    <div
      class={rootMergedCls.value}
      style={rootMergedStyle.value}
      {...domProps.value}
      ref={divRef}
    >
      {renderAvatar()}
      {renderContent()}
      {!isEditing.value && !props.loading && renderExtra()}
    </div>,
  );
});

defineExpose({
  nativeElement: divRef,
});
</script>
