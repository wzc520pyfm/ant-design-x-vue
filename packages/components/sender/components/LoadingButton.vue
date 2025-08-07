<script setup lang="tsx">
import type { AntdButtonProps } from '../interface';
import classNames from 'classnames';
import ActionButton from './ActionButton/index.vue';
import StopLoadingIcon from '../StopLoading.vue'
import { useActionButtonContextInject } from './ActionButton/context';
import { theme } from 'ant-design-vue';

defineOptions({ name: 'AXSenderLoadingButton' });

const { type = "primary", shape = "circle", icon = undefined, disabled = undefined, ...restProps } = defineProps<AntdButtonProps>();
const context = useActionButtonContextInject()
const { token } = theme.useToken();

defineRender(() => {
  return <ActionButton
    type={type}
    // color="primary"
    // variant="text"
    disabled={disabled}
    shape={shape}
    icon={icon}
    {...restProps}
    style={{ backgroundColor: 'transparent', color: token.value.colorPrimary }}
    class={classNames(`${context.value.prefixCls}-loading-button`)}
    action="onCancel"
  >
    <StopLoadingIcon className={`${context.value.prefixCls}-loading-icon`} />
  </ActionButton>;
})
</script>
