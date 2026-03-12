<script setup lang="tsx">
import classNames from 'classnames';
import type { CreationProps } from './interface';
import useCreation from './hooks/useCreation';

defineOptions({ name: 'AXConversationsCreation' });

const props = defineProps<CreationProps>();

defineRender(() => {
  const [iconNode, labelNode, mergeAlign] = useCreation({
    prefixCls: props.prefixCls,
    label: props.label,
    icon: props.icon,
    align: props.align,
  });

  return (
    <button
      type="button"
      onClick={(e: MouseEvent) => {
        if (props.disabled) {
          return;
        }
        props.onClick?.(e);
      }}
      style={props.style}
      class={classNames(props.prefixCls, props.className, `${props.prefixCls}-${mergeAlign}`, {
        [`${props.prefixCls}-disabled`]: props.disabled,
      })}
    >
      {iconNode}
      {labelNode}
    </button>
  );
});
</script>
