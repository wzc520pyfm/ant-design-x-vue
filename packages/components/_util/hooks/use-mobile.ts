import { onMounted, ref, type Ref } from 'vue';
import { getIsMobile } from '../is-mobile';

/**
 * Detect whether the current device is mobile.
 * SSR-safe: returns `false` on the server and updates on the client.
 */
const useMobile = (): Ref<boolean> => {
  const mobile = ref(false);

  onMounted(() => {
    mobile.value = getIsMobile();
  });

  return mobile;
};

export default useMobile;
