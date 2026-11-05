import { cloneVNode, h, isVNode, toRaw, type VNode, type VNodeChild } from 'vue';

/**
 * Actions `icon` is a VNode, matching React `ReactNode`.
 * A function placed in a native element's children is stringified
 * (`()=>Qe(...)`). Call a zero-arg factory, and render an icon component
 * with `h()` so the toolbar shows the SVG.
 *
 * React elements can be reused. A Vue vnode cannot: it stores `el` and
 * `component` after the first mount, so one shared `actionItems` array
 * (the Bubble footer demo) leaves every bubble after the first without
 * an icon. Clone it and drop the mount state before inserting it.
 */
export function resolveActionIcon(icon: unknown): VNodeChild {
  if (isVNode(icon)) {
    const raw = toRaw(icon) as VNode;
    // A fresh vnode is already in the parent's render block. Cloning it leaves
    // that original unmounted, and unmount then crashes on a null instance.
    // Only a vnode that has been mounted (shared `actionItems`) needs a copy.
    if (raw.el == null && raw.component == null) return raw;
    const cloned = cloneVNode(raw);
    cloned.el = null;
    cloned.component = null;
    return cloned;
  }
  if (typeof icon !== 'function') return icon as VNodeChild;
  if (icon.length === 0) return (icon as () => VNodeChild)();
  return h(icon as any);
}
