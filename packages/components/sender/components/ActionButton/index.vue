<script setup lang="tsx">
import { Button } from 'ant-design-vue';
import { useActionButtonContextInject } from './context';
import classNames from 'classnames';
import type { ActionButtonProps } from '../../interface';
import { computed } from 'vue';

defineOptions({ name: 'AXSenderActionButton' });

const {
  action,
  type = "text",
  disabled: propDisable = undefined,
  onClick,
  color,
  variant,
  icon,
  ...restProps
} = defineProps<ActionButtonProps>();

const slots = defineSlots<{
  default?(): any;
  icon?(): any;
}>();

const context = useActionButtonContextInject();

const mergedDisabled = computed(() => {
  const rootDisabled = context.value.disabled;
  const actionDisable = context.value?.[`${action}Disabled`];
  return propDisable ?? rootDisabled ?? actionDisable;
});

const prefixCls = computed(() => context.value.prefixCls);

defineRender(() => {
  // Prefer explicit icon prop (React SpeechButton parity); fall back to
  // default/icon slots used by SendButton / ClearButton / LoadingButton.
  const slotIcon = slots.icon?.() ?? slots.default?.();
  const mergedIcon = icon ?? slotIcon;

  return (
    <Button
      type={type}
      {...restProps}
      {...({ color, variant } as object)}
      icon={mergedIcon}
      onClick={(e) => {
        if (mergedDisabled.value) {
          return;
        }
        context.value?.[action]?.();
        if (onClick && !Array.isArray(onClick)) {
          onClick(e);
        }
      }}
      disabled={mergedDisabled.value}
      class={classNames(prefixCls.value, {
        [`${prefixCls.value}-disabled`]: mergedDisabled.value,
      })}
    />
  );
});
</script>
