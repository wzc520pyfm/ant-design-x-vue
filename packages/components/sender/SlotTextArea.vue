<script setup lang="tsx">
import { Dropdown, Input } from 'ant-design-vue';
import { CaretDownFilled } from '@ant-design/icons-vue';
import classnames from 'classnames';
import pickAttrs from '../_util/pick-attrs';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import { useXProviderContext } from '../x-provider';
import { useSenderContextInject } from './context';
import useGetState from './hooks/use-get-state';
import useInputHeight from './hooks/use-input-height';
import type { EventType, insertPosition, SlotConfigType, SlotTextAreaRef } from './interface';
import { computed, onMounted, ref, Teleport, watch, type VNode } from 'vue';

defineOptions({ name: 'AXSenderSlotTextArea' });

const senderContext = useSenderContextInject();

const slotConfigRef = ref<SlotConfigType[]>([...(senderContext.value.slotConfig || [])]);

// ============================= MISC =============================
const { direction, getPrefixCls } = useXProviderContext();
const prefixCls = computed(() => `${getPrefixCls('sender', senderContext.value.prefixCls)}`);
const contextConfig = useXComponentConfig('sender');
const inputCls = computed(() => `${prefixCls.value}-input`);

// ============================ Style =============================
const mergeStyle = computed(() => ({
  ...contextConfig.value.styles?.input,
  ...senderContext.value.styles?.input,
}));
const inputHeightStyle = computed(() =>
  useInputHeight(mergeStyle.value, senderContext.value.autoSize),
);

// ============================ Refs =============================
const editableRef = ref<HTMLDivElement>();
const slotDomMap = ref<Map<string, HTMLSpanElement>>(new Map());
const isCompositionRef = ref(false);
const keyLockRef = ref(false);
const lastSelectionRef = ref<Range | null>(null);

// ============================ State =============================
const slotConfigComputed = computed(() => slotConfigRef.value);
const [slotConfigMap, getSlotValues, setSlotValues] = useGetState(slotConfigComputed);
const slotPlaceholders = ref<Map<string, VNode>>(new Map());

// ============================ Methods =============================
const buildSlotSpan = (key: string) => {
  const span = document.createElement('span');
  span.setAttribute('contenteditable', 'false');
  span.dataset.slotKey = key;
  span.className = `${prefixCls.value}-slot`;
  return span;
};

const saveSlotDom = (key: string, dom: HTMLSpanElement) => {
  slotDomMap.value.set(key, dom);
};

const getSlotDom = (key: string) => {
  return slotDomMap.value.get(key);
};

const getNodeTextValue = (node: Node, currentValues: Record<string, any>): string => {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent || '';
  }
  if (node.nodeType === Node.ELEMENT_NODE) {
    const el = node as HTMLElement;
    const slotKey = el.getAttribute('data-slot-key');
    if (slotKey) {
      const nodeConfig = slotConfigMap.get(slotKey);
      const slotValue = currentValues[slotKey] || '';
      const tagValue =
        nodeConfig?.type === 'tag' && nodeConfig.props?.value ? nodeConfig.props.value : null;
      const slotResult = nodeConfig?.formatResult?.(slotValue) || tagValue || slotValue;
      return slotResult;
    }
    return el?.innerText || '';
  }
  return '';
};

const getEditorValue = (): {
  value: string;
  config: (SlotConfigType & { value: string })[];
} => {
  const result: string[] = [];
  const currentConfig: (SlotConfigType & { value: string })[] = [];
  editableRef.value?.childNodes.forEach((node) => {
    const textValue = getNodeTextValue(node, getSlotValues());
    if (node.nodeType === Node.TEXT_NODE) {
      result.push(textValue);
      currentConfig.push({
        type: 'text',
        value: textValue,
      });
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const slotKey = el.getAttribute('data-slot-key');
      if (slotKey) {
        const nodeConfig = slotConfigMap.get(slotKey);
        result.push(textValue);
        if (nodeConfig) {
          currentConfig.push({ ...nodeConfig, value: textValue });
        }
      }
    }
  });
  if (!result.length) {
    const div = editableRef.value;
    if (div) {
      div.innerHTML = '';
    }
  }
  return {
    value: result.join(''),
    config: currentConfig,
  };
};

