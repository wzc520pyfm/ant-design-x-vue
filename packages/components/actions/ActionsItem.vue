<script lang="tsx">
export const ACTIONS_ITEM_STATUS = {
  LOADING: 'loading',
  ERROR: 'error',
  RUNNING: 'running',
  DEFAULT: 'default',
} as const;

export type ActionsItemStatus = (typeof ACTIONS_ITEM_STATUS)[keyof typeof ACTIONS_ITEM_STATUS];
</script>

<script setup lang="tsx">
import { CloseCircleOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import { Tooltip } from 'ant-design-vue';
import classnames from 'classnames';
import { computed } from 'vue';
import type { CSSProperties, VNodeChild } from 'vue';
import pickAttrs from '../_util/pick-attrs';
import { useXProviderContext } from '../x-provider';
import useStyle from './style';

defineOptions({ name: 'AXActionsItem' });

interface Props {
  status?: ActionsItemStatus;
  defaultIcon?: VNodeChild;
  label?: string;
  runningIcon?: VNodeChild;
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

const itemCls = `${prefixCls}-button-item`;

const mergedCls = computed(() =>
  classnames(
    itemCls,
    hashId.value,
    cssVarCls,
    props.rootClassName,
    props.className,
    `${prefixCls}-item`,
    {
      [`${itemCls}-rtl`]: direction.value === 'rtl',
    },
  ),
);

const domProps = computed(() =>
  pickAttrs(props as any, {
    aria: true,
    data: true,
  }),
);

const iconNode = computed<VNodeChild>(() => {
  const { status, defaultIcon, runningIcon } = props;
  if (status === ACTIONS_ITEM_STATUS.LOADING) return <LoadingOutlined />;
  if (status === ACTIONS_ITEM_STATUS.ERROR) return <CloseCircleOutlined />;
  if (status === ACTIONS_ITEM_STATUS.RUNNING) return runningIcon ?? defaultIcon;
  return defaultIcon;
});

defineRender(() => {
  const content = (
    <div {...domProps.value} class={mergedCls.value} style={props.style}>
      {iconNode.value}
    </div>
  );
  if (props.label) {
    return wrapCSSVar(<Tooltip title={props.label}>{content}</Tooltip>);
  }
  return wrapCSSVar(content);
});
</script>
