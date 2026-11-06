import { watch, type Ref } from 'vue';

function isReverse(scrollDom: HTMLElement) {
  return getComputedStyle(scrollDom).flexDirection === 'column-reverse';
}

export type CompatibleScrollOption = ScrollToOptions & {
  intoView?: ScrollIntoViewOptions;
  intoViewDom?: HTMLElement | null;
};

/**
 * Safari-compatible viewport lock for a column-reverse scrollport, plus scrollTo.
 * Ported from `@ant-design/x` Bubble.List `useCompatibleScroll`.
 */
export function useCompatibleScroll(
  scrollDom: Ref<HTMLElement | null | undefined>,
  contentDom: Ref<HTMLElement | null | undefined>,
) {
  const sentinelRef: { current: HTMLElement | null } = { current: null };
  const sentinelHeight = 10;
  const isAtBottom = { current: true };
  const shouldLock = { current: false };
  const lockedScrollBottomPos = { current: 0 };
  const scrolling = { current: undefined as ReturnType<typeof setTimeout> | undefined };
  const callOnScrollNotNative = { current: false };
  const isScrollToBottom = { current: false };

  const setTimer = () => {
    scrolling.current = setTimeout(() => {
      clearTimeout(scrolling.current);
      scrolling.current = undefined;
      isScrollToBottom.current = false;
    }, 50);
  };

  const enforceScrollLock = () => {
    const scrollEl = scrollDom.value;
    if (!scrollEl) return;
    /**
     * Scroll and content growth can happen together. Safari then either locks
     * the viewport (jitter) or lets the content move. Prefer the latter while
     * a scroll is in progress, and lock only after scrolling settles.
     * Content-only growth keeps the viewport stable, matching Chrome.
     */
    const targetScroll = lockedScrollBottomPos.current - scrollEl.scrollHeight;
    scrollEl.scrollTop = targetScroll;
    callOnScrollNotNative.current = true;
  };

  const handleScroll = (e: Event) => {
    const target = e.target as HTMLElement;
    if (!isReverse(target)) return;
    const { scrollTop, scrollHeight } = target;
    lockedScrollBottomPos.current = scrollHeight + scrollTop;
    if (callOnScrollNotNative.current) {
      callOnScrollNotNative.current = false;
      return;
    }
    if (scrolling.current) {
      clearTimeout(scrolling.current);
    }
    setTimer();
  };

  watch(
    [scrollDom, contentDom],
    ([scrollEl, contentEl], _prev, onCleanup) => {
      if (!scrollEl || !contentEl) return;

      if (!sentinelRef.current) {
        const sentinel = document.createElement('div');
        sentinel.style.bottom = '0';
        sentinel.style.flexShrink = '0';
        sentinel.style.pointerEvents = 'none';
        sentinel.style.height = `${sentinelHeight}px`;
        sentinel.style.visibility = 'hidden';
        scrollEl.insertBefore(sentinel, scrollEl.firstChild);
        sentinelRef.current = sentinel;
      }

      const intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          isAtBottom.current = entry.isIntersecting;
          shouldLock.current = !entry.isIntersecting;
        },
        { root: scrollEl, threshold: 0 },
      );
      if (sentinelRef.current) {
        intersectionObserver.observe(sentinelRef.current);
      }

      const resizeObserver = new ResizeObserver(() => {
        const current = scrollDom.value;
        if (!current) return;
        if (scrolling.current) {
          if (isScrollToBottom.current) {
            requestAnimationFrame(() => {
              current.scrollTo({
                top: isReverse(current) ? 0 : current.scrollHeight,
                behavior: 'instant' as ScrollBehavior,
              });
            });
          }
          return;
        }
        if (isReverse(current) && shouldLock.current) {
          enforceScrollLock();
        }
      });
      resizeObserver.observe(contentEl);
      scrollEl.addEventListener('scroll', handleScroll, { capture: true });

      onCleanup(() => {
        intersectionObserver.disconnect();
        resizeObserver.disconnect();
        clearTimeout(scrolling.current);
        scrolling.current = undefined;
        scrollEl.removeEventListener('scroll', handleScroll, { capture: true });
        if (sentinelRef.current?.parentNode) {
          sentinelRef.current.parentNode.removeChild(sentinelRef.current);
          sentinelRef.current = null;
        }
      });
    },
    { flush: 'post' },
  );

  const reset = () => {
    isAtBottom.current = true;
    shouldLock.current = false;
    lockedScrollBottomPos.current = scrollDom.value?.scrollHeight || 0;
  };

  const scrollTo = (option?: CompatibleScrollOption) => {
    const scrollEl = scrollDom.value;
    const contentEl = contentDom.value;
    if (!scrollEl || !contentEl) return;
    const { top, intoView, intoViewDom } = option || {};
    if (isReverse(scrollEl)) {
      if (top !== undefined && top >= -sentinelHeight) {
        isScrollToBottom.current = true;
      } else if (intoViewDom && intoView?.block === 'end') {
        isScrollToBottom.current = contentEl.lastElementChild === intoViewDom;
      } else {
        isScrollToBottom.current = false;
      }
    } else if (
      top !== undefined &&
      top >= scrollEl.scrollHeight - scrollEl.clientHeight - sentinelHeight
    ) {
      isScrollToBottom.current = true;
    } else if (intoViewDom && intoView?.block === 'end') {
      isScrollToBottom.current = contentEl.lastElementChild === intoViewDom;
    } else {
      isScrollToBottom.current = false;
    }

    if (!scrolling.current) {
      setTimer();
    }
    if (intoViewDom) {
      intoViewDom.scrollIntoView(intoView);
    } else {
      scrollEl.scrollTo(option);
    }
  };

  return {
    reset,
    scrollTo,
  };
}
