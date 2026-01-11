import { computed, toValue, type MaybeRefOrGetter } from 'vue';
import type { BubbleProps, TypingOption } from '../interface';

function useTypingConfig(typing: MaybeRefOrGetter<BubbleProps['typing']>) {
  const typingEnabled = computed(() => {
    if (!toValue(typing)) {
      return false;
    }
    return true;
  });
  const baseConfig: Required<TypingOption> = {
    step: 1,
    interval: 50,
    // set default suffix is empty
    suffix: null,
  };
  const config = computed(() => {
    const typingRaw = toValue(typing);
    return {
      ...baseConfig,
      ...(typeof typingRaw === 'object' ? typingRaw : {})
    }
  });

  return [
    typingEnabled,
    computed(() => config.value.step),
    computed(() => config.value.interval),
    computed(() => config.value.suffix)
  ] as const;
}

export default useTypingConfig;
