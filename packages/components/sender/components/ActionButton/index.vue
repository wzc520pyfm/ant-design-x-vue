<script setup lang="tsx">
import { Button } from 'ant-design-vue';
import { useActionButtonContextInject } from './context'
import classNames from 'classnames';
import type { ActionButtonProps } from '../../interface';
import { computed } from 'vue';

defineOptions({ name: 'AXSenderActionButton' });

const {
  action,
  type = "text",
  disabled: propDisable = undefined,
  onClick,
  ...restProps
} = defineProps<ActionButtonProps>();

const slots = defineSlots<{
  default(): any
}>();

const context = useActionButtonContextInject()

const mergedDisabled = computed(() => {
  const rootDisabled = context.value.disabled;
  const actionDisable = context.value?.[`${action}Disabled`];
  return propDisable ?? rootDisabled ?? actionDisable;
});

const prefixCls = computed(() => {
  return context.value.prefixCls
});

defineRender(() => {
  return (
    <Button
      type={type}
      {...restProps}
      onClick={(e) => {
        if (mergedDisabled.value) {
          return;
        }
        context.value?.[action]?.();
        if (onClick && !Array.isArray(onClick)) {
          onClick(e);
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
