<script setup lang="tsx">
import classnames from 'classnames';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons-vue';
import { THOUGHT_CHAIN_ITEM_STATUS, type StatusProps } from './interface';

defineOptions({ name: 'AXThoughtChainStatus' });

const { prefixCls, icon, status, class: className, style } = defineProps<StatusProps>();

const StatusIcon = {
  [THOUGHT_CHAIN_ITEM_STATUS.LOADING]: () => <LoadingOutlined />,
  [THOUGHT_CHAIN_ITEM_STATUS.ERROR]: () => <CloseCircleOutlined />,
  [THOUGHT_CHAIN_ITEM_STATUS.SUCCESS]: () => <CheckCircleOutlined />,
  [THOUGHT_CHAIN_ITEM_STATUS.ABORT]: () => <MinusCircleOutlined />,
};

const statusCls = `${prefixCls}-status`;

defineRender(() => {
  const IconNode = status ? StatusIcon[status]() : icon;

  return (
    <div
      class={classnames(statusCls, className, {
        [`${statusCls}-${status}`]: status,
      })}
      style={style}
    >
      {IconNode}
    </div>
  );
});
</script>
