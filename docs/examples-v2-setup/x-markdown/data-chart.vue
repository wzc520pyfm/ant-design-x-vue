<script setup lang="tsx">
defineOptions({ name: 'AXXMarkdownDataChartV2Setup' });

import {
  defineComponent,
  h,
  nextTick,
  onBeforeUnmount,
  onMounted,
  onUnmounted,
  ref,
  watch,
  watchEffect,
} from 'vue';
import { Bubble } from 'ant-design-x-vue';
import { XMarkdown, type ComponentProps } from '@ant-design-x-vue/x-markdown';
import { Skeleton } from 'ant-design-vue';
import { textOf } from '../../examples-v2/_shared/markdown-code';

const text = `
**GPT-Vis**, Components for GPTs, generative AI, and LLM projects. Not only UI Components. [more...](https://github.com/antvis/GPT-Vis)

Here's a visualization of Haidilao's food delivery revenue from 2013 to 2022.

<custom-line axisXTitle="year" axisYTitle="sale">[{"time":2013,"value":59.3},{"time":2014,"value":64.4},{"time":2015,"value":68.9},{"time":2016,"value":74.4},{"time":2017,"value":82.7},{"time":2018,"value":91.9},{"time":2019,"value":99.1},{"time":2020,"value":101.6},{"time":2021,"value":114.4},{"time":2022,"value":121}]</custom-line>
`;

type VisChart = { render: (config: Record<string, unknown>) => void; destroy: () => void };
const LineChart = defineComponent({
  name: 'XMarkdownLineChartSetup',
  props: {
    dataJson: { type: String, required: true },
    axisXTitle: { type: String, default: '' },
    axisYTitle: { type: String, default: '' },
  },
  setup(props) {
    const host = ref<HTMLDivElement | null>(null);
    let chart: VisChart | null = null;
    let disposed = false;

    const paint = () => {
      if (!chart) return;
      try {
        chart.render({
          type: 'line',
          data: JSON.parse(props.dataJson),
          axisXTitle: props.axisXTitle,
          axisYTitle: props.axisYTitle,
        });
      } catch (error) {
        console.warn(error);
      }
    };

    onMounted(() => {
      void (async () => {
        await nextTick();
        if (disposed || !host.value) return;
        // Alias resolves to docs/shared/gpt-vis-line.ts (line-only). Load only on
        // the client — Node SSR cannot resolve gpt-vis extensionless ESM imports.
        const { GPTVis } = await import('@antv/gpt-vis');
        if (disposed || !host.value) return;
        const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        chart = new GPTVis({
          container: host.value,
          width: host.value.clientWidth || 640,
          height: 320,
          theme,
        });
        paint();
      })();
    });

    watch(() => [props.dataJson, props.axisXTitle, props.axisYTitle], paint);
    onBeforeUnmount(() => {
      disposed = true;
      chart?.destroy();
      chart = null;
    });

    return () => h('div', { ref: host, class: 'ax-xmd-gpt-vis' });
  },
});

const LineCompt = (props: ComponentProps & Record<string, any>) => {
  if (props.streamStatus === 'loading') {
    return h(Skeleton.Image, { active: true, style: { width: 480, height: 240 } });
  }
  const dataJson = textOf(props.children);
  if (!dataJson) return null;
  return h(LineChart, {
    dataJson,
    axisXTitle: String(props.axisXTitle || ''),
    axisYTitle: String(props.axisYTitle || ''),
  });
};

const index = ref(0);
const hasNextChunk = ref(false);
const isServer = import.meta.env.SSR;
const components = { 'custom-line': LineCompt };

watchEffect((onCleanup) => {
  if (isServer || index.value >= text.length) {
    hasNextChunk.value = false;
    return;
  }
  hasNextChunk.value = true;
  const timerId = setTimeout(() => {
    index.value = Math.min(text.length, index.value + 5);
  }, 20);
  onCleanup(() => clearTimeout(timerId));
});

onUnmounted(() => {
  index.value = text.length;
  hasNextChunk.value = false;
});

const renderContent = (content: unknown) =>
  h(XMarkdown, {
    style: { whiteSpace: 'normal' },
    content: String(content ?? ''),
    components,
    paragraphTag: 'div',
    streaming: { hasNextChunk: hasNextChunk.value },
  });

const restart = () => {
  index.value = 0;
};
</script>

<template>
  <a-flex vertical gap="small">
    <a-button style="align-self: flex-end" @click="restart">Re-Render</a-button>
    <Bubble
      :content="text.slice(0, index)"
      :content-render="renderContent"
      variant="outlined"
    />
  </a-flex>
</template>

<style>
.ax-xmd-gpt-vis {
  width: 100%;
  min-height: 320px;
}
</style>
