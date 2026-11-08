<script lang="ts">
import mermaid from 'mermaid';

let uuidSeq = 0;
/** Last theme passed to mermaid.initialize — avoid re-init storms across instances. */
let lastMermaidTheme: string | null = null;
/**
 * Mermaid's render/parse path is not re-entrant. Streaming demos (and multiple
 * diagrams on one page) schedule overlapping async work; without a queue that
 * yields `firstChild` TypeErrors and overlapping SVG nodes.
 */
let mermaidQueue: Promise<void> = Promise.resolve();
function enqueueMermaid<T>(task: () => Promise<T>): Promise<T> {
  const run = mermaidQueue.then(task, task);
  mermaidQueue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}
</script>

<script setup lang="ts">
import {
  computed,
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
import { message, Segmented, theme } from 'ant-design-vue';
import {
  CopyOutlined,
  DownloadOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from '@ant-design/icons-vue';
import {
  useLocale,
  useXProviderContext,
  Actions,
  CodeHighlighter,
} from 'ant-design-x-vue';
import { isDarkColor } from '../is-dark-color';

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

const { token } = theme.useToken();
const darkSurface = computed(() => isDarkColor(token.value.colorBgContainer));

function syncMermaidTheme() {
  const nextTheme = darkSurface.value ? 'dark' : 'default';
  if (lastMermaidTheme === nextTheme) return;
  lastMermaidTheme = nextTheme;
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'strict',
    theme: nextTheme,
    fontFamily: 'monospace',
  });
}

syncMermaidTheme();

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
/** Stable per-instance prefix; render id still changes with content length (React 2.0.0). */
const instanceId = uuidSeq++;
let renderSeq = 0;
let renderGeneration = 0;

const headerStyle = computed(() => ({
  background: token.value.colorFillContent,
  color: token.value.colorText,
  ...(props.styles?.header || {}),
}));
const graphStyle = computed(() => ({
  background: token.value.colorBgContainer,
  borderColor: token.value.colorBorderSecondary,
  ...(props.styles?.graph || {}),
}));
const codeStyle = computed(() => ({
  background: token.value.colorBgContainer,
  borderColor: token.value.colorBorderSecondary,
  color: token.value.colorText,
  ...(props.styles?.code || {}),
}));

async function renderDiagramInner() {
  const text = props.children;
  if (!text || !containerRef.value || renderType.value === RenderType.Code) return;
  syncMermaidTheme();
  // Match React 2.0.0: unique id per attempt including children.length so mermaid
  // does not reuse the previous SVG node (that yields firstChild TypeError / overlap).
  const renderId = `mermaid-${instanceId}-${text.length}-${renderSeq++}`;
  const generation = ++renderGeneration;
  try {
    await enqueueMermaid(async () => {
      if (generation !== renderGeneration || !containerRef.value) return;
      const isValid = await mermaid.parse(text, { suppressErrors: true });
      if (!isValid) throw new Error('Invalid Mermaid syntax');
      if (generation !== renderGeneration || !containerRef.value) return;
      const newText = text.replace(/[`\s]+$/g, '');
      // Drop any leftover node mermaid may have injected under this id.
      document.getElementById(renderId)?.remove();
      const { svg } = await mermaid.render(renderId, newText, containerRef.value);
      if (generation !== renderGeneration || !containerRef.value) return;
      containerRef.value.innerHTML = svg;
    });
  } catch (error) {
    if (generation !== renderGeneration) return;
    console.warn(`Mermaid render failed: ${error}`);
  }
}

const renderDiagram = throttle(renderDiagramInner, 100);

watch(
  () => [props.children, renderType.value, darkSurface.value] as const,
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
  scale.value = Math.max(0.5, scale.value + delta);
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
  scale.value += 0.2;
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

  const exportSvg = svgElement.cloneNode(true) as SVGSVGElement;
  exportSvg.style.removeProperty('transform');
  exportSvg.style.removeProperty('transform-origin');
  exportSvg.style.removeProperty('transition');
  exportSvg.style.removeProperty('cursor');

  const viewBox = svgElement.viewBox.baseVal;
  let width = viewBox.width || svgElement.width.baseVal.value;
  let height = viewBox.height || svgElement.height.baseVal.value;
  if (!width || !height) {
    const bounds = svgElement.getBoundingClientRect();
    width ||= bounds.width / scale.value;
    height ||= bounds.height / scale.value;
  }
  if (!width || !height) return;

  exportSvg.setAttribute('width', `${width}`);
  exportSvg.setAttribute('height', `${height}`);

  const svgString = new XMLSerializer().serializeToString(exportSvg);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
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

// Pass icon *components* (not h() VNodes). Calling h() while Mermaid's
// template evaluates `:items` registers those VNodes in Mermaid's block
// tree; Image↔Code changes the h() count and Vue's patch then crashes with
// "Cannot read properties of undefined (reading 'el')", leaving Segmented
// stuck on Code. Actions.resolveActionIcon mounts components itself.
function buildActionItems() {
  const base: any[] = [
    {
      key: 'copy',
      icon: CopyOutlined,
      label: contextLocale.value.copy,
      onItemClick: handleCopyCode,
    },
  ];
  if (renderType.value === RenderType.Image) {
    base.push(
      {
        key: 'zoomIn',
        icon: ZoomInOutlined,
        label: contextLocale.value.zoomIn,
        onItemClick: handleZoomIn,
      },
      {
        key: 'zoomOut',
        icon: ZoomOutOutlined,
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
        icon: DownloadOutlined,
        label: contextLocale.value.download,
        onItemClick: handleDownload,
      },
    );
  }
  return base;
}

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
      :style="headerStyle"
    >
      <Segmented v-model:value="renderType" :options="segmentedOptions" />
      <Actions :items="buildActionItems()" />
    </div>

    <div
      ref="containerRef"
      :class="graphCls"
      :style="graphStyle"
      @mousedown="handleMouseDown"
      @mousemove="handleMouseMove"
      @mouseup="handleMouseUp"
      @mouseleave="handleMouseUp"
    />

    <div
      v-if="renderType === RenderType.Code"
      :class="codeCls"
      :style="codeStyle"
    >
      <CodeHighlighter
        lang="mermaid"
        :header="false"
        :children="children"
        :styles="{
          code: {
            background: 'transparent',
            border: 'none',
            borderRadius: 0,
            padding: 0,
          },
        }"
      />
    </div>
  </div>
</template>

<style scoped>
:deep([class$='-mermaid-header']) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
}
:deep([class$='-mermaid-graph']) {
  overflow: hidden;
  padding: 12px;
  border: 1px solid transparent;
  border-top: none;
}
:deep([class$='-mermaid-graph-hidden']) {
  display: none;
}
:deep([class$='-mermaid-code']) {
  border: 1px solid transparent;
  border-top: none;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  overflow: auto;
  padding: 12px;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
}
:deep([class$='-mermaid-code']) pre {
  margin: 0;
}
</style>
