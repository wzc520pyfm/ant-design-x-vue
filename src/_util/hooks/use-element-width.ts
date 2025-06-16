import { ref,onMounted,onUnmounted, type Ref } from "vue";

export function useElementWidth(element: Ref<HTMLElement | undefined>) {
  const width = ref(0);

  onMounted(() => {
   if(!element.value) return

   width.value = element.value.clientWidth
   
   const resizeObserver = new ResizeObserver((entries) => {
    width.value = entries[0].contentRect.width
   })

   resizeObserver.observe(element.value)

    onUnmounted(() => {
      resizeObserver.disconnect()
    })
  });

 
  return width
}