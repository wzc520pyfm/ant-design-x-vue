<script setup lang="tsx">
import { AudioMutedOutlined as MutedOutlined } from '@ant-design/icons-vue';
import classnames from 'classnames';
import { computed } from 'vue';
import type { CSSProperties } from 'vue';
import enUS from '../locale/en_US';
import useLocale from '../locale/useLocale';
import RecordingIcon from '../sender/components/SpeechButton/RecordingIcon.vue';
import { useXProviderContext } from '../x-provider';
import ActionsItem, {
  ACTIONS_ITEM_STATUS,
  type ActionsItemStatus,
} from './ActionsItem.vue';
import useStyle from './style';

defineOptions({ name: 'AXActionsAudio' });

interface Props {
  status?: ActionsItemStatus;
  prefixCls?: string;
  rootClassName?: string;
  className?: string;
  style?: CSSProperties;
}

const props = withDefaults(defineProps<Props>(), {
  status: 'default',
});

const { direction, getPrefixCls } = useXProviderContext();
const prefixCls = getPrefixCls('actions', props.prefixCls);
const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);
const audioCls = `${prefixCls}-audio`;

const mergedCls = computed(() =>
  classnames(audioCls, hashId.value, cssVarCls, props.rootClassName, props.className, {
    [`${audioCls}-rtl`]: direction.value === 'rtl',
    [`${audioCls}-${props.status}`]: !!props.status,
  }),
);

const [contextLocale] = useLocale('Actions', enUS.Actions);

const label = computed(() => {
  switch (props.status) {
    case ACTIONS_ITEM_STATUS.LOADING:
      return contextLocale.value.audioLoading;
    case ACTIONS_ITEM_STATUS.ERROR:
      return contextLocale.value.audioError;
    case ACTIONS_ITEM_STATUS.RUNNING:
      return contextLocale.value.audioRunning;
    default:
      return contextLocale.value.audio;
  }
});

defineRender(() => {
  return wrapCSSVar(
    <ActionsItem
      label={label.value}
      style={props.style}
      className={mergedCls.value}
      status={props.status}
      defaultIcon={<MutedOutlined />}
      runningIcon={<RecordingIcon class={`${audioCls}-recording-icon`} />}
    />,
  );
});
</script>
