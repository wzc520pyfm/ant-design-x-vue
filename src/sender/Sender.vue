<script setup lang="tsx">
import { Flex, Input } from 'ant-design-vue';
import classnames from 'classnames';
import pickAttrs from '../_util/pick-attrs';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import { useXProviderContext } from '../x-provider';
import SenderHeaderContextProvider from './context';
import ActionButtonContextProvider from './components/ActionButton/context';
import ClearButton from './components/ClearButton.vue';
import LoadingButton from './components/LoadingButton.vue';
import SendButton from './components/SendButton.vue';
import SpeechButton from './components/SpeechButton/index.vue';
import useStyle from './style';
import useSpeech from './useSpeech';
import type { SenderComponents, SenderProps } from './interface';
import { computed, ref, watch, type VNode } from 'vue';
import getValue from '../_util/getValue';
import type { ChangeEvent, ClipboardEventHandler, MouseEventHandler } from "ant-design-vue/es/_util/EventInterface";;

function getComponent<T>(
  components: SenderComponents | undefined,
  path: string[],
  defaultComponent: typeof Input.TextArea,
): typeof Input.TextArea {
  return getValue(components, path) || defaultComponent;
}

/** Used for actions render needed components */
const sharedRenderComponents = {
  SendButton,
  ClearButton,
  LoadingButton,
  SpeechButton,
};

defineOptions({ name: 'AXSender' });

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
  actions = undefined,
  onKeyPress,
  onKeyDown,
  disabled = undefined,
  allowSpeech,
  prefix,
  footer,
  header,
  onPaste,
  onPasteFile,
  autoSize = { maxRows: 8 },
  ...rest
} = defineProps<SenderProps>();

const emit = defineEmits<{
  'update:value': [value: string];
}>();

const slots = defineSlots<{
  header?(): VNode;
  prefix?(): VNode;
  actions?(props: {
    ori: VNode,
    info: {
      components: {
        SendButton: typeof SendButton;
        ClearButton: typeof ClearButton;
        LoadingButton: typeof LoadingButton;
        SpeechButton: typeof SpeechButton;
      };
    }
  }): VNode;
  footer?(props: {
    info: {
      components: {
        SendButton: typeof SendButton;
        ClearButton: typeof ClearButton;
        LoadingButton: typeof LoadingButton;
        SpeechButton: typeof SpeechButton;
      };
    }
  }): VNode;
}>();

// ============================= MISC =============================
const { direction, getPrefixCls } = useXProviderContext();
const prefixCls = computed(() => {
  return getPrefixCls('sender', customizePrefixCls)
});

// ============================= Refs =============================
const containerRef = ref<HTMLDivElement | null>(null);
const inputRef = ref<InstanceType<typeof Input.TextArea> | null>(null);

// ======================= Component Config =======================
const contextConfig = useXComponentConfig('sender');
const inputCls = computed(() => `${prefixCls.value}-input`);

