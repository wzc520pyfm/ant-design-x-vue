<script setup lang="tsx">
import type { AntdButtonProps } from '../interface';
import ActionButton from './ActionButton/index.vue';
import { ArrowUpOutlined } from '@ant-design/icons-vue';

defineOptions({ name: 'AXSenderLoadingButton' });

const { type = "primary", shape = "circle", disabled = undefined, ...restProps } = defineProps<AntdButtonProps>();

defineRender(() => {
  return <ActionButton
    type={type}
    shape={shape}
    disabled={disabled}
    {...restProps}
    action="onSend"
  >
    <ArrowUpOutlined />
  </ActionButton>;
})
</script>
