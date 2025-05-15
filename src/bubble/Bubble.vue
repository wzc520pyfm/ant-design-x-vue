<script setup lang="tsx" generic="T extends BubbleContentType = string">
import { Avatar } from 'ant-design-vue';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import { useXProviderContext } from '../x-provider';
import useTypedEffect from './hooks/useTypedEffect';
import useTypingConfig from './hooks/useTypingConfig';
import type { BubbleContentType, BubbleProps } from './interface';
import Loading from './loading.vue';
import useStyle from './style';
import { useBubbleContextInject } from './context';
import { computed, isVNode, ref, toRef, toValue, unref, useTemplateRef, watch, watchEffect } from 'vue';
import type { VNode } from 'vue'

defineOptions({ name: "AXBubble" });

const {
  prefixCls: customizePrefixCls,
  rootClassName,
  // TODO: Vue's style is not necessarily an object, reconsider the design method in tsx.
  // style = {},
  classNames = {},
  styles = {},
  avatar,
  placement = 'start',
  loading = false,
  loadingRender,
  typing,
  content: contentProp = '',
  messageRender,
  variant = 'filled',
  shape,
  onTypingComplete,
  header,
  footer,
  ...otherHtmlProps
} = defineProps<BubbleProps<T>>();

const slots = defineSlots<{
  avatar?(): VNode;
  header?(): VNode | string;
  footer?(props?: {
    content: BubbleContentType;
  }): VNode | string;
  loading?(): VNode;
  message?(props?: {
    content: BubbleContentType;
  }): VNode | string;
}>();

const content = ref(contentProp);

watch(() => contentProp, () => {
  content.value = contentProp;
})

const { onUpdate } = unref(useBubbleContextInject());

// TODO: useTemplateRef will trigger warning when expose: [Vue warn] Set operation on key "value" failed: target is readonly.
// const divRef = useTemplateRef<HTMLDivElement>('div');
const divRef = ref<HTMLDivElement>(null);

// ============================ Prefix ============================
const { direction, getPrefixCls } = useXProviderContext();

const prefixCls = getPrefixCls('bubble', customizePrefixCls);

// ===================== Component Config =========================
const contextConfig = useXComponentConfig('bubble');

// ============================ Typing ============================
const [typingEnabled, typingStep, typingInterval, typingSuffix] = useTypingConfig(() => typing);

const [typedContent, isTyping] = useTypedEffect(
  content,
  typingEnabled,
  typingStep,
  typingInterval,
);

const triggerTypingCompleteRef = ref(false);

watch(typedContent, () => {
  onUpdate?.();
});

watchEffect(() => {
  if (!isTyping.value && !loading) {
    // StrictMode will trigger this twice,
    // So we need a flag to avoid that
    if (!triggerTypingCompleteRef.value) {
      triggerTypingCompleteRef.value = true;
      onTypingComplete?.();
    }
  } else {
    triggerTypingCompleteRef.value = false;
  }
});

// ============================ Styles ============================
const [wrapCSSVar, hashId, cssVarCls] = useStyle(() => prefixCls);

const mergedCls = computed(() => [
  prefixCls,
  rootClassName,
  contextConfig.value.className,
  hashId.value,
  cssVarCls,
  `${prefixCls}-${placement}`,
  {
    [`${prefixCls}-rtl`]: direction.value === 'rtl',
  },
  {
    [`${prefixCls}-typing`]: isTyping.value && !loading && !messageRender && !slots.message && !typingSuffix.value,
  },
]);

// ============================ Avatar ============================
const avatarNode = computed(() => {
  if (slots.avatar) {
    return slots.avatar();
  }
  return isVNode(avatar) ? avatar : <Avatar {...avatar} />;
});

// =========================== Content ============================
const mergedContent = computed(() => {
  if (slots.message) {
    return slots.message({ content: typedContent.value as any });
  }
  return messageRender ? messageRender(typedContent.value as any) : typedContent.value
});

// ============================ Render ============================
const contentNode = computed<VNode>(() => {
  if (loading) {
    if (slots.loading) {
      return slots.loading();
    }
    return loadingRender ? loadingRender() : <Loading prefixCls={prefixCls} />;
  } else {
    return (
      <>
        {mergedContent.value}
        {isTyping.value && toValue(typingSuffix)}
      </>
    );
  }
});

const fullContent = computed<VNode>(() => {
  const _content = (
    <div
      style={{
        ...contextConfig.value.styles.content,
        ...styles.content,
      }}
      class={[
        `${prefixCls}-content`,
        `${prefixCls}-content-${variant}`,
        { [`${prefixCls}-content-${shape}`]: shape },
        contextConfig.value.classNames.content,
        classNames.content,
      ]}
    >
      {toValue(contentNode)}
    </div>
  );
  const _header = slots.header ? slots.header() : header;
  const _footer = slots.footer
    ? slots.footer({ content: typedContent.value })
    : typeof footer === 'function'
      ? footer(typedContent.value)
      : footer;

  if (_header || _footer) {
    return (
      <div class={`${prefixCls}-content-wrapper`}>
        {_header && (
          <div
            class={[
              `${prefixCls}-header`,
              contextConfig.value.classNames.header,
              classNames.header,
            ]}
            style={{
              ...contextConfig.value.styles.header,
              ...styles.header,
            }}
          >
            {_header}
          </div>
        )}
        {_content}
        {_footer && (
          <div
            class={[
              `${prefixCls}-footer`,
              contextConfig.value.classNames.footer,
              classNames.footer,
            ]}
            style={{
              ...contextConfig.value.styles.footer,
              ...styles.footer,
            }}
          >
            {_footer}
          </div>
        )}
      </div>
    )
  }
  return _content;
});

defineRender(() => {
  return wrapCSSVar(
    <div
      style={{
        ...(contextConfig.value.style as object),
        // ...(style as object),
      }}
      class={toValue(mergedCls)}
      {...otherHtmlProps}
      ref={divRef}
    >
      {/* Avatar */}
      {(slots.avatar || avatar) && (
        <div
          style={{
            ...contextConfig.value.styles.avatar,
            ...styles.avatar,
          }}
          class={[
            `${prefixCls}-avatar`,
            contextConfig.value.classNames.avatar,
            classNames.avatar,
          ]}
        >
          {toValue(avatarNode)}
        </div>
      )}

      {/* Content */}
      {toValue(fullContent)}
    </div>,
  );
});

defineExpose({
  nativeElement: divRef,
});
</script>
