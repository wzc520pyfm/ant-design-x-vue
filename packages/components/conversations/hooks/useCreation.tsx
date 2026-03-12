import { PlusOutlined } from '@ant-design/icons-vue';
import classNames from 'classnames';
import type { VNode } from 'vue';
import type { CreationProps } from '../interface';

export interface CreationLabelProps {
  prefixCls: string;
}

const CreationLabel = ({ prefixCls }: CreationLabelProps) => {
  return (
    <div class={classNames(prefixCls)}>
      <span>New Conversation</span>
    </div>
  );
};

interface BaseConfig {
  label: VNode | string;
  icon: VNode;
  align: CreationProps['align'];
}

const useCreation = ({
  icon,
  label,
  align,
  prefixCls,
}: Pick<CreationProps, 'label' | 'icon' | 'align' | 'prefixCls'>): [
  VNode,
  VNode | string,
  CreationProps['align'],
] => {
  const creationConfig: BaseConfig = {
    label: (
      <CreationLabel prefixCls={`${prefixCls}-label`} />
    ),
    icon: <PlusOutlined class={`${prefixCls}-icon`} />,
    align: 'center',
  };

  if (label) {
    creationConfig.label =
      typeof label === 'function'
        ? label({ components: { CreationLabel } })
        : label;
  }
  if (icon) {
    creationConfig.icon = typeof icon === 'function' ? icon() : icon;
  }

  return [creationConfig.icon, creationConfig.label, align || creationConfig.align];
};

export default useCreation;
