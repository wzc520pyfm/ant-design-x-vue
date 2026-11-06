import * as Vue from 'vue';

let fallbackSeed = 0;

/**
 * Vue 3.5+ `useId` when available; otherwise a monotonic fallback.
 * Prefer passing stable keys from data for SSR.
 */
export function useCompatId(): string {
  const useId = (Vue as { useId?: () => string }).useId;
  if (typeof useId === 'function') {
    return useId();
  }
  fallbackSeed += 1;
  return `adxv-id-${fallbackSeed}`;
}
