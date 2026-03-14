<script setup lang="tsx">
import { Flex } from 'ant-design-vue';
import classnames from 'classnames';
import pickAttrs from '../_util/pick-attrs';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import { useXProviderContext } from '../x-provider';
import { SenderHeaderContextProvider, SenderContextProvider } from './context';
import ActionButtonContextProvider from './components/ActionButton/context';
import ClearButton from './components/ClearButton.vue';
import LoadingButton from './components/LoadingButton.vue';
import SendButton from './components/SendButton.vue';
import SpeechButton from './components/SpeechButton/index.vue';
import TextArea from './TextArea.vue';
import SlotTextArea from './SlotTextArea.vue';
import useStyle from './style';
import useSpeech from './useSpeech';
import type {
  ActionsComponents,
  BaseNode,
  SenderProps,
  SenderRef,
  SlotTextAreaRef,
} from './interface';
import { computed, ref, watch, type VNode } from 'vue';

defineOptions({ name: 'AXSender' });

/** Used for actions render needed components */
const sharedRenderComponents: ActionsComponents = {
  SendButton,
  ClearButton,
  LoadingButton,
  SpeechButton,
};

const {
  prefixCls: customizePrefixCls,
  styles = {},
  classNames = {},
  className,
  rootClassName,
  style,
  defaultValue,
  value,
  placeholder,
  readOnly,
  submitType = 'enter',
  onSubmit,
  loading,
  components,
  onCancel,
  onChange,
  suffix = undefined,
  actions = undefined,
  sendDisabled = undefined,
  onKeyUp,
  onKeyDown,
  disabled = undefined,
  allowSpeech,
  prefix = undefined,
  footer = undefined,
  header = undefined,
  onPaste,
  onPasteFile,
  autoSize = { maxRows: 8 },
  slotConfig,
  onFocus,
  onBlur,
  ...rest
} = defineProps<SenderProps>();

const emit = defineEmits<{
  'update:value': [value: string];
}>();

const slots = defineSlots<{
  header?(): VNode;
  prefix?(): VNode;
  suffix?(props: {
    ori: VNode;
    info: {
      components: ActionsComponents;
    };
  }): VNode;
  /** @deprecated Use suffix slot instead */
  actions?(props: {
    ori: VNode;
    info: {
      components: ActionsComponents;
    };
  }): VNode;
  footer?(props: {
    ori: VNode;
    info: {
      components: ActionsComponents;
    };
  }): VNode;
}>();

const isSlotMode = computed(() => Array.isArray(slotConfig));

// ============================= MISC =============================
const { direction, getPrefixCls } = useXProviderContext();
const prefixCls = computed(() => getPrefixCls('sender', customizePrefixCls));

// ============================= Refs =============================
const containerRef = ref<HTMLDivElement | null>(null);
const inputRef = ref<any>(null);

// ======================= Component Config =======================
const contextConfig = useXComponentConfig('sender');
const inputCls = computed(() => `${prefixCls.value}-input`);

