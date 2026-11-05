<script setup lang="tsx">
defineOptions({ name: 'AXBubbleGptVisV2' });

import {
  defineComponent,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  watchEffect,
} from 'vue';
import { Bubble } from 'ant-design-x-vue';
import { XMarkdown } from '@ant-design-x-vue/x-markdown';
import { Button, Flex, Typography } from 'ant-design-vue';
import { splitVisMarkdown, toRenderSyntax } from '../../shared/vis-markdown';

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

    return () => <div ref={host} class="ax-gpt-vis" />;
  },
});

const renderContent = (content: unknown) => {
  const part = splitVisMarkdown(String(content ?? ''));
  return (
    <Typography class="ax-bubble-gpt-vis">
      {part.before.trim() ? <XMarkdown content={part.before} /> : null}
      {part.syntax.trim().startsWith('vis ') ? <GptVisChart syntax={part.syntax} /> : null}
      {part.after.trim() ? <XMarkdown content={part.after} /> : null}
    </Typography>
  );
};

const index = ref(text.length);
const isServer = import.meta.env.SSR;

watchEffect((onCleanup) => {
  if (isServer || index.value >= text.length) return;
  const timerId = setTimeout(() => {
    index.value = Math.min(text.length, index.value + 5);
  }, 20);
  onCleanup(() => clearTimeout(timerId));
});

defineRender(() => (
  <Flex vertical gap="small">
    <Button style={{ alignSelf: 'flex-end' }} onClick={() => (index.value = 0)}>
      Re-Render
    </Button>
    <Bubble
      content={text.slice(0, index.value)}
      contentRender={renderContent}
      variant="outlined"
    />
  </Flex>
));
</script>

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
