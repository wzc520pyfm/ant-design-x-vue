<script setup lang="tsx" generic="T extends BubbleContentType = string">
import { Divider as AntDivider } from 'ant-design-vue';
import { computed, ref, type VNode } from 'vue';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import { useXProviderContext } from '../x-provider';
import Bubble from './Bubble.vue';
import type { BubbleContentType, DividerBubbleProps, Info } from './interface';

defineOptions({ name: 'AXDividerBubble' });

const props = withDefaults(defineProps<DividerBubbleProps<T>>(), {
  content: '' as any,
});

// ============================ Prefix ============================
const { getPrefixCls } = useXProviderContext();
const prefixCls = computed(() => getPrefixCls('bubble', props.prefixCls));

// ===================== Component Config =========================
const contextConfig = useXComponentConfig('bubble');

// ============================ Styles ============================
const rootMergedCls = computed(() => [
  prefixCls.value,
  `${prefixCls.value}-divider`,
  contextConfig.value.className,
  contextConfig.value.classNames.root,
  props.class,
  props.classNames?.root,
  props.rootClassName,
]);

const dividerContentRender = (content: T, _info: Info): VNode => {
  return <AntDivider {...props.dividerProps}>{content as any}</AntDivider>;
};

const bubbleRef = ref<InstanceType<typeof Bubble> | null>(null);

defineRender(() => {
  return (
    <Bubble
      ref={bubbleRef}
      style={props.style}
      styles={props.styles}
      class={rootMergedCls.value}
      classNames={props.classNames}
      prefixCls={prefixCls.value}
      variant="borderless"
      content={props.content}
      contentRender={dividerContentRender}
    />
  );
});

defineExpose({
  nativeElement: computed(() => bubbleRef.value?.nativeElement),
});
</script>
