<script setup lang="tsx">
import classnames from 'classnames';
import { computed, onBeforeUnmount, ref, useSlots, type CSSProperties } from 'vue';

defineOptions({ name: 'AXFolderSplitter', inheritAttrs: false });

const HANDLE_WIDTH = 6;

const props = withDefaults(
  defineProps<{
    prefixCls: string;
    defaultSize?: number | string;
    minStart?: number;
    minEnd?: number;
    rtl?: boolean;
    class?: string;
    className?: string;
  }>(),
  {
    defaultSize: 278,
    minStart: 80,
    minEnd: 120,
    rtl: false,
  },
);

const emit = defineEmits<{
  resize: [size: number];
}>();

const slots = useSlots();
const rootRef = ref<HTMLDivElement>();
const startPaneRef = ref<HTMLDivElement>();
const sizePx = ref<number | null>(null);
const dragging = ref(false);

let dragOriginX = 0;
let dragOriginSize = 0;

const toCssSize = (value: number | string): string => {
  if (typeof value === 'number') return `${value}px`;
  const trimmed = String(value).trim();
  if (/^\d+(\.\d+)?$/.test(trimmed)) return `${trimmed}px`;
  return trimmed;
};

const fallbackSize = (): number => {
  if (typeof props.defaultSize === 'number' && Number.isFinite(props.defaultSize)) {
    return props.defaultSize;
  }
  const parsed = parseFloat(String(props.defaultSize));
  return Number.isFinite(parsed) ? parsed : 278;
};

const measureCurrentSize = (): number => {
  if (sizePx.value != null) return sizePx.value;
  const measured = startPaneRef.value?.getBoundingClientRect().width ?? 0;
  return measured > 0 ? measured : fallbackSize();
};

const clampSize = (size: number): number => {
  const total = rootRef.value?.getBoundingClientRect().width ?? 0;
  const minStart = Math.max(0, props.minStart);
  if (total <= 0) return Math.max(size, minStart);
  const maxStart = Math.max(minStart, total - HANDLE_WIDTH - Math.max(0, props.minEnd));
  return Math.min(Math.max(size, minStart), maxStart);
};

const applySize = (size: number) => {
  const next = clampSize(size);
  sizePx.value = next;
  emit('resize', next);
};

const unbindDrag = () => {
  window.removeEventListener('pointermove', onPointerMove);
  window.removeEventListener('pointerup', onPointerUp);
  window.removeEventListener('pointercancel', onPointerUp);
  window.removeEventListener('mousemove', onPointerMove);
  window.removeEventListener('mouseup', onPointerUp);
};

const onPointerMove = (event: PointerEvent | MouseEvent) => {
  if (!dragging.value) return;
  const delta = event.clientX - dragOriginX;
  const signed = props.rtl ? -delta : delta;
  applySize(dragOriginSize + signed);
};

const onPointerUp = () => {
  if (!dragging.value) return;
  dragging.value = false;
  unbindDrag();
};

const onPointerDown = (event: PointerEvent | MouseEvent) => {
  if ('button' in event && event.button != null && event.button !== 0) return;
  event.preventDefault();
  dragging.value = true;
  dragOriginX = event.clientX;
  dragOriginSize = measureCurrentSize();
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('pointercancel', onPointerUp);
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', onPointerUp);
};

const onKeydown = (event: KeyboardEvent) => {
  const step = event.shiftKey ? 32 : 8;
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    const dir = event.key === 'ArrowLeft' ? -1 : 1;
    const signed = props.rtl ? -dir : dir;
    applySize(measureCurrentSize() + signed * step);
  } else if (event.key === 'Home') {
    event.preventDefault();
    applySize(props.minStart);
  } else if (event.key === 'End') {
    event.preventDefault();
    const total = rootRef.value?.getBoundingClientRect().width ?? 0;
    applySize(total > 0 ? total - HANDLE_WIDTH - props.minEnd : measureCurrentSize());
  }
};

onBeforeUnmount(unbindDrag);

const startPaneStyle = computed<CSSProperties>(() => ({
  width: sizePx.value != null ? `${sizePx.value}px` : toCssSize(props.defaultSize),
  flex: 'none',
}));

const currentAriaValue = computed(() => Math.round(sizePx.value ?? fallbackSize()));

defineRender(() => (
  <div
    ref={rootRef}
    class={classnames(
      `${props.prefixCls}-splitter`,
      props.class,
      props.className,
      dragging.value && `${props.prefixCls}-splitter-dragging`,
    )}
  >
    <div
      ref={startPaneRef}
      class={`${props.prefixCls}-splitter-start`}
      style={startPaneStyle.value}
    >
      {slots.start?.()}
    </div>
    <div
      class={classnames(
        `${props.prefixCls}-splitter-bar`,
        dragging.value && `${props.prefixCls}-splitter-bar-active`,
      )}
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize panes"
      aria-valuenow={currentAriaValue.value}
      aria-valuemin={props.minStart}
      tabindex={0}
      onPointerdown={onPointerDown}
      onMousedown={onPointerDown}
      onKeydown={onKeydown}
    />
    <div class={`${props.prefixCls}-splitter-end`}>{slots.end?.()}</div>
  </div>
));
</script>
