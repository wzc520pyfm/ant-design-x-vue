import { ref,onMounted,onUnmounted, type Ref } from "vue";

export function useElementWidth(element: Ref<HTMLElement | undefined>) {
  const width = ref(0);

  let resizeObserver: ResizeObserver | null = null;

  onMounted(() => {
   if(!element.value) return

   width.value = element.value.clientWidth
   resizeObserver?.disconnect();
   resizeObserver = typeof window !== 'undefined' && 'ResizeObserver' in window ? 
   new ResizeObserver((entries) => {
    width.value = entries[0].contentRect.width
   }) : undefined as unknown as ResizeObserver

   resizeObserver.observe(element.value)

  });

  onUnmounted(() => {
    resizeObserver?.disconnect()
  })

 
  return width
}