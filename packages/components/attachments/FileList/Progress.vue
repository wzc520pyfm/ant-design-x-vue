<script setup lang="tsx">
import type { ProgressProps } from 'ant-design-vue';
import { Progress as AntdProgress, theme } from 'ant-design-vue';

defineOptions({ name: 'AXAttachmentsProgress' })

const { percent } = defineProps<ProgressProps>();
const { token } = theme.useToken();

defineRender(() => {
  return (
    <AntdProgress
      type="circle"
      percent={percent}
      size={token.value.fontSizeHeading2 * 2}
      strokeColor="#FFF"
      trailColor="rgba(255, 255, 255, 0.3)"
      format={(ptg) => <span style={{ color: '#FFF' }}>{(ptg || 0).toFixed(0)}%</span>}
    />
  )
});
</script>
