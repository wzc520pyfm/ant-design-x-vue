<script setup lang="tsx">
import { Dropdown, Input, Menu } from 'ant-design-vue';
import { CaretDownFilled } from '@ant-design/icons-vue';
import classnames from 'classnames';
import pickAttrs from '../_util/pick-attrs';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import { useXProviderContext } from '../x-provider';
import { useSenderContextInject } from './context';
import useGetState from './hooks/use-get-state';
import useInputHeight from './hooks/use-input-height';
import type { EventType, insertPosition, SkillType, SlotConfigType, SlotTextAreaRef } from './interface';
import { computed, nextTick, onMounted, ref, Teleport, watch, type VNode } from 'vue';
import Skill from './components/Skill.vue';

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
const skillDomRef = ref<HTMLSpanElement | null>(null);
const skillRef = ref<SkillType | null>(null);
const skillPlaceholders = ref<VNode | null>(null);

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

const buildSkillSpan = (key: string) => {
  const span = document.createElement('span');
  span.setAttribute('contenteditable', 'false');
  span.dataset.skillKey = key;
  span.dataset.placeholder = String(senderContext.value.placeholder ?? '');
  span.className = `${prefixCls.value}-skill`;
  return span;
};

const buildEditSlotSpan = (key: string) => {
  const span = document.createElement('span');
  span.setAttribute('contenteditable', 'true');
  span.dataset.slotKey = key;
  span.className = classnames(`${prefixCls.value}-slot`, `${prefixCls.value}-slot-content`);
  return span;
};

