<script setup lang="tsx" generic="T extends BubbleContentType = string">
import { computed, ref } from 'vue';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import { useXProviderContext } from '../x-provider';
import Bubble from './Bubble.vue';
import type { BubbleContentType, SystemBubbleProps } from './interface';

defineOptions({ name: 'AXSystemBubble' });

const props = withDefaults(defineProps<SystemBubbleProps<T>>(), {
  variant: 'shadow',
});

// ============================ Prefix ============================
const { getPrefixCls } = useXProviderContext();
const prefixCls = computed(() => getPrefixCls('bubble', props.prefixCls));

// ===================== Component Config =========================
const contextConfig = useXComponentConfig('bubble');

// ============================ Styles ============================
const cls = computed(() => `${prefixCls.value}-system`);
const rootMergedCls = computed(() => [
  cls.value,
  prefixCls.value,
  contextConfig.value.className,
  contextConfig.value.classNames.root,
  props.classNames?.root,
  props.class,
  props.rootClassName,
]);

const bubbleRef = ref<{ nativeElement?: HTMLElement } | null>(null);

defineRender(() => {
  return (
    <Bubble
      ref={bubbleRef}
      style={props.style}
      class={rootMergedCls.value}
      styles={props.styles}
      classNames={props.classNames}
      variant={props.variant}
      shape={props.shape}
      content={props.content}
    />
  );
});

defineExpose({
  nativeElement: computed(() => bubbleRef.value?.nativeElement),
});
</script>
