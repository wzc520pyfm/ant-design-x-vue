<script setup lang="tsx">
import {
  DownloadOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from '@ant-design/icons-vue';
import { Button, Segmented, Tooltip } from 'ant-design-vue';
import classnames from 'classnames';
import throttle from 'lodash.throttle';
import mermaid, { type MermaidConfig } from 'mermaid';
import {
  computed,
  onBeforeUnmount,
  ref,
  shallowRef,
  useAttrs,
  watch,
  watchEffect,
  type CSSProperties,
  type VNode,
} from 'vue';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import pickAttrs from '../_util/pick-attrs';
import warning from '../_util/warning';
import Actions from '../actions';
import type { ItemType } from '../actions/interface';
import { useLocale } from '../locale';
import locale_EN from '../locale/en_US';
import { useXProviderContext } from '../x-provider';
import type { MermaidProps, MermaidRenderType } from './interface';
import useStyle from './style';

defineOptions({ name: 'AXMermaid', inheritAttrs: false });

const {
  children,
  header,
  prefixCls: customizePrefixCls,
  rootClassName,
  className,
  class: classProp,
  style = {},
  styles = {},
  classNames = {},
  highlightProps: _highlightProps,
  config,
  actions = {},
  onRenderTypeChange,
  ...restProps
} = defineProps<MermaidProps>();

const slots = defineSlots<{
  default?(): VNode[];
  header?(): VNode[];
}>();

const attrs = useAttrs();

enum RenderType {
  Code = 'code',
  Image = 'image',
}

let uuid = 0;

/**
 * Mermaid's render/parse path is not re-entrant. Multiple diagrams (or streaming)
 * schedule overlapping async work; a shared queue avoids firstChild TypeErrors.
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

const [contextLocale] = useLocale('Mermaid', locale_EN.Mermaid);

const { direction, getPrefixCls } = useXProviderContext();
const prefixCls = getPrefixCls('mermaid', customizePrefixCls);
const contextConfig = useXComponentConfig('mermaid');
const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

const rootRef = ref<HTMLDivElement>();
const containerRef = shallowRef<HTMLDivElement | null>(null);

defineExpose({
  nativeElement: rootRef,
});

function slotToText(nodes: VNode[] | undefined): string {
  if (!nodes?.length) return '';
  return nodes
    .map((n) => {
      if (typeof n.children === 'string') return n.children;
      if (Array.isArray(n.children)) {
        return (n.children as unknown[])
          .map((c) => (typeof c === 'string' ? c : ''))
          .join('');
      }
      return '';
    })
    .join('');
}

const codeText = computed(() => {
  if (typeof children === 'string') return children;
  return slotToText(slots.default?.());
});

const renderType = ref<RenderType>(RenderType.Image);
const scale = ref(1);
const position = ref({ x: 0, y: 0 });
const isDragging = ref(false);
const lastMousePos = ref({ x: 0, y: 0 });

const latestRef = shallowRef({ code: '', type: RenderType.Image as RenderType });
const requestRef = ref(0);

const mergedCls = computed(() =>
  classnames(
    prefixCls,
    contextConfig.value.className,
    className,
    classProp,
    rootClassName,
    contextConfig.value.classNames?.root,
    classNames.root,
    hashId.value,
    cssVarCls,
    {
      [`${prefixCls}-rtl`]: direction.value === 'rtl',
    },
  ),
);

const mergedStyle = computed<CSSProperties>(() => ({
  ...contextConfig.value.style,
  ...contextConfig.value.styles?.root,
  ...styles?.root,
  ...style,
}));

const domProps = computed(() =>
  pickAttrs({ ...attrs, ...restProps }, { attr: true, aria: true, data: true }),
);

// Keep mermaid.initialize in sync with a stable config reference (React 2.10).
watch(
  () => config,
  (next) => {
    const merged: MermaidConfig = {
      startOnLoad: false,
      securityLevel: 'strict',
      theme: 'default',
      fontFamily: 'monospace',
      ...(next || {}),
    };
    mermaid.initialize(merged);
  },
  { immediate: true },
);

const renderDiagram = throttle(async () => {
  const { code, type } = latestRef.value;
  if (!code || !containerRef.value || type === RenderType.Code) return;

  requestRef.value += 1;
  const requestId = requestRef.value;
  uuid += 1;
  const id = `mermaid-${uuid}`;

  try {
    await enqueueMermaid(async () => {
      if (requestId !== requestRef.value || !containerRef.value) return;
      const isValid = await mermaid.parse(code, { suppressErrors: true });
      if (!isValid) throw new Error('Invalid Mermaid syntax');
      if (requestId !== requestRef.value || !containerRef.value) return;
      document.getElementById(id)?.remove();
      const { svg } = await mermaid.render(id, code);
      if (requestId !== requestRef.value || !containerRef.value) return;
      containerRef.value.innerHTML = svg;
    });
  } catch (error) {
    if (requestId !== requestRef.value) return;
    warning(false, 'Mermaid', `Render failed: ${error}`);
  }
}, 100);

watchEffect((onCleanup) => {
  const code = codeText.value;
  const type = renderType.value;
  // Also re-run when config identity changes (React deps include config).
  void config;
  latestRef.value = { code, type };

  if (type === RenderType.Code) {
    renderDiagram.cancel();
    requestRef.value += 1;
    if (containerRef.value) {
      containerRef.value.innerHTML = '';
    }
  } else {
    renderDiagram();
  }

  onCleanup(() => {
    renderDiagram.cancel();
  });
});

onBeforeUnmount(() => {
  renderDiagram.cancel();
  requestRef.value += 1;
});

watchEffect((onCleanup) => {
  const container = containerRef.value;
  if (!container || renderType.value !== RenderType.Image) return;

  const { enableZoom = true } = actions || {};
  if (!enableZoom) return;

  let lastTime = 0;
  const wheelHandler = (e: WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const now = Date.now();
    if (now - lastTime < 16) return;
    lastTime = now;
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    scale.value = Math.max(0.5, scale.value + delta);
  };

  container.addEventListener('wheel', wheelHandler, { passive: false });
  onCleanup(() => container.removeEventListener('wheel', wheelHandler));
});

watch([scale, position, renderType, isDragging], () => {
  const container = containerRef.value;
  if (!container || renderType.value !== RenderType.Image) return;
  const svg = container.querySelector('svg');
  if (svg) {
    svg.style.transform = `scale(${scale.value}) translate(${position.value.x}px, ${position.value.y}px)`;
    svg.style.transformOrigin = 'center';
    svg.style.transition = isDragging.value ? 'none' : 'transform 0.1s ease-out';
    svg.style.cursor = isDragging.value ? 'grabbing' : 'grab';
  }
});

function handleMouseDown(e: MouseEvent) {
  if (renderType.value !== RenderType.Image) return;
  e.preventDefault();
  isDragging.value = true;
  lastMousePos.value = { x: e.clientX, y: e.clientY };
}
function handleMouseMove(e: MouseEvent) {
  if (!isDragging.value || renderType.value !== RenderType.Image) return;
  e.preventDefault();
  const deltaX = e.clientX - lastMousePos.value.x;
  const deltaY = e.clientY - lastMousePos.value.y;
  position.value = {
    x: position.value.x + deltaX / scale.value,
    y: position.value.y + deltaY / scale.value,
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
  scale.value = scale.value + 0.2;
}
function handleZoomOut() {
  scale.value = Math.max(scale.value - 0.2, 0.5);
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

function setRenderType(value: RenderType) {
  renderType.value = value;
  onRenderTypeChange?.(value as MermaidRenderType);
}

function buildActionItems(): ItemType[] {
  const {
    enableZoom = true,
    enableDownload = true,
    enableCopy = true,
    customActions = [],
  } = actions || {};

  const items: ItemType[] = [];

  if (renderType.value === RenderType.Image) {
    if (enableZoom) {
      items.push(
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
          actionRender: () => (
            <Tooltip title={contextLocale.value.zoomReset}>
              <Button type="text" size="small" onClick={handleReset}>
                {contextLocale.value.zoomReset}
              </Button>
            </Tooltip>
          ),
        },
      );
    }
    if (enableDownload) {
      items.push({
        key: 'download',
        icon: DownloadOutlined,
        label: contextLocale.value.download,
        onItemClick: () => {
          void handleDownload();
        },
      });
    }
  } else if (enableCopy) {
    items.push({
      key: 'copy',
      actionRender: () => <Actions.Copy text={codeText.value} />,
    });
  }

  return [...items, ...customActions];
}

function renderHeader() {
  if (slots.header) {
    return slots.header();
  }

  if (header !== undefined) {
    const headerResult = typeof header === 'function' ? header() : header;
    if (headerResult === false || headerResult === null) {
      return null;
    }
    return headerResult;
  }

  const segmentedOptions = [
    { label: contextLocale.value.image, value: RenderType.Image },
    { label: contextLocale.value.code, value: RenderType.Code },
  ];

  return (
    <div
      class={classnames(
        `${prefixCls}-header`,
        contextConfig.value.classNames?.header,
        classNames?.header,
      )}
      style={{ ...contextConfig.value.styles?.header, ...styles.header }}
    >
      <Segmented
        options={segmentedOptions}
        value={renderType.value}
        onChange={(value) => setRenderType(value as RenderType)}
      />
      <Actions items={buildActionItems()} />
    </div>
  );
}

defineRender(() => {
  const text = codeText.value;
  if (!text) {
    return null;
  }

  return wrapCSSVar(
    <div
      ref={rootRef}
      class={mergedCls.value}
      style={mergedStyle.value}
      {...domProps.value}
    >
      {renderHeader()}
      <div
        ref={containerRef}
        class={classnames(
          `${prefixCls}-graph`,
          contextConfig.value.classNames?.graph,
          renderType.value === RenderType.Code && `${prefixCls}-graph-hidden`,
          classNames?.graph,
        )}
        style={{ ...contextConfig.value.styles?.graph, ...styles.graph }}
        onMousedown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        onMouseleave={handleMouseUp}
      />
      {renderType.value === RenderType.Code ? (
        <div
          class={classnames(
            `${prefixCls}-code`,
            contextConfig.value.classNames?.code,
            classNames?.code,
          )}
          style={{ ...contextConfig.value.styles?.code, ...styles.code }}
        >
          {/* CodeHighlighter (#526) not on main yet — plain pre for core parity. */}
          <pre>
            <code>{text.replace(/\n$/, '')}</code>
          </pre>
        </div>
      ) : null}
    </div>,
  );
});
</script>
