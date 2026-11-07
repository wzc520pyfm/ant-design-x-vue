let cached: boolean | undefined;

/**
 * Detect a mobile / tablet UA. Result is cached for the current JS runtime
 * (same approach as `@rc-component/util/lib/isMobile`).
 */
export function getIsMobile(): boolean {
  if (typeof cached === 'boolean') {
    return cached;
  }

  if (typeof navigator === 'undefined' || !navigator.userAgent) {
    cached = false;
    return cached;
  }

  cached = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(
    navigator.userAgent,
  );
  return cached;
}

/** Test-only: drop the memo so a later `getIsMobile()` re-reads the environment. */
export function resetIsMobileCache(): void {
  cached = undefined;
}

export default getIsMobile;
