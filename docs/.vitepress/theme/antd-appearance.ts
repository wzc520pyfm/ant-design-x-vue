import { ref } from 'vue';

/**
 * Ant Design algorithm flag.
 * Starts dark so the client hydrates the same tokens docs SSR extracted.
 * `bindAntdAppearance` then follows the saved VitePress appearance.
 */
export const antdDark = ref(true);

function readStoredDark() {
  const stored = localStorage.getItem('vitepress-theme-appearance') || 'dark';
  if (stored === 'auto')
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  return stored === 'dark';
}

let bound = false;

/**
 * VitePress `useData().isDark` can stay on the SSR dark value after hydration
 * even when `localStorage` and `<html>` are already light. Mirroring that ref
 * paints dark component tokens on a light page. The `<html class="dark">` flag
 * (set by the appearance boot script and the theme switch) matches the chrome
 * the user actually sees, so Ant Design follows that instead.
 */
export function bindAntdAppearance() {
  if (typeof window === 'undefined' || bound) return;
  bound = true;

  const apply = (dark: boolean) => {
    antdDark.value = dark;
    document.documentElement.dataset.antdTheme = dark ? 'dark' : 'light';
  };

  apply(readStoredDark());

  const observer = new MutationObserver(() => {
    apply(document.documentElement.classList.contains('dark'));
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });

  // The appearance switch updates localStorage even if the class mutation is
  // skipped while VitePress's isDark ref is stuck.
  document.addEventListener('click', (event) => {
    const target = event.target as Element | null;
    if (!target?.closest?.('.VPSwitchAppearance')) return;
    queueMicrotask(() => apply(readStoredDark()));
  });
}
