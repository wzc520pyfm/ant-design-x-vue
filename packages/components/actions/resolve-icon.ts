import { h, type VNodeChild } from 'vue';

/**
 * Actions `icon` is a VNode, matching React `ReactNode`.
 * A function placed in a native element's children is stringified
 * (`()=>Qe(...)`). Call a zero-arg factory, and render an icon component
 * with `h()` so the toolbar shows the SVG.
 */
export function resolveActionIcon(icon: unknown): VNodeChild {
  if (typeof icon !== 'function') return icon as VNodeChild;
  if (icon.length === 0) return (icon as () => VNodeChild)();
  return h(icon as any);
}
