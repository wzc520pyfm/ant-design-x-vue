<script setup lang="tsx">
import { AudioMutedOutlined, AudioOutlined } from '@ant-design/icons-vue';
import type { AntdButtonProps } from '../../interface';
import ActionButton from '../ActionButton/index.vue';
import { useActionButtonContextInject } from '../ActionButton/context';
import RecordingIcon from './RecordingIcon.vue';
import { computed } from 'vue';

defineOptions({ name: 'AXSenderSpeechButton' });

const {
  disabled = undefined,
  ...restProps
} = defineProps<AntdButtonProps>();

const context = useActionButtonContextInject();

const speechRecording = computed(() => context.value.speechRecording);
const prefixCls = computed(() => context.value.prefixCls);

const icon = computed(() => {
  if (speechRecording.value) {
    return <RecordingIcon className={`${prefixCls.value}-recording-icon`} />;
  } else if (context.value.onSpeechDisabled) {
    return <AudioMutedOutlined />;
  } else {
    return <AudioOutlined />;
  }
});

defineRender(() => {
  return (
    <ActionButton
      color="primary"
      variant="text"
      disabled={disabled}
      {...restProps}
      action="onSpeech"
    >
      {icon.value}
    </ActionButton>
  );
});
</script>
