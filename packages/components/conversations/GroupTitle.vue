<script setup lang="tsx">
import classnames from 'classnames';
import { useGroupTitleContextInject } from './context';
import { computed } from 'vue';
import { Typography } from 'ant-design-vue';

defineOptions({ name: 'AXConversationsGroupTitle' });

const slots = defineSlots<{
  default(props?: any): any
}>();

const groupTitleContext = useGroupTitleContextInject();

const childNode = computed(() => slots.default?.());

defineRender(() => {
  return (
    <div class={classnames(`${groupTitleContext.value.prefixCls}-group-title`)}>
      {childNode.value && <Typography.Text>{childNode.value}</Typography.Text>}
    </div>
  )
});
</script>
