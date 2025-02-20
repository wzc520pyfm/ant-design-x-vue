<script setup lang="tsx">
import type { AntdButtonProps } from '../interface';
import classNames from 'classnames';
import ActionButton from './ActionButton/index.vue';
import StopLoadingIcon from '../StopLoading.vue'
import { useActionButtonContextInject } from './ActionButton/context';

defineOptions({ name: 'AXSenderLoadingButton' });

const { disabled = undefined, ...restProps} = defineProps<AntdButtonProps>();
const context = useActionButtonContextInject()

defineRender(() => {
  return <ActionButton
    icon={null}
    type='primary'
    // color="primary"
    // variant="text"
    disabled={disabled}
    shape="circle"
    {...restProps}
    class={classNames(`${context.value.prefixCls}-loading-button`)}
    action="onCancel"
  >
    <StopLoadingIcon className={`${context.value.prefixCls}-loading-icon`} />
  </ActionButton>;
})
</script>
