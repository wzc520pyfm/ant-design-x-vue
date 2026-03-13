<script setup lang="tsx">
import { Input } from 'ant-design-vue';
import classnames from 'classnames';
import pickAttrs from '../_util/pick-attrs';
import getValue from '../_util/getValue';
import { useSenderContextInject } from './context';
import { ref } from 'vue';
import type { SenderComponents, insertPosition } from './interface';

defineOptions({ name: 'AXSenderTextArea' });

function getComponent(
  components: SenderComponents | undefined,
  path: string[],
  defaultComponent: typeof Input.TextArea,
): typeof Input.TextArea {
  return getValue(components, path) || defaultComponent;
}

const senderContext = useSenderContextInject();

const inputRef = ref<any>(null);

const insert = (insertValue: string, positions: insertPosition = 'cursor') => {
  const textArea = (inputRef.value as any)?.resizableTextArea?.textArea;
  if (!textArea) return;
  const currentText = textArea.value;
  let startPos = currentText.length;
  let endPos = currentText.length;
  if (positions === 'cursor') {
    startPos = textArea?.selectionStart;
    endPos = textArea?.selectionEnd;
  }
  if (positions === 'start') {
    startPos = 0;
    endPos = 0;
  }

  textArea.value =
    currentText.substring(0, startPos) +
    insertValue +
    currentText.substring(endPos, currentText.length);

  textArea.selectionStart = startPos + insertValue.length;
  textArea.selectionEnd = startPos + insertValue.length;

  textArea.focus();

  senderContext.value.onChange?.(textArea.value);
};

const clear = () => {
  senderContext.value.onChange?.('');
};

const getValueFn = () => {
  return { value: senderContext.value.value || '', config: [] };
};

// ============================ Submit ============================
const isCompositionRef = ref(false);

const onInternalCompositionStart = () => {
  isCompositionRef.value = true;
};

const onInternalCompositionEnd = () => {
  isCompositionRef.value = false;
};

const onInternalKeyDown = (e: KeyboardEvent) => {
  const canSubmit = e.key === 'Enter';
  const submitType = senderContext.value.submitType || 'enter';

  if (isCompositionRef.value || !canSubmit) {
    senderContext.value.onKeyDown?.(e);
    return;
  }

  switch (submitType) {
    case 'enter':
      if (!e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
        e.preventDefault();
        senderContext.value.onSubmit?.(senderContext.value.value || '');
      }
      break;

    case 'shiftEnter':
      if (e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
        e.preventDefault();
        senderContext.value.onSubmit?.(senderContext.value.value || '');
      }
      break;
  }

  senderContext.value.onKeyDown?.(e);
};

// ============================ Paste =============================
const onInternalPaste = (e: ClipboardEvent) => {
  const files = e.clipboardData?.files;
  const text = e.clipboardData?.getData('text/plain');
  if (!text && files?.length && senderContext.value.onPasteFile) {
    senderContext.value.onPasteFile(files);
    e.preventDefault();
  }

  senderContext.value.onPaste?.(e);
};

const InputTextArea = getComponent(senderContext.value.components, ['input'], Input.TextArea);

const mergeOnChange = (event: Event) => {
  senderContext.value.onChange?.(
    (event.target as HTMLTextAreaElement).value,
    event,
  );
};

defineExpose({
  nativeElement: inputRef,
  focus: (options?: any) => inputRef.value?.focus(options),
  blur: () => inputRef.value?.blur(),
  insert,
  clear,
  getValue: getValueFn,
});

defineRender(() => {
  const ctx = senderContext.value;
  const domProps = pickAttrs(ctx, {
    aria: true,
    data: true,
  });

  return (
    <InputTextArea
      {...domProps}
      ref={inputRef}
      disabled={ctx.disabled}
      style={ctx.styles?.input}
      class={classnames(`${ctx.prefixCls}-input`, ctx.classNames?.input)}
      autoSize={ctx.autoSize}
      value={ctx.value}
      onChange={mergeOnChange}
      onKeyup={ctx.onKeyUp}
      onCompositionstart={onInternalCompositionStart}
      onCompositionend={onInternalCompositionEnd}
      onKeydown={onInternalKeyDown}
      onPaste={onInternalPaste}
      bordered={false}
      readOnly={ctx.readOnly}
      placeholder={ctx.placeholder}
      onFocus={ctx.onFocus}
      onBlur={ctx.onBlur}
    />
  );
});
</script>
