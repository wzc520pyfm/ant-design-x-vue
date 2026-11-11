<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  type CSSProperties,
} from 'vue';

interface PerformanceSnapshot {
  timestamp: number;
  fps: number;
  memory: number;
}

const FPS_THRESHOLD = { GOOD: 55, WARNING: 40 };
const COLORS = { GOOD: '#52c41a', WARNING: '#faad14', DANGER: '#ff4d4f' };
const CHART = { WIDTH: 750, HEIGHT: 400, PADDING: 80 };

const fps = ref(0);
const memory = ref(0);
const isRecording = ref(false);
const showModal = ref(false);
const records = ref<PerformanceSnapshot[]>([]);
const isDragging = ref(false);

const position = ref(
  typeof window === 'undefined'
    ? { x: 12, y: 12 }
    : {
        x: window.innerWidth - 220,
        y: window.innerHeight / 2 - 100,
      },
);

const dragState = {
  startX: 0,
  startY: 0,
  initialX: position.value.x,
  initialY: position.value.y,
};

let recordingRecords: PerformanceSnapshot[] = [];
let frameTimes: number[] = [];
let lastTime = 0;
let frameCount = 0;
let animationFrame: number | undefined;

const panelStyle = computed<CSSProperties>(() => ({
  left: `${position.value.x}px`,
  top: `${position.value.y}px`,
  cursor: isDragging.value ? 'grabbing' : 'grab',
}));

function getMemoryUsage(): number {
  const perf = performance as Performance & {
    memory?: { usedJSHeapSize: number };
  };
  return perf.memory ? Math.round(perf.memory.usedJSHeapSize / 1024 / 1024) : 0;
}

function formatMemory(mb: number): string {
  if (mb < 1) return `${Math.round(mb * 1024)} KB`;
  if (mb >= 1024) return `${(mb / 1024).toFixed(2)} GB`;
  return `${mb.toFixed(2)} MB`;
}

function getFpsColor(value: number): string {
  if (value >= FPS_THRESHOLD.GOOD) return COLORS.GOOD;
  if (value >= FPS_THRESHOLD.WARNING) return COLORS.WARNING;
  return COLORS.DANGER;
}

function updateFrame() {
  const now = performance.now();
  const delta = now - lastTime;
  frameTimes.push(delta);
  if (frameTimes.length > 60) frameTimes.shift();
  frameCount += 1;

  if (delta >= 1000) {
    const currentFps = Math.round((frameCount * 1000) / delta);
    const currentMemory = getMemoryUsage();
    fps.value = currentFps;
    memory.value = currentMemory;

    if (isRecording.value) {
      recordingRecords.push({
        timestamp: Date.now(),
        fps: currentFps,
        memory: currentMemory,
      });
    }

    frameCount = 0;
    lastTime = now;
  }

  animationFrame = requestAnimationFrame(updateFrame);
}

function toggleRecording() {
  if (isRecording.value) {
    isRecording.value = false;
    records.value = [...recordingRecords];
    showModal.value = true;
  } else {
    recordingRecords = [];
    isRecording.value = true;
  }
}

function handleMouseDown(event: MouseEvent) {
  if ((event.target as HTMLElement).closest('.x-markdown-debug-action')) return;
  isDragging.value = true;
  dragState.startX = event.clientX;
  dragState.startY = event.clientY;
  dragState.initialX = position.value.x;
  dragState.initialY = position.value.y;
}

function handleMouseMove(event: MouseEvent) {
  if (!isDragging.value) return;
  position.value = {
    x: dragState.initialX + event.clientX - dragState.startX,
    y: dragState.initialY + event.clientY - dragState.startY,
  };
}

function handleMouseUp() {
  isDragging.value = false;
}

function createPoints(
  snapshots: PerformanceSnapshot[],
  key: 'fps' | 'memory',
  max: number,
  startTime: number,
  duration: number,
) {
  const chartWidth = CHART.WIDTH - CHART.PADDING * 2;
  const chartHeight = CHART.HEIGHT - CHART.PADDING * 2;
  return snapshots
    .map((snapshot) => {
      const x =
        CHART.PADDING + ((snapshot.timestamp - startTime) / duration) * chartWidth;
      const y =
        CHART.PADDING +
        chartHeight -
        (snapshot[key] / max) * chartHeight;
      return `${x},${y}`;
    })
    .join(' ');
}

