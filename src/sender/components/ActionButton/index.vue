<script setup lang="tsx">
import { Button } from 'ant-design-vue';
import { useActionButtonContextInject } from './context'
import classNames from 'classnames';
import type { ActionButtonProps } from '../../interface';
import { computed } from 'vue';

defineOptions({ name: 'AXSenderActionButton' });

const {
  action,
  disabled: propDisable = undefined,
  onClick: outClick,
  ...restProps
} = defineProps<ActionButtonProps>();

const slots = defineSlots<{
  default(): any
}>();

const context = useActionButtonContextInject()

const mergedDisabled = computed(() => {
  const rootDisabled = context.value.disabled;
  const actionDisable = context.value?.[`${action}Disabled`];
  return rootDisabled ?? propDisable ?? actionDisable;
});

const prefixCls = computed(() => {
  return context.value.prefixCls
})

const onClick = computed(() => {
  return context.value?.[action]
});

defineRender(() => {
  return (
    <Button
      type="text"
      {...restProps}
      onClick={(e) => {
        if (!mergedDisabled.value) {
          if (onClick.value) {
            onClick.value();
          }
          if (outClick && !Array.isArray(outClick)) {
            outClick(e);
          }
        }
      }}
      class={classNames(prefixCls.value, {
        [`${prefixCls.value}-disabled`]: mergedDisabled.value,
      })}
    >
      {{ icon: () => slots.default() }}
    </Button>
  );
})
</script>
