<script setup lang="ts">
import {
  computed,
  h,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  watch,
  type CSSProperties,
  type VNode,
} from 'vue';
import classnames from 'classnames';
import throttle from 'lodash.throttle';
import { message, Segmented } from 'ant-design-vue';
import {
  CopyOutlined,
  DownloadOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from '@ant-design/icons-vue';
import { useLocale, useXProviderContext, Actions } from '@ant-design-x-vue/components';
import mermaid from 'mermaid';

defineOptions({ name: 'AXMermaid' });

type SemanticType = 'root' | 'header' | 'graph' | 'code';

interface Props {
  children?: string;
  header?: VNode | null;
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
  classNames?: Partial<Record<SemanticType, string>>;
  styles?: Partial<Record<SemanticType, CSSProperties>>;
}

const props = defineProps<Props>();

enum RenderType {
  Code = 'code',
  Image = 'image',
}

let uuidSeq = 0;

mermaid.initialize({
  startOnLoad: false,
  securityLevel: 'strict',
  theme: 'default',
  fontFamily: 'monospace',
});

const [contextLocale] = useLocale('Mermaid');
const { direction, getPrefixCls } = useXProviderContext();
const prefixCls = computed(() => getPrefixCls('mermaid', props.prefixCls));

const rootCls = computed(() =>
  classnames(prefixCls.value, props.className, props.classNames?.root, {
    [`${prefixCls.value}-rtl`]: direction?.value === 'rtl',
  }),
);
const headerCls = computed(() =>
  classnames(`${prefixCls.value}-header`, props.classNames?.header),
);
const graphCls = computed(() =>
  classnames(
    `${prefixCls.value}-graph`,
    props.classNames?.graph,
    renderType.value === RenderType.Code && `${prefixCls.value}-graph-hidden`,
  ),
);
const codeCls = computed(() => classnames(`${prefixCls.value}-code`, props.classNames?.code));

const renderType = ref<RenderType>(RenderType.Image);
const scale = ref(1);
const position = ref({ x: 0, y: 0 });
const isDragging = ref(false);
const lastMousePos = ref({ x: 0, y: 0 });
const containerRef = shallowRef<HTMLDivElement | null>(null);
const diagramId = `mermaid-${uuidSeq++}`;

async function renderDiagramInner() {
  const text = props.children;
  if (!text || !containerRef.value || renderType.value === RenderType.Code) return;
  try {
    const isValid = await mermaid.parse(text, { suppressErrors: true });
    if (!isValid) throw new Error('Invalid Mermaid syntax');
    const newText = text.replace(/[`\s]+$/g, '');
    const { svg } = await mermaid.render(diagramId, newText, containerRef.value);
    if (containerRef.value) containerRef.value.innerHTML = svg;
  } catch (error) {
    console.warn(`Mermaid render failed: ${error}`);
  }
}

const renderDiagram = throttle(renderDiagramInner, 100);

watch(
  () => [props.children, renderType.value] as const,
  () => {
    if (renderType.value === RenderType.Code && containerRef.value) {
      containerRef.value.innerHTML = '';
    } else {
      renderDiagram();
    }
  },
  { immediate: false },
);

onMounted(() => {
  renderDiagram();
});

function applySvgTransform() {
  const container = containerRef.value;
  if (!container || renderType.value !== RenderType.Image) return;
  const svg = container.querySelector('svg');
  if (svg) {
    svg.style.transform = `scale(${scale.value}) translate(${position.value.x}px, ${position.value.y}px)`;
    svg.style.transformOrigin = 'center';
    svg.style.transition = isDragging.value ? 'none' : 'transform 0.1s ease-out';
    svg.style.cursor = isDragging.value ? 'grabbing' : 'grab';
  }
}

watch([scale, position, renderType, isDragging], applySvgTransform);

let lastWheelTime = 0;
function wheelHandler(e: WheelEvent) {
  e.preventDefault();
  e.stopPropagation();
  const now = Date.now();
  if (now - lastWheelTime < 16) return;
  lastWheelTime = now;
  const delta = e.deltaY > 0 ? -0.1 : 0.1;
  scale.value = Math.max(0.5, Math.min(3, scale.value + delta));
}

watch(
  [renderType, containerRef],
  ([rt, container], _prev, onCleanup) => {
    if (!container || rt !== RenderType.Image) return;
    container.addEventListener('wheel', wheelHandler, { passive: false });
    onCleanup(() => container.removeEventListener('wheel', wheelHandler));
  },
  { immediate: true },
);

function handleMouseDown(e: MouseEvent) {
  if (renderType.value !== RenderType.Image) return;
  e.preventDefault();
  isDragging.value = true;
  lastMousePos.value = { x: e.clientX, y: e.clientY };
}
function handleMouseMove(e: MouseEvent) {
  if (!isDragging.value || renderType.value !== RenderType.Image) return;
  e.preventDefault();
  const dx = e.clientX - lastMousePos.value.x;
  const dy = e.clientY - lastMousePos.value.y;
  position.value = {
    x: position.value.x + dx / scale.value,
    y: position.value.y + dy / scale.value,
  };
  lastMousePos.value = { x: e.clientX, y: e.clientY };
}
function handleMouseUp() {
  isDragging.value = false;
}

function handleReset() {
  scale.value = 1;
  position.value = { x: 0, y: 0 };
}
function handleZoomIn() {
  scale.value = Math.min(scale.value + 0.2, 3);
}
function handleZoomOut() {
  scale.value = Math.max(scale.value - 0.2, 0.5);
}

async function handleCopyCode() {
  if (!props.children) return;
  try {
    await navigator.clipboard.writeText(props.children.trim());
    message.success(contextLocale.value.copySuccess);
  } catch (e) {
    console.error('Failed to copy code:', e);
  }
}

async function handleDownload() {
  const svgElement = containerRef.value?.querySelector('svg');
  if (!svgElement) return;
  const svgString = new XMLSerializer().serializeToString(svgElement);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const { width, height } = svgElement.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.scale(dpr, dpr);
  const img = new Image();
  img.onload = () => {
    ctx.drawImage(img, 0, 0, width, height);
    const link = document.createElement('a');
    link.download = `${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png', 1);
    link.click();
  };
  img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
}

const actionItems = computed(() => {
  const base: any[] = [
    {
      key: 'copy',
      icon: () => h(CopyOutlined),
      label: contextLocale.value.copy,
      onItemClick: handleCopyCode,
    },
  ];
  if (renderType.value === RenderType.Image) {
    base.push(
      {
        key: 'zoomIn',
        icon: () => h(ZoomInOutlined),
        label: contextLocale.value.zoomIn,
        onItemClick: handleZoomIn,
      },
      {
        key: 'zoomOut',
        icon: () => h(ZoomOutOutlined),
        label: contextLocale.value.zoomOut,
        onItemClick: handleZoomOut,
      },
      {
        key: 'zoomReset',
        label: contextLocale.value.zoomReset,
        onItemClick: handleReset,
      },
      {
        key: 'download',
        icon: () => h(DownloadOutlined),
        label: contextLocale.value.download,
        onItemClick: handleDownload,
      },
    );
  }
  return base;
});

const segmentedOptions = computed(() => [
  { label: contextLocale.value.image, value: RenderType.Image },
  { label: contextLocale.value.code, value: RenderType.Code },
]);

onBeforeUnmount(() => {
  renderDiagram.cancel?.();
});
</script>

<template>
  <div v-if="children" :class="rootCls" :style="{ ...style, ...styles?.root }">
    <component :is="header" v-if="header" />
    <div
      v-else-if="header !== null"
      :class="headerCls"
      :style="styles?.header"
    >
      <Segmented v-model:value="renderType" :options="segmentedOptions" />
      <Actions :items="actionItems" />
    </div>

    <div
      ref="containerRef"
      :class="graphCls"
      :style="styles?.graph"
      @mousedown="handleMouseDown"
      @mousemove="handleMouseMove"
      @mouseup="handleMouseUp"
      @mouseleave="handleMouseUp"
    />

    <div
      v-if="renderType === RenderType.Code"
      :class="codeCls"
      :style="styles?.code"
    >
      <pre><code>{{ (children || '').replace(/\n$/, '') }}</code></pre>
    </div>
  </div>
</template>

<style scoped>
:deep([class$='-mermaid-header']) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.04);
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
}
:deep([class$='-mermaid-graph']) {
  overflow: hidden;
  padding: 12px;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-top: none;
}
:deep([class$='-mermaid-graph-hidden']) {
  display: none;
}
:deep([class$='-mermaid-code']) {
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-top: none;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  overflow: auto;
  background: #fff;
  padding: 12px;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
}
:deep([class$='-mermaid-code']) pre {
  margin: 0;
}
</style>