const chart = computed(() => {
  if (!records.value.length) return null;
  const snapshots = records.value;
  const startTime = snapshots[0]?.timestamp ?? 0;
  const endTime = snapshots[snapshots.length - 1]?.timestamp ?? 0;
  const duration = endTime - startTime || 1;
  const maxFps = Math.max(...snapshots.map((record) => record.fps), 60);
  const maxMemory = Math.max(...snapshots.map((record) => record.memory), 0) * 1.1;
  const avgFps =
    snapshots.reduce((sum, record) => sum + record.fps, 0) / snapshots.length;
  const avgMemory =
    snapshots.reduce((sum, record) => sum + record.memory, 0) / snapshots.length;
  const minFps = Math.min(...snapshots.map((record) => record.fps));
  const maxFpsValue = Math.max(...snapshots.map((record) => record.fps));

  return {
    duration,
    maxFps,
    maxMemory,
    avgFps,
    avgMemory,
    minFps,
    maxFpsValue,
    fpsPoints: createPoints(snapshots, 'fps', maxFps, startTime, duration),
    memoryPoints: createPoints(
      snapshots,
      'memory',
      maxMemory || 1,
      startTime,
      duration,
    ),
  };
});

const chartWidth = CHART.WIDTH - CHART.PADDING * 2;
const chartHeight = CHART.HEIGHT - CHART.PADDING * 2;
const chartGrid = [0, 0.25, 0.5, 0.75, 1];

onMounted(() => {
  lastTime = performance.now();
  animationFrame = requestAnimationFrame(updateFrame);
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
});

onBeforeUnmount(() => {
  if (animationFrame !== undefined) cancelAnimationFrame(animationFrame);
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
});
</script>

