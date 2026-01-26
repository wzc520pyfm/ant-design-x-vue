import { computed, onBeforeUnmount, ref, watch, type Ref } from 'vue';
import type { BubbleAnimationOption, BubbleProps } from '../interface';

interface OutputData {
  text: string;
  taskId: number;
  id: string;
  done: boolean;
}

function getLCP(strs: string[]) {
  if (!strs || strs.length === 0) return '';
  return strs.reduce((prefix, str) => {
    let i = 0;
    while (i < prefix.length && i < str.length && prefix[i] === str[i]) {
      i++;
    }
    return prefix.slice(0, i);
  });
}

export function useTyping({
  streaming,
  content,
  typing,
  onTyping,
  onTypingComplete,
}: {
  streaming: Ref<boolean>;
  content: Ref<string>;
  typing: Ref<true | BubbleAnimationOption>;
  onTyping?: BubbleProps['onTyping'];
  onTypingComplete?: BubbleProps['onTypingComplete'];
}) {
  const output = ref<OutputData[]>([]);
  // 标记动画状态
  const animating = ref(false);
  const renderedData = ref('');
  const currentTask = ref(1);
  const raf = ref(-1);

  // typing legal check
  const memoedAnimationCfg = computed<BubbleAnimationOption>(() => {
    const baseCfg: BubbleAnimationOption = {
      effect: 'fade-in',
      interval: 100,
      step: 6,
      keepPrefix: true,
    };
    const typingValue = typing.value;
    if (typingValue === true) return baseCfg;
    // exclude undefined value
    const { step = 6, interval = 100 } = typingValue;
    const isNumber = (num: any): num is number => typeof num === 'number';
    if (!isNumber(interval) || interval <= 0) {
      throw '[Bubble] invalid prop typing.interval, expect positive number.';
    }
    if (!isNumber(step) && !Array.isArray(step)) {
      throw '[Bubble] invalid prop typing.step, expect positive number or positive number array';
    }
    if (isNumber(step) && step <= 0) {
      throw '[Bubble] invalid prop typing.step, expect positive number';
    }
    if (Array.isArray(step)) {
      if (!isNumber(step[0]) || step[0] <= 0) {
        throw '[Bubble] invalid prop typing.step[0], expect positive number';
      }
      if (!isNumber(step[1]) || step[1] <= 0) {
        throw '[Bubble] invalid prop typing.step[1], expect positive number';
      }
      if (step[0] > step[1]) {
        throw '[Bubble] invalid prop typing.step, step[0] should less than step[1]';
      }
    }
    return { ...baseCfg, ...typingValue };
  });

  const getUid = () => Math.random().toString().slice(2);

  // scoped function use ref to reach newest state
  const executeAnimation = (taskId: number) => {
    let lastActivedFrameTime = 0;
    // start with LCP
    renderedData.value = memoedAnimationCfg.value.keepPrefix
      ? getLCP([content.value, renderedData.value])
      : '';

    output.value = renderedData.value
      ? [{ text: renderedData.value, id: getUid(), taskId, done: true }]
      : [];

    const fn = () => {
      if (taskId !== currentTask.value) return;
      const now = performance.now();
      const { interval = 100, step = 6 } = memoedAnimationCfg.value;

      if (now - lastActivedFrameTime < interval) {
        raf.value = requestAnimationFrame(fn);
        return;
      }
      const len = renderedData.value.length;
      const _step =
        typeof step === 'number'
          ? step
          : Math.floor(Math.random() * (step[1] - step[0])) + step[0];
      const nextText = content.value.slice(len, len + _step);
      if (!nextText) {
        // 流式传输 content，收敛同一个 stream 对应一次动画周期，依赖最新的 streaming
        if (streaming.value) {
          raf.value = requestAnimationFrame(fn);
          return;
        }
        output.value = [
          {
            text: output.value.map(({ text }) => text).join(''),
            id: getUid(),
            taskId,
            done: true,
          },
        ];
        onTypingComplete?.(content.value);
        animating.value = false;
        currentTask.value++;
        return;
      }

      renderedData.value += nextText;
      const nextOutput = {
        id: getUid(),
        text: nextText,
        taskId,
        done: false,
      };
      output.value = [...output.value, nextOutput];
      if (!animating.value) {
        animating.value = true;
      }
      lastActivedFrameTime = now;
      raf.value = requestAnimationFrame(fn);
      onTyping?.(renderedData.value, content.value);
    };
    fn();
  };

  const reset = () => {
    cancelAnimationFrame(raf.value);
    output.value = [];
    renderedData.value = '';
    animating.value = false;
  };

  watch(
    content,
    (newContent) => {
      if (!newContent) {
        reset();
        return;
      }
      if (newContent === renderedData.value) return;
      // interrupt ongoing typing and restart new typing if content changed totally
      if (animating.value && !newContent.startsWith(renderedData.value)) {
        cancelAnimationFrame(raf.value);
        animating.value = false;
        requestAnimationFrame(() => executeAnimation(++currentTask.value));
      } else if (animating.value === false) {
        // start new typing
        executeAnimation(currentTask.value);
      }
    },
    { immediate: true },
  );

  onBeforeUnmount(() => {
    cancelAnimationFrame(raf.value);
  });

  return { renderedData: output, animating, memoedAnimationCfg };
}

export default useTyping;
