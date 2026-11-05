<script setup lang="ts">
import {
  defineComponent,
  h,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  watchEffect,
} from 'vue';
import { Bubble } from 'ant-design-x-vue';
import type { BubbleProps } from 'ant-design-x-vue';
import { Typography } from 'ant-design-vue';
import markdownit from 'markdown-it';
import { splitVisMarkdown, toRenderSyntax } from '../../shared/vis-markdown';

defineOptions({ name: 'AXBubbleGptVisSetup' });

const md = markdownit({ html: false, breaks: true, linkify: true });

const text = `
**GPT-Vis**, Components for GPTs, generative AI, and LLM projects. Not only UI Components. [more...](https://github.com/antvis/GPT-Vis)

Here's a visualization of Haidilao's food delivery revenue from 2013 to 2022. You can see a steady increase over the years, with notable *growth* particularly in recent years.

\`\`\`vis
vis line
data
  - time 2013
    value 59.3
  - time 2014
    value 64.4
  - time 2015
    value 68.9
  - time 2016
    value 74.4
  - time 2017
    value 82.7
  - time 2018
    value 91.9
  - time 2019
    value 99.1
  - time 2020
    value 101.6
  - time 2021
    value 114.4
  - time 2022
    value 121
title Haidilao delivery revenue
axisXTitle year
axisYTitle sale
\`\`\`
`.trim();

type VisChart = { render: (value: string) => void; destroy: () => void };

const GptVisChart = defineComponent({
  name: 'GptVisChart',
  props: { syntax: { type: String, required: true } },
  setup(props) {
    const host = ref<HTMLDivElement | null>(null);
    let chart: VisChart | null = null;
    let painted = '';
    let disposed = false;

    const paint = (syntax: string) => {
      const value = toRenderSyntax(syntax);
      if (!chart || !value || value === painted) return;
      try {
        chart.render(value);
        painted = value;
      } catch (error) {
        console.warn(error);
      }
    };

    onMounted(() => {
      void (async () => {
        await nextTick();
        if (disposed || !host.value) return;
        const { GPTVis } = await import('@antv/gpt-vis');
        if (disposed || !host.value) return;
        const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        chart = new GPTVis({
          container: host.value,
          width: host.value.clientWidth || 640,
          height: 320,
          theme,
        });
        paint(props.syntax);
      })();
    });

    watch(() => props.syntax, (syntax) => paint(syntax));

    onBeforeUnmount(() => {
      disposed = true;
      chart?.destroy();
      chart = null;
    });

    return () => h('div', { ref: host, class: 'ax-gpt-vis' });
  },
});

const renderMessage: BubbleProps['messageRender'] = (content) => {
  const part = splitVisMarkdown(String(content ?? ''));
  const nodes = [
    part.before.trim() ? h('div', { innerHTML: md.render(part.before) }) : null,
    part.syntax.trim().startsWith('vis ') ? h(GptVisChart, { syntax: part.syntax }) : null,
    part.after.trim() ? h('div', { innerHTML: md.render(part.after) }) : null,
  ].filter((node) => node != null);
  return h(Typography, { class: 'ax-bubble-gpt-vis' }, { default: () => nodes });
};

const index = ref(text.length);
const isServer = import.meta.env.SSR;

watchEffect((onCleanup) => {
  if (isServer || index.value >= text.length) return;
  const timerId = setTimeout(() => {
    index.value = Math.min(text.length, index.value + 20);
  }, 150);
  onCleanup(() => clearTimeout(timerId));
});

const replay = () => {
  index.value = 0;
};
</script>

<template>
  <a-flex vertical gap="small">
    <a-button :style="{ alignSelf: 'flex-end' }" @click="replay">Re-Render</a-button>
    <Bubble
      :content="text.slice(0, index)"
      :messageRender="renderMessage"
      :avatar="{
        src: 'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*2Q5LRJ3LFPUAAAAAAAAAAAAADmJ7AQ/fmt.webp',
      }"
      variant="outlined"
    />
  </a-flex>
</template>

<style>
.vp-doc .example-showcase .ax-bubble-gpt-vis a {
  font-weight: 400;
  text-decoration: none;
}

.vp-doc .example-showcase .ax-bubble-gpt-vis a::before,
.vp-doc .example-showcase .ax-bubble-gpt-vis a::after {
  content: none !important;
}

.vp-doc .example-showcase .ax-bubble-gpt-vis p {
  margin: 0 0 0.6em;
  line-height: 1.7;
}

.ax-gpt-vis {
  width: 100%;
  min-height: 320px;
}
</style>