<template>
  <div
    class="x-markdown-debug-panel"
    :style="panelStyle"
    @mousedown="handleMouseDown"
  >
    <div class="x-markdown-debug-row">
      <span class="x-markdown-debug-label">FPS</span>
      <span
        class="x-markdown-debug-value"
        :style="{ color: getFpsColor(fps) }"
      >{{ fps }}</span>
    </div>
    <div class="x-markdown-debug-row">
      <span class="x-markdown-debug-label">Memory</span>
      <span class="x-markdown-debug-value">{{ formatMemory(memory) }}</span>
    </div>
    <div class="x-markdown-debug-actions">
      <button
        type="button"
        class="x-markdown-debug-action x-markdown-debug-record-btn"
        :class="{ recording: isRecording }"
        @click="toggleRecording"
      >
        {{ isRecording ? '⏹ Stop' : '⏺ Record' }}
      </button>
      <button
        v-if="records.length > 0 && !isRecording"
        type="button"
        class="x-markdown-debug-action"
        @click="showModal = true"
      >
        📊 View
      </button>
    </div>
  </div>

  <div
    v-if="showModal && records.length > 0"
    class="x-markdown-debug-modal-overlay"
    @click="showModal = false"
  >
    <div class="x-markdown-debug-modal" @click.stop>
      <div class="x-markdown-debug-modal-header">
        <span :style="{ color: '#fff', fontSize: '18px', fontWeight: 600 }">
          Performance Recording
        </span>
        <button
          type="button"
          class="x-markdown-debug-close-btn"
          @click="showModal = false"
        >
          ✕
        </button>
      </div>

      <div v-if="chart" class="x-markdown-debug-modal-content">
        <div class="x-markdown-debug-stats-summary">
          <div class="x-markdown-debug-stat-item">
            <div class="x-markdown-debug-stat-label">Duration</div>
            <div class="x-markdown-debug-stat-value">
              {{ (chart.duration / 1000).toFixed(2) }}s
            </div>
          </div>
          <div class="x-markdown-debug-stat-item">
            <div class="x-markdown-debug-stat-label">FPS Avg</div>
            <div
              class="x-markdown-debug-stat-value"
              :style="{ color: getFpsColor(chart.avgFps) }"
            >
              {{ chart.avgFps.toFixed(1) }}
            </div>
          </div>
          <div class="x-markdown-debug-stat-item">
            <div class="x-markdown-debug-stat-label">FPS Range</div>
            <div class="x-markdown-debug-stat-value">
              {{ chart.minFps }} - {{ chart.maxFpsValue }}
            </div>
          </div>
          <div class="x-markdown-debug-stat-item">
            <div class="x-markdown-debug-stat-label">Memory Avg</div>
            <div class="x-markdown-debug-stat-value">
              {{ formatMemory(chart.avgMemory) }}
            </div>
          </div>
        </div>

        <svg
          :width="CHART.WIDTH"
          :height="CHART.HEIGHT"
          class="x-markdown-debug-chart-full"
          role="img"
          aria-label="Performance chart showing FPS and memory usage over time"
        >
          <title>Performance Chart</title>
          <g v-for="ratio in chartGrid" :key="ratio">
            <line
              :x1="CHART.PADDING"
              :y1="CHART.PADDING + chartHeight * ratio"
              :x2="CHART.WIDTH - CHART.PADDING"
              :y2="CHART.PADDING + chartHeight * ratio"
              stroke="rgba(255,255,255,0.1)"
              stroke-width="1"
            />
            <line
              :x1="CHART.PADDING + chartWidth * ratio"
              :y1="CHART.PADDING"
              :x2="CHART.PADDING + chartWidth * ratio"
              :y2="CHART.HEIGHT - CHART.PADDING"
              stroke="rgba(255,255,255,0.1)"
              stroke-width="1"
            />
          </g>
          <polyline
            :points="chart.fpsPoints"
            fill="none"
            :stroke="COLORS.GOOD"
            stroke-width="2"
            class="fps-line"
          />
          <polyline
            :points="chart.memoryPoints"
            fill="none"
            stroke="#1890ff"
            stroke-width="2"
            class="memory-line"
          />
          <text
            :x="CHART.PADDING - 10"
            :y="CHART.PADDING"
            :fill="COLORS.GOOD"
            font-size="12"
            text-anchor="end"
          >{{ chart.maxFps.toFixed(0) }}</text>
          <text
            :x="CHART.PADDING - 10"
            :y="CHART.HEIGHT - CHART.PADDING"
            :fill="COLORS.GOOD"
            font-size="12"
            text-anchor="end"
          >0</text>
          <text
            :x="CHART.PADDING - 10"
            :y="CHART.PADDING - 15"
            :fill="COLORS.GOOD"
            font-size="14"
            font-weight="bold"
            text-anchor="end"
          >FPS</text>
          <text
            :x="CHART.WIDTH - CHART.PADDING + 10"
            :y="CHART.PADDING + 20"
            fill="#1890ff"
            font-size="12"
            text-anchor="start"
          >{{ formatMemory(chart.maxMemory) }}</text>
          <text
            :x="CHART.WIDTH - CHART.PADDING + 10"
            :y="CHART.HEIGHT - CHART.PADDING"
            fill="#1890ff"
            font-size="12"
            text-anchor="start"
          >{{ formatMemory(0) }}</text>
          <text
            :x="CHART.WIDTH - CHART.PADDING + 10"
            :y="CHART.PADDING + 5"
            fill="#1890ff"
            font-size="14"
            font-weight="bold"
            text-anchor="start"
          >Memory</text>
          <text
            :x="CHART.PADDING"
            :y="CHART.HEIGHT - CHART.PADDING + 20"
            fill="rgba(255,255,255,0.6)"
            font-size="12"
            text-anchor="middle"
          >0s</text>
          <text
            :x="CHART.WIDTH - CHART.PADDING"
            :y="CHART.HEIGHT - CHART.PADDING + 20"
            fill="rgba(255,255,255,0.6)"
            font-size="12"
            text-anchor="middle"
          >{{ (chart.duration / 1000).toFixed(1) }}s</text>
        </svg>

        <div class="x-markdown-debug-legend">
          <div class="x-markdown-debug-legend-item">
            <span
              class="x-markdown-debug-legend-color"
              :style="{ backgroundColor: COLORS.GOOD }"
            />
            <span>FPS</span>
          </div>
          <div class="x-markdown-debug-legend-item">
            <span
              class="x-markdown-debug-legend-color"
              :style="{ backgroundColor: '#1890ff' }"
            />
            <span>Memory</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style src="./DebugPanel.css"></style>