// ============================ Styles ============================
const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls.value);
const mergedCls = computed(() => {
  return classnames(
    prefixCls.value,
    contextConfig.value.className,
    className,
    rootClassName,
    hashId.value,
    cssVarCls,
    {
      [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
      [`${prefixCls.value}-disabled`]: disabled,
    },
  );
})

const actionBtnCls = computed(() => `${prefixCls.value}-actions-btn`);
const actionListCls = computed(() => `${prefixCls.value}-actions-list`);

// ============================ Value =============================
const innerValue = ref(value ?? defaultValue ?? '');
const setInnerValue = (v: string) => {
  innerValue.value = v;
}
watch(() => value, () => {
  setInnerValue(value);
});

const triggerValueChange: SenderProps['onChange'] = (nextValue, event) => {
  setInnerValue(nextValue);

  emit('update:value', nextValue);
  if (onChange) {
    onChange(nextValue, event);
  }
};

// ============================ Speech ============================
const { speechPermission, triggerSpeech, recording: speechRecording } = useSpeech((transcript) => {
  triggerValueChange(`${innerValue.value} ${transcript}`);
}, () => allowSpeech);

// ========================== Components ==========================
const InputTextArea = getComponent(components, ['input'], Input.TextArea);

const domProps = computed(() => pickAttrs(rest, {
  attr: true,
  aria: true,
  data: true,
}))

const inputProps = computed(() => {
  return {
    ...domProps.value,
    ref: inputRef,
  };
})

// ============================ Events ============================
const triggerSend = () => {
  if (innerValue.value && onSubmit && !loading) {
    onSubmit(innerValue.value);
  }
};

const triggerClear = () => {
  triggerValueChange('');
};

// ============================ Submit ============================
const isCompositionRef = ref(false);

const onInternalCompositionStart = () => {
  isCompositionRef.value = true;
};

const onInternalCompositionEnd = () => {
  isCompositionRef.value = false;
};

const onInternalKeyPress: SenderProps['onKeyPress'] = (e) => {
  const canSubmit = e.key === 'Enter' && !isCompositionRef.value;

  // Check for `submitType` to submit
  switch (submitType) {
    case 'enter':
      if (canSubmit && !e.shiftKey) {
        e.preventDefault();
        triggerSend();
      }
      break;

    case 'shiftEnter':
      if (canSubmit && e.shiftKey) {
        e.preventDefault();
        triggerSend();
      }
      break;
  }

  if (onKeyPress) {
    onKeyPress(e);
  }
};

// ============================ Paste =============================
const onInternalPaste: ClipboardEventHandler = (e) => {
  // Get files
  const files = e.clipboardData?.files;
  if (files?.length && onPasteFile) {
    onPasteFile(files[0], files);
    e.preventDefault();
  }

  onPaste?.(e);
};

// ============================ Focus =============================
const onContentMouseDown: MouseEventHandler = (e) => {
  // If input focused but click on the container,
  // input will lose focus.
  // We call `preventDefault` to prevent this behavior
  if (e.target !== containerRef.value?.querySelector(`.${inputCls.value}`)) {
    e.preventDefault();
  }

  // @ts-expect-error
  inputRef.value?.focus();
};

// ============================ Action ============================
const actionNode = computed(() => {
  let _actionNode: VNode | false = (
    <Flex class={`${actionListCls.value}-presets`}>
      {allowSpeech && (
        <SpeechButton
          {...(typeof allowSpeech === 'object' ? 
            { 
              audioIcon: allowSpeech.audioIcon, 
              audioDisabledIcon: allowSpeech.audioDisabledIcon, 
              audioRecordingIcon: allowSpeech.audioRecordingIcon 
            } : {}
          )}
        />
      )}
      {/* Loading or Send */}
      {loading ? <LoadingButton /> : <SendButton />}
    </Flex>
  );

  const info = {
    components: sharedRenderComponents,
  }

  // Custom actions
  if (slots.actions) {
    _actionNode = slots.actions({ ori: _actionNode, info });
  } else if (typeof actions === 'function') {
    _actionNode = actions(_actionNode, info);
  } else if (actions || actions === false) {
    _actionNode = actions;
  }
  return _actionNode;
});

// Custom actions context props
const actionsButtonContextProps = computed(() => ({
  prefixCls: actionBtnCls.value,
  onSend: triggerSend,
  onSendDisabled: !innerValue.value,
  onClear: triggerClear,
  onClearDisabled: !innerValue.value,
  onCancel,
  onCancelDisabled: !loading,
  onSpeech: () => triggerSpeech(false),
  onSpeechDisabled: !speechPermission.value,
  speechRecording: speechRecording.value,
  disabled,
}));

// ============================ Footer ============================
const footerNode = computed(() => {
  let _footerNode: VNode = null;

  const info = {
    components: sharedRenderComponents,
  }

  if (slots.footer) {
    _footerNode = slots.footer({ info });
  } else if (typeof footer === 'function') {
    _footerNode = footer({
      components: sharedRenderComponents,
    });
  } else if (footer) {
    _footerNode = footer;
  }
  return _footerNode;
});

const headerComp = computed(() => {
  if (slots.header) {
    return slots.header();
  }
  return typeof header === 'function' ? header() : header;
});

const prefixComp = computed(() => {
  if (slots.prefix) {
    return slots.prefix();
  }
  return typeof prefix === 'function' ? prefix() : prefix;
});

defineRender(() => {
  return wrapCSSVar(
    <div ref={containerRef} class={mergedCls.value} style={{ ...contextConfig.value.style, ...style }}>
      {/* Header */}
      {headerComp.value && (
        <SenderHeaderContextProvider value={{ prefixCls: prefixCls.value }}>{headerComp.value}</SenderHeaderContextProvider>
      )}
      <ActionButtonContextProvider value={actionsButtonContextProps.value}>

        <div class={`${prefixCls.value}-content`} onMousedown={onContentMouseDown}>
          {/* Prefix */}
          {prefixComp.value && (
            <div
              class={classnames(
                `${prefixCls.value}-prefix`,
                contextConfig.value.classNames.prefix,
                classNames.prefix,
              )}
              style={{ ...contextConfig.value.styles.prefix, ...styles.prefix }}
            >
              {prefixComp.value}
            </div>
          )}

          {/* Input */}
          <InputTextArea
            {...inputProps.value}
            disabled={disabled}
            style={{ ...contextConfig.value.styles.input, ...styles.input }}
            class={classnames(inputCls.value, contextConfig.value.classNames.input, classNames.input)}
            autoSize={autoSize}
            value={innerValue.value}
            onChange={(event: Event) => {
              triggerValueChange(
                (event.target as HTMLTextAreaElement).value,
                event as ChangeEvent,
              );
              triggerSpeech(true);
            }}
            onPressEnter={onInternalKeyPress}
            onCompositionstart={onInternalCompositionStart}
            onCompositionend={onInternalCompositionEnd}
            onKeydown={onKeyDown}
            placeholder={placeholder}
            // @ts-expect-error
            onPaste={onInternalPaste}
            bordered={false}
            readOnly={readOnly}
          />

          {/* Action List */}
          {actionNode.value && (<div
            class={classnames(
              actionListCls.value,
              contextConfig.value.classNames.actions,
              classNames.actions,
            )}
            style={{ ...contextConfig.value.styles.actions, ...styles.actions }}
          >
            {actionNode.value}
          </div>)}
        </div>
        {footerNode.value && (
          <div
            class={classnames(
              `${prefixCls.value}-footer`,
              contextConfig.value.classNames.footer,
              classNames.footer,
            )}
            style={{
              ...contextConfig.value.styles.footer,
              ...styles.footer,
            }}
          >
            {footerNode.value}
          </div>
        )}
      </ActionButtonContextProvider>
    </div>,
  );
});

defineExpose({
  nativeElement: containerRef.value,
  // @ts-expect-error
  focus: (opt: any) => inputRef.value?.focus(opt),
  // @ts-expect-error
  blur: () => inputRef.value?.blur(),
});
</script>
