<script setup lang="tsx">
import type { AntdButtonProps } from '../interface';
import { ClearOutlined } from '@ant-design/icons-vue';
import ActionButton from './ActionButton/index.vue';

defineOptions({ name: 'AXSenderClearButton' });

const { disabled = undefined, ...restProps} = defineProps<AntdButtonProps>();

defineRender(() => {
  return <ActionButton disabled={disabled} {...restProps} action="onClear">
    <ClearOutlined />
  </ActionButton>;
})
</script>