const updateSlot = (key: string, value: any, e?: EventType) => {
  const slotDom = getSlotDom(key);
  const node = slotConfigRef.value?.find((item) => item.key === key);
  setSlotValues((prev) => ({ ...prev, [key]: value }));
  if (slotDom && node) {
    const newReactNode = renderSlot(node, slotDom);
    slotPlaceholders.value.set(key, newReactNode);
    slotPlaceholders.value = new Map(slotPlaceholders.value);

    const newValue = getEditorValue();
    senderContext.value.onChange?.(newValue.value, e, newValue.config);
  }
};

const renderSlot = (node: SlotConfigType, slotSpan: HTMLSpanElement): VNode => {
  if (!node.key) return null as any;
  const value = getSlotValues()[node.key];
  const renderContent = (): VNode => {
    switch (node.type) {
      case 'input':
        return (
          <Input
            readonly={senderContext.value.readOnly}
            class={`${prefixCls.value}-slot-input`}
            placeholder={node.props?.placeholder || ''}
            data-slot-input={node.key}
            size="small"
            bordered={false}
            value={value || ''}
            tabindex={0}
            onChange={(e: Event) => {
              updateSlot(node.key as string, (e.target as HTMLInputElement).value, e as EventType);
            }}
            spellcheck={false}
          />
        );
      case 'select':
        return (
          <Dropdown
            disabled={senderContext.value.readOnly}
            trigger={['click']}
            v-slots={{
              default: () => (
                <span
                  class={classnames(`${prefixCls.value}-slot-select`, {
                    placeholder: !value,
                    [`${prefixCls.value}-slot-select-selector-value`]: value,
                  })}
                >
                  <span
                    data-placeholder={node.props?.placeholder}
                    class={`${prefixCls.value}-slot-select-value`}
                  >
                    {value || ''}
                  </span>
                  <span class={`${prefixCls.value}-slot-select-arrow`}>
                    <CaretDownFilled />
                  </span>
                </span>
              ),
              overlay: () => (
                <div class={`${prefixCls.value}-slot-select-dropdown`}>
                  {node.props?.options?.map((opt: string) => (
                    <div
                      key={opt}
                      class={classnames({
                        active: value === opt,
                      })}
                      onClick={() => {
                        updateSlot(node.key as string, opt);
                      }}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              ),
            }}
          />
        );
      case 'tag':
        return <div class={`${prefixCls.value}-slot-tag`}>{node.props?.label || ''}</div>;
      case 'custom':
        return node.customRender?.(
          value,
          (value: any) => {
            updateSlot(node.key as string, value);
          },
          { disabled: senderContext.value.disabled, readOnly: senderContext.value.readOnly },
          node,
        ) as VNode;
      default:
        return null as any;
    }
  };

  return (
    <Teleport to={slotSpan}>
      {renderContent()}
    </Teleport>
  );
};

type SlotNode = Text | Document | HTMLSpanElement;

const getSlotListNode = (slotConfig: SlotConfigType[]): SlotNode[] => {
  return slotConfig.reduce((nodeList, config) => {
    if (config.type === 'text') {
      nodeList.push(document.createTextNode(config.value || ''));
    }
    if (config.key) {
      const slotKey = config.key;
      const slotSpan = buildSlotSpan(slotKey);
      saveSlotDom(config.key, slotSpan);
      if (slotSpan) {
        const reactNode = renderSlot(config, slotSpan);
        if (reactNode) {
          slotPlaceholders.value.set(slotKey, reactNode);
          nodeList.push(slotSpan);
        }
      }
    }
    return nodeList;
  }, [] as SlotNode[]);
};

// ============================ Insert Position ============================
const getInsertPosition = (
  position: insertPosition,
): {
  type: 'box' | 'slot' | 'end' | 'start';
  range?: Range;
} => {
  const selection = window?.getSelection?.();
  const editableDom = editableRef.value;
  if (position === 'end' || !selection) {
    return { type: 'end' };
  }
  if (position === 'start') {
    return { type: 'start' };
  }
  const currentRange = selection?.rangeCount > 0 ? selection?.getRangeAt?.(0) : null;
  const range = lastSelectionRef.value || currentRange;
  if (range) {
    if ((range.endContainer as HTMLElement)?.className?.includes(`${prefixCls.value}-slot`)) {
      return { type: 'slot', range };
    }
    if (range.endContainer === editableDom || range.endContainer.parentElement === editableDom) {
      return { range, type: 'box' };
    }
  }
  return { type: 'end' };
};

// ============================ Events =============================
const onInternalCompositionStart = () => {
  isCompositionRef.value = true;
};

const onInternalCompositionEnd = () => {
  isCompositionRef.value = false;
  keyLockRef.value = false;
};

const onInternalKeyDown = (e: KeyboardEvent) => {
  const canSubmit = e.key === 'Enter';
  const submitType = senderContext.value.submitType || 'enter';

  if (keyLockRef.value || isCompositionRef.value || !canSubmit) {
    senderContext.value.onKeyDown?.(e);
    return;
  }

  switch (submitType) {
    case 'enter':
      if (!e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
        keyLockRef.value = true;
        e.preventDefault();
        const result = getEditorValue();
        senderContext.value.onSubmit?.(result.value, result.config);
      }
      break;
    case 'shiftEnter':
      if (e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
        keyLockRef.value = true;
        e.preventDefault();
        const result = getEditorValue();
        senderContext.value.onSubmit?.(result.value, result.config);
      }
      break;
  }
  senderContext.value.onKeyDown?.(e);
};

const onInternalKeyUp = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    keyLockRef.value = false;
  }
  senderContext.value.onKeyUp?.(e);
};

const onInternalPaste = (e: ClipboardEvent) => {
  e.preventDefault();
  const files = e.clipboardData?.files;
  const text = e.clipboardData?.getData('text/plain');
  if (!text && files?.length && senderContext.value.onPasteFile) {
    senderContext.value.onPasteFile(files);
    return;
  }

  if (text) {
    insert([{ type: 'text', value: text.replace(/\n/g, '') }]);
  }

  senderContext.value.onPaste?.(e);
};

const onInternalFocus = (e: FocusEvent) => {
  const selection = window.getSelection();
  if (selection && editableRef.value) {
    const range = document.createRange();
    range.selectNodeContents(editableRef.value);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  senderContext.value.onFocus?.(e);
};

const onInternalBlur = (e: FocusEvent) => {
  if (keyLockRef.value) {
    keyLockRef.value = false;
  }
  const selection = window.getSelection();

  if (selection) {
    lastSelectionRef.value = selection.rangeCount ? selection?.getRangeAt?.(0) : null;
  }

  const timer = setTimeout(() => {
    lastSelectionRef.value = null;
    clearTimeout(timer);
  }, 200);

  senderContext.value.onBlur?.(e);
};

const removeSpecificBRs = (element: HTMLDivElement | null | undefined) => {
  const submitType = senderContext.value.submitType || 'enter';
  if (submitType === 'enter') {
    const brElements = element?.querySelectorAll('br');
    brElements?.forEach((br) => {
      br.remove();
    });
  }
};

const onInternalInput = () => {
  const newValue = getEditorValue();
  removeSpecificBRs(editableRef.value);
  senderContext.value.onChange?.(
    newValue.value,
    undefined,
    newValue.config,
  );
};

// ============================ Ref Method ============================
const insert: SlotTextAreaRef['insert'] = (
  slotConfig,
  position = 'cursor',
  replaceCharacters?: string,
) => {
  const editableDom = editableRef.value;
  const selection = window.getSelection();
  if (!editableDom || !selection) return;
  const slotNode = getSlotListNode(slotConfig);
  const { type, range: lastRange } = getInsertPosition(position);
  let range: Range = document.createRange();
  slotConfigRef.value = [...slotConfigRef.value, ...slotConfig];
  setSlotValues(slotConfig as any);

  if (type === 'end') {
    selection.removeAllRanges();
    selection.addRange(range);
    range.setStart(editableDom, editableDom.childNodes.length);
  }
  if (type === 'start') {
    range.setStart(editableDom, 0);
  }
  if (type === 'box') {
    range = lastRange as Range;
  }
  if (type === 'slot') {
    range = selection?.getRangeAt?.(0);
    if (selection?.focusNode?.nextSibling) {
      range.setStartBefore(selection.focusNode.nextSibling);
    }
  }
  const startOffset = range.startOffset;
  const container = range.startContainer;

  if (replaceCharacters?.length) {
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(editableDom);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    preCaretRange.setStart(editableDom, 0);
    const textBeforeCursor = preCaretRange.toString();
    const cursorPosition = textBeforeCursor.length;

    if (cursorPosition >= replaceCharacters.length) {
      if (textBeforeCursor.endsWith(replaceCharacters)) {
        range.setStart(container, startOffset - replaceCharacters.length);
        range.setEnd(container, startOffset);
        range.deleteContents();
      }
    }
  }
  slotNode.forEach((node) => {
    range.insertNode(node);
    range.setStartAfter(node);
    range = range.cloneRange();
  });

  editableDom.focus();
  selection.removeAllRanges();
  selection.addRange(range);
  range.collapse(false);
  const timer = setTimeout(() => {
    onInternalInput();
    clearTimeout(timer);
  }, 0);
};

type SlotFocusOptions = {
  preventScroll?: boolean;
  cursor?: 'slot';
  key?: string;
};

type InputFocusOptions = {
  preventScroll?: boolean;
  cursor?: 'start' | 'end' | 'all';
};

type CombinedFocusOptions = SlotFocusOptions | InputFocusOptions;

const focus = (options?: CombinedFocusOptions) => {
  if (options && 'cursor' in options && options.cursor === 'slot') {
    let inputDom: HTMLInputElement | null = null;
    const slotOpts = options as SlotFocusOptions;
    if (slotOpts.key) {
      if (
        slotDomMap.value.has(slotOpts.key) &&
        (slotDomMap.value.get(slotOpts.key) as HTMLSpanElement).querySelector('input')
      ) {
        inputDom = (slotDomMap.value.get(slotOpts.key) as HTMLSpanElement).querySelector('input');
      }
    } else {
      for (const node of Array.from(editableRef.value?.childNodes || [])) {
        if (node.nodeType === Node.ELEMENT_NODE && (node as Element).querySelector('input')) {
          inputDom = (node as Element).querySelector('input');
          break;
        }
      }
    }
    if (inputDom) {
      inputDom?.focus();
      return;
    }
  }
  const editor = editableRef.value;
  if (options && 'cursor' in options && editor) {
    editor.focus();
    const selection = window.getSelection();
    if (!selection) return;
    const range = document.createRange();
    range.selectNodeContents(editor);
    switch ((options as InputFocusOptions)?.cursor) {
      case 'start': {
        range.collapse(true);
        break;
      }
      case 'all': {
        break;
      }
      default: {
        range.collapse(false);
        break;
      }
    }
    selection.removeAllRanges();
    selection.addRange(range);
  }
};

const clear = () => {
  const div = editableRef.value;
  if (!div) return;
  div.innerHTML = '';
  setSlotValues({});
  onInternalInput();
};

// ============================ Effects =============================
watch(() => senderContext.value.slotConfig, (val) => {
  slotConfigRef.value = [...(val || [])];
  if (slotConfigRef.value.length === 0) return;
  if (editableRef.value && slotConfigRef.value) {
    editableRef.value.innerHTML = '';
    slotDomMap.value?.clear();
    const slotNodeList = getSlotListNode(slotConfigRef.value);
    slotNodeList.forEach((element) => {
      editableRef.value?.appendChild(element);
    });
    senderContext.value.onChange?.(getEditorValue().value, undefined, getEditorValue().config);
  }
});

onMounted(() => {
  if (slotConfigRef.value.length && editableRef.value) {
    slotDomMap.value?.clear();
    const slotNodeList = getSlotListNode(slotConfigRef.value);
    slotNodeList.forEach((element) => {
      editableRef.value?.appendChild(element);
    });
  }
});

defineExpose({
  nativeElement: editableRef,
  focus,
  blur: () => editableRef.value?.blur(),
  insert,
  clear,
  getValue: () => getEditorValue(),
});

defineRender(() => {
  const ctx = senderContext.value;
  const domProps = pickAttrs(ctx, {
    attr: true,
    aria: true,
    data: true,
  });

  return (
    <>
      <div
        {...domProps}
        ref={editableRef}
        role="textbox"
        tabindex={0}
        style={{ ...mergeStyle.value, ...inputHeightStyle.value }}
        class={classnames(
          inputCls.value,
          `${inputCls.value}-slot`,
          contextConfig.value.classNames?.input,
          ctx.classNames?.input,
          {
            [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
          },
        )}
        data-placeholder={ctx.placeholder}
        contenteditable={!ctx.readOnly}
        spellcheck={false}
        onKeydown={onInternalKeyDown}
        onKeyup={onInternalKeyUp}
        onPaste={onInternalPaste}
        onCompositionstart={onInternalCompositionStart}
        onCompositionend={onInternalCompositionEnd}
        onFocus={onInternalFocus}
        onBlur={onInternalBlur}
        onInput={onInternalInput}
      />
      <div
        style={{ display: 'none' }}
        id={`${prefixCls.value}-slot-placeholders`}
      >
        {Array.from(slotPlaceholders.value.values())}
      </div>
    </>
  );
});
</script>
