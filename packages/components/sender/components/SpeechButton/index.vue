<script setup lang="tsx">
import { theme } from 'ant-design-vue';
import { AudioMutedOutlined, AudioOutlined } from '@ant-design/icons-vue';
import type { AntdButtonProps } from '../../interface';
import ActionButton from '../ActionButton/index.vue';
import { useActionButtonContextInject } from '../ActionButton/context';
import RecordingIcon from './RecordingIcon.vue';
import { computed } from 'vue';

defineOptions({ name: 'AXSenderSpeechButton' });

const { type = 'text',
  disabled = undefined,
  audioIcon = (<AudioOutlined />),
  audioDisabledIcon = (<AudioMutedOutlined />),
  audioRecordingIcon = undefined,
  ...restProps
} = defineProps<AntdButtonProps>();

const context = useActionButtonContextInject();

const { token } = theme.useToken();

const speechRecording = computed(() => context.value.speechRecording);

const prefixCls = computed(() => context.value.prefixCls);

const icon = computed(() => {

  let myIcon;
  if (speechRecording.value) {
    myIcon = audioRecordingIcon ? (audioRecordingIcon) : (<RecordingIcon className={`${prefixCls.value}-recording-icon`} />)
  } else if (context.value.onSpeechDisabled) {
    myIcon = audioDisabledIcon
  } else {
    myIcon = audioIcon
  }
  return myIcon
})

defineRender(() => {
  return <ActionButton
    type={type}
    // color="primary"
    // variant="text"
    disabled={disabled}
    {...restProps}
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: token.value.colorPrimary,
    }}
    action="onSpeech"
  >
    {icon.value}
  </ActionButton>
})
</script>
