<script setup lang="tsx" generic="T = any">
import { AudioMutedOutlined, AudioOutlined } from '@ant-design/icons-vue';
import type { AntdButtonProps } from '../../interface';
import ActionButton from '../ActionButton/index.vue';
import { useActionButtonContextInject } from '../ActionButton/context';

import RecordingIcon from './RecordingIcon.vue';
import { computed } from 'vue';

defineOptions({ name: 'AXSenderSpeechButton' });

const { disabled = undefined, ...restProps} = defineProps<AntdButtonProps>();

const context = useActionButtonContextInject();

const speechRecording = computed(() => context.value.speechRecording);
const prefixCls = computed(() => context.value.prefixCls);

const icon = computed(() => {

  let myIcon;
  if (speechRecording.value) {
    myIcon = <RecordingIcon className={`${prefixCls.value}-recording-icon`} />;
  } else if (context.value.onSpeechDisabled) {
    myIcon = <AudioMutedOutlined />;
  } else {
    myIcon = <AudioOutlined />;
  }
  return myIcon
})

defineRender(() => {
  return <ActionButton
    icon={null}
    type='primary'
    // color="primary"
    // variant="text"
    disabled={disabled}
    {...restProps}
    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    action="onSpeech"
  >
    {icon.value}
  </ActionButton>
})
</script>