const buildSpaceSpan = (slotKey: string, positions: 'before' | 'after') => {
  const span = document.createElement('span');
  span.setAttribute('contenteditable', 'false');
  span.dataset.slotKey = slotKey;
  span.dataset.nodeType = 'nbsp';
  span.className = classnames(
    `${prefixCls.value}-slot-${positions}`,
    `${prefixCls.value}-slot-no-width`,
  );
  span.textContent = ' ';
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
    if (el.dataset?.skillKey) {
      return '';
    }
    if (el.dataset?.nodeType === 'nbsp') {
      return '';
    }
    const slotKey = el.getAttribute('data-slot-key');
    if (slotKey) {
      const nodeConfig = slotConfigMap.get(slotKey);
      if (nodeConfig?.type === 'content') {
        const text = el.textContent || '';
        return nodeConfig.formatResult?.(text) || text;
      }
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
  slotConfig: (SlotConfigType & { value: string })[];
  skill?: SkillType;
} => {
  const emptyRes = {
    value: '',
    config: [] as (SlotConfigType & { value: string })[],
    slotConfig: [] as (SlotConfigType & { value: string })[],
    skill: undefined as SkillType | undefined,
  };
  const editableDom = editableRef.value;
  if (!editableDom) {
    return emptyRes;
  }
  const childNodes = editableDom.childNodes;
  if (childNodes.length === 0) {
    editableDom.innerHTML = '';
    skillDomRef.value = null;
    return emptyRes;
  }

  const result: string[] = [];
  const currentConfig: (SlotConfigType & { value: string })[] = [];
  let currentSkill: SkillType | undefined;
  const hasSkill = !!senderContext.value.skill;

  childNodes.forEach((node) => {
    const textValue = getNodeTextValue(node, getSlotValues());
    result.push(textValue);
    if (node.nodeType === Node.TEXT_NODE) {
      if (textValue) {
        currentConfig.push({
          type: 'text',
          value: textValue,
        });
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const skillKey = el.dataset?.skillKey;
      const slotKey = el.getAttribute('data-slot-key');
      const nodeType = el.dataset?.nodeType;
      if (skillKey && hasSkill) {
        currentSkill = senderContext.value.skill;
        skillDomRef.value = el as HTMLSpanElement;
      }
      if (slotKey && nodeType !== 'nbsp') {
        const nodeConfig = slotConfigMap.get(slotKey);
        if (nodeConfig) {
          currentConfig.push({ ...nodeConfig, value: textValue });
        }
      }
    }
  });

  if (!currentSkill) {
    skillDomRef.value = null;
  }

  return {
    value: result.join(''),
    config: currentConfig,
    slotConfig: currentConfig,
    skill: currentSkill,
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
    senderContext.value.onChange?.(newValue.value, e, newValue.config, newValue.skill);
  }
};

const renderSlot = (node: SlotConfigType, slotSpan: HTMLSpanElement): VNode => {
  if (!node.key) return null as any;
  const value = getSlotValues()[node.key];
  const renderContent = (): VNode => {
    switch (node.type) {
      case 'content':
        slotSpan.innerHTML = value || '';
        slotSpan.setAttribute('data-placeholder', node.props?.placeholder || '');
        return null as any;
      case 'input':
        return (
          <Input
            {...({
              readonly: senderContext.value.readOnly,
              class: `${prefixCls.value}-slot-input`,
              placeholder: node.props?.placeholder || '',
              'data-slot-input': node.key,
              size: 'small',
              bordered: false,
              value: value || '',
              tabindex: 0,
              spellcheck: false,
              onChange: (e: Event) => {
                updateSlot(node.key as string, (e.target as HTMLInputElement).value, e as EventType);
              },
            } as any)}
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
                <Menu
                  items={node.props?.options?.map((opt: any) => ({
                    label: opt,
                    key: opt,
                  }))}
                  selectedKeys={value ? [value] : []}
                  selectable
                  onSelect={({ key, domEvent }: { key: string | number; domEvent: Event }) => {
                    updateSlot(node.key as string, String(key), domEvent as EventType);
                  }}
                />
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
      return nodeList;
    }
    if (config.key) {
      const slotKey = config.key;
      let slotDom: HTMLSpanElement;
      let nodes: HTMLSpanElement[];
      if (config.type === 'content') {
        slotDom = buildEditSlotSpan(slotKey);
        const before = buildSpaceSpan(slotKey, 'before');
        const after = buildSpaceSpan(slotKey, 'after');
        saveSlotDom(`${slotKey}_before`, before);
        saveSlotDom(slotKey, slotDom);
        saveSlotDom(`${slotKey}_after`, after);
        nodes = [before, slotDom, after];
      } else {
        slotDom = buildSlotSpan(slotKey);
        saveSlotDom(slotKey, slotDom);
        nodes = [slotDom];
      }
      const reactNode = renderSlot(config, slotDom);
      if (reactNode || config.type === 'content') {
        if (reactNode) {
          slotPlaceholders.value.set(slotKey, reactNode);
        }
        nodeList.push(...nodes);
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
        senderContext.value.onSubmit?.(result.value, result.config, result.skill);
      }
      break;
    case 'shiftEnter':
      if (e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
        keyLockRef.value = true;
        e.preventDefault();
        const result = getEditorValue();
        senderContext.value.onSubmit?.(result.value, result.config, result.skill);
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

const syncSkillEmptyState = (newValue: ReturnType<typeof getEditorValue>) => {
  if (skillDomRef.value) {
    if (!newValue.value && newValue.config.length === 0 && senderContext.value.placeholder) {
      skillDomRef.value.setAttribute('contenteditable', 'true');
      skillDomRef.value.classList.add(`${prefixCls.value}-skill-empty`);
    } else {
      skillDomRef.value.setAttribute('contenteditable', 'false');
      skillDomRef.value.classList.remove(`${prefixCls.value}-skill-empty`);
    }
  }
};

const onInternalInput = () => {
  const newValue = getEditorValue();
  removeSpecificBRs(editableRef.value);
  syncSkillEmptyState(newValue);
  senderContext.value.onChange?.(
    newValue.value,
    undefined,
    newValue.config,
    newValue.skill,
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

const removeSkill = (isChange = true) => {
  const editableDom = editableRef.value;
  if (!editableDom || !skillDomRef.value) return;
  skillDomRef.value.remove();
  skillDomRef.value = null;
  skillRef.value = null;
  skillPlaceholders.value = null;
  if (isChange) {
    onInternalInput();
  }
};

const insertSkill = () => {
  const skill = senderContext.value.skill;
  if (skill && skillRef.value !== skill) {
    removeSkill(false);
    skillRef.value = skill;
    const skillSpan = buildSkillSpan(skill.value);
    const reactNode = (
      <Teleport to={skillSpan}>
        <Skill
          removeSkill={() => removeSkill(true)}
          prefixCls={prefixCls.value}
          {...skill}
        />
      </Teleport>
    );
    skillPlaceholders.value = reactNode;
    const editableDom = editableRef.value;
    if (!editableDom) return;
    const range = document.createRange();
    range.setStart(editableDom, 0);
    range.insertNode(skillSpan);
    skillDomRef.value = skillSpan;
    onInternalInput();
  }
};

const clear = () => {
  const div = editableRef.value;
  if (!div) return;
  div.innerHTML = '';
  skillDomRef.value = null;
  skillRef.value = null;
  skillPlaceholders.value = null;
  setSlotValues({});
  onInternalInput();
};

const renderSlotsAndSkill = () => {
  const editableDom = editableRef.value;
  if (!editableDom) return;
  editableDom.innerHTML = '';
  slotDomMap.value?.clear();
  slotPlaceholders.value = new Map();
  skillDomRef.value = null;
  skillRef.value = null;
  skillPlaceholders.value = null;

  if (slotConfigRef.value.length) {
    const slotNodeList = getSlotListNode(slotConfigRef.value);
    slotNodeList.forEach((element) => {
      editableDom.appendChild(element);
    });
  }
  insertSkill();
  const result = getEditorValue();
  senderContext.value.onChange?.(result.value, undefined, result.config, result.skill);
};

// ============================ Effects =============================
watch(
  () => senderContext.value.slotConfig,
  (val) => {
    slotConfigRef.value = [...(val || [])];
    if (!editableRef.value) return;
    // Allow empty slotConfig when skill-only mode
    if (!slotConfigRef.value.length && !senderContext.value.skill?.value) {
      return;
    }
    renderSlotsAndSkill();
  },
);

watch(
  () => senderContext.value.skill,
  () => {
    if (!editableRef.value) return;
    if (!senderContext.value.skill) {
      removeSkill(true);
      return;
    }
    insertSkill();
  },
);

onMounted(() => {
  nextTick(() => {
    if ((slotConfigRef.value.length || senderContext.value.skill?.value) && editableRef.value) {
      renderSlotsAndSkill();
    }
  });
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
        {skillPlaceholders.value}
      </div>
    </>
  );
});
</script>
