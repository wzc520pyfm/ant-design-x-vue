/**
 * Props comparator that ignores the per-parse `domNode` reference.
 *
 * Exported for API parity with React 2.10. Vue has no public `React.memo`
 * render-bailout equivalent, so consumers can use this in their own cache or
 * adapter layer when a rendered block only depends on primitive props.
 */
export const arePropsEqualIgnoringDomNode = (
  prev: Readonly<Record<string, unknown>>,
  next: Readonly<Record<string, unknown>>,
): boolean => {
  const prevKeys = Object.keys(prev);
  const nextKeys = Object.keys(next);
  if (prevKeys.length !== nextKeys.length) return false;

  for (const key of prevKeys) {
    if (key === 'domNode') continue;
    if (!Object.prototype.hasOwnProperty.call(next, key)) return false;
    if (!Object.is(prev[key], next[key])) return false;
  }

  return true;
};