// ============================ Styles ============================
const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls.value);
const mergedCls = computed(() =>
  classnames(
    prefixCls.value,
    contextConfig.value.className,
    className,
    rootClassName,
    contextConfig.value.classNames?.root,
    classNames.root,
    hashId.value,
    cssVarCls,
    {
      [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
      [`${prefixCls.value}-disabled`]: disabled,
    },
  ),
);

const actionBtnCls = computed(() => `${prefixCls.value}-actions-btn`);
const actionListCls = computed(() => `${prefixCls.value}-actions-list`);

// ============================ Value =============================
const innerValue = ref(value ?? defaultValue ?? '');
const setInnerValue = (v: string) => {
  innerValue.value = v;
};
watch(
  () => value,
  () => {
    if (value !== undefined) {
      setInnerValue(value);
    }
  },
);

const triggerValueChange: SenderProps['onChange'] = (nextValue, event, slotConfigData) => {
  if (slotConfigData) {
    setInnerValue(nextValue);
    emit('update:value', nextValue);
    if (onChange) {
      onChange(nextValue, event, slotConfigData);
    }
    return;
  }

  setInnerValue(nextValue);
  emit('update:value', nextValue);
  if (onChange) {
    onChange(nextValue, event);
  }
};

// ============================ Speech ============================
const { speechPermission, triggerSpeech, recording: speechRecording } = useSpeech(
  (transcript) => {
    if (isSlotMode.value) {
      (inputRef.value as SlotTextAreaRef)?.insert?.([
        {
          type: 'text',
          value: transcript,
        },
      ]);
    } else {
      triggerValueChange(`${innerValue.value} ${transcript}`);
    }
  },
  () => allowSpeech,
);

// ============================ Events ============================
const triggerSend = () => {
  const shouldSend = sendDisabled !== undefined
    ? !sendDisabled
    : !!(innerValue.value && !loading);
  if (shouldSend && onSubmit) {
    onSubmit(innerValue.value);
  }
};

const triggerClear = () => {
  triggerValueChange('');
  if (isSlotMode.value) {
    (inputRef.value as SlotTextAreaRef)?.clear?.();
  }
};

// ============================ Action ============================
const actionNode = computed((): VNode => (
  <Flex class={`${actionListCls.value}-presets`}>
    {allowSpeech && <SpeechButton />}
    {loading ? <LoadingButton /> : <SendButton />}
  </Flex>
));

// ============================ Suffix ============================
const suffixNode = computed(() => {
  let node: BaseNode = actionNode.value;
  const info = { components: sharedRenderComponents };

  if (slots.suffix) {
    node = slots.suffix({ ori: actionNode.value, info });
  } else if (typeof suffix === 'function') {
    node = suffix(actionNode.value, info);
  } else if (suffix !== undefined) {
    node = suffix;
  } else if (slots.actions) {
    node = slots.actions({ ori: actionNode.value, info });
  } else if (typeof actions === 'function') {
    node = actions(actionNode.value, info);
  } else if (actions !== undefined) {
    node = actions;
  }

  return node;
});

// ============================ Prefix ============================
const prefixNode = computed(() => {
  if (slots.prefix) {
    return slots.prefix();
  }
  return typeof prefix === 'function'
    ? prefix(actionNode.value, { components: sharedRenderComponents })
    : prefix || null;
});

// ============================ Header ============================
const headerNode = computed(() => {
  if (slots.header) {
    return slots.header();
  }
  return typeof header === 'function'
    ? header(actionNode.value, { components: sharedRenderComponents })
    : header || null;
});

// ============================ Footer ============================
const footerNode = computed(() => {
  if (slots.footer) {
    return slots.footer({ ori: actionNode.value, info: { components: sharedRenderComponents } });
  }
  if (typeof footer === 'function') {
    if (footer.length <= 1) {
      return (footer as any)({ components: sharedRenderComponents });
    }
    return footer(actionNode.value, { components: sharedRenderComponents });
  }
  return footer || null;
});

// Custom actions context props
const actionsButtonContextProps = computed(() => ({
  prefixCls: actionBtnCls.value,
  onSend: triggerSend,
  onSendDisabled: sendDisabled !== undefined ? sendDisabled : !innerValue.value,
  onClear: triggerClear,
  onClearDisabled: !innerValue.value,
  onCancel,
  onCancelDisabled: !loading,
  onSpeech: () => triggerSpeech(false),
  onSpeechDisabled: !speechPermission.value,
  speechRecording: speechRecording.value,
  disabled,
}));

// ============================ Context ============================
const domProps = computed(() =>
  pickAttrs(rest, {
    attr: true,
    aria: true,
    data: true,
  }),
);

const contextValue = computed<SenderProps>(() => ({
  value: innerValue.value,
  onChange: triggerValueChange,
  slotConfig,
  onKeyUp,
  onKeyDown,
  onPaste,
  onPasteFile,
  disabled,
  readOnly,
  submitType,
  prefixCls: prefixCls.value,
  styles,
  classNames,
  autoSize,
  components,
  onSubmit,
  placeholder,
  onFocus,
  onBlur,
  ...rest,
}));

// ============================ Focus =============================
const onContentMouseDown = (e: MouseEvent) => {
  if (
    !isSlotMode.value &&
    e.target !== containerRef.value?.querySelector(`.${inputCls.value}`)
  ) {
    e.preventDefault();
  }
  if (e.target === containerRef.value?.querySelector(`.${inputCls.value}`)) {
    inputRef.value?.focus();
  }
};

defineExpose<SenderRef>({
  nativeElement: containerRef.value!,
  inputElement: inputRef.value?.nativeElement,
  focus: (opt: any) => inputRef.value?.focus(opt),
  blur: () => inputRef.value?.blur(),
  insert: (...args: any[]) => inputRef.value?.insert?.(...args),
  clear: () => inputRef.value?.clear?.(),
  getValue: () => inputRef.value?.getValue?.(),
});

defineRender(() => {
  return wrapCSSVar(
    <div
      ref={containerRef}
      class={mergedCls.value}
      style={{
        ...contextConfig.value.style,
        ...style,
        ...contextConfig.value.styles?.root,
        ...styles.root,
      }}
      {...domProps.value}
    >
      <SenderContextProvider value={contextValue.value}>
        <ActionButtonContextProvider value={actionsButtonContextProps.value}>
          {/* Header */}
          {headerNode.value && (
            <SenderHeaderContextProvider value={{ prefixCls: prefixCls.value }}>
              {headerNode.value}
            </SenderHeaderContextProvider>
          )}
          <div
            class={classnames(`${prefixCls.value}-content`, classNames.content)}
            style={styles.content}
            onMousedown={onContentMouseDown}
          >
            {/* Prefix */}
            {prefixNode.value && (
              <div
                class={classnames(
                  `${prefixCls.value}-prefix`,
                  contextConfig.value.classNames?.prefix,
                  classNames.prefix,
                )}
                style={{
                  ...contextConfig.value.styles?.prefix,
                  ...styles.prefix,
                }}
              >
                {prefixNode.value}
              </div>
            )}

            {/* Input */}
            {isSlotMode.value ? (
              <SlotTextArea ref={inputRef} />
            ) : (
              <TextArea ref={inputRef} />
            )}

            {/* Action List */}
            {suffixNode.value && (
              <div
                class={classnames(
                  actionListCls.value,
                  contextConfig.value.classNames?.suffix,
                  classNames.suffix,
                )}
                style={{
                  ...contextConfig.value.styles?.suffix,
                  ...styles.suffix,
                }}
              >
                {suffixNode.value}
              </div>
            )}
          </div>
          {footerNode.value && (
            <div
              class={classnames(
                `${prefixCls.value}-footer`,
                contextConfig.value.classNames?.footer,
                classNames.footer,
              )}
              style={{
                ...contextConfig.value.styles?.footer,
                ...styles.footer,
              }}
            >
              {footerNode.value}
            </div>
          )}
        </ActionButtonContextProvider>
      </SenderContextProvider>
    </div>,
  );
});
</script>
