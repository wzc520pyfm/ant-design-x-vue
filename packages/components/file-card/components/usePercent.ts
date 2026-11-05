import { ref, watch, onBeforeUnmount } from 'vue';
import type { Ref } from 'vue';

const AUTO_INTERVAL = 200;
const STEP_BUCKETS: [limit: number, stepPtg: number][] = [
  [30, 0.05],
  [70, 0.03],
  [96, 0.01],
];

export default function usePercent(
  spinning: Ref<boolean>,
  percent?: Ref<number | 'auto' | undefined>,
): [Ref<number | undefined>, Ref<string>] {
  const mockPercent = ref(0);
  let mockInterval: ReturnType<typeof setInterval> | null = null;

  const isAuto = () => percent?.value === 'auto';

  const clearMockInterval = () => {
    if (mockInterval) {
      clearInterval(mockInterval);
      mockInterval = null;
    }
  };

  watch(
    [() => isAuto(), spinning],
    ([auto, spin]) => {
      clearMockInterval();

      if (auto && spin) {
        mockPercent.value = 0;

        mockInterval = setInterval(() => {
          const prev = mockPercent.value;
          const restPTG = 100 - prev;

          for (let i = 0; i < STEP_BUCKETS.length; i += 1) {
            const [limit, stepPtg] = STEP_BUCKETS[i];

            if (prev <= limit) {
              mockPercent.value = prev + restPTG * stepPtg;
              return;
            }
          }
        }, AUTO_INTERVAL);
      }
    },
    { immediate: true },
  );

  onBeforeUnmount(clearMockInterval);

  const mergedPercent = ref<number | undefined>();
  const percentText = ref('');

  watch(
    [() => isAuto(), mockPercent, () => percent?.value],
    ([auto, mock, raw]) => {
      mergedPercent.value = auto ? mock : (raw as number | undefined);
      percentText.value = auto ? `${mock.toFixed(0)}%` : `${raw}%`;
    },
    { immediate: true },
  );

  return [mergedPercent, percentText];
}
