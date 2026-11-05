<script setup lang="tsx">

interface LoadingProps {
  prefixCls?: string;
}

defineOptions({ name: 'AXBubbleLoading' });

const { prefixCls } = defineProps<LoadingProps>();

defineRender(() => {
  return (
    <span class={`${prefixCls}-dot`}>
    <i class={`${prefixCls}-dot-item`} key={`item-${1}`} />
    <i class={`${prefixCls}-dot-item`} key={`item-${2}`} />
    <i class={`${prefixCls}-dot-item`} key={`item-${3}`} />
  </span>
  )
});
</script>
