import { PlusOutlined } from '@ant-design/icons-vue';
import classNames from 'classnames';
import { defineComponent, type PropType, type VNode } from 'vue';
import type { ShortcutKeyInfoType } from '../../_util/hooks/use-shortcut-keys';
import enUS from '../../locale/en_US';
import useLocale from '../../locale/useLocale';
import type { CreationProps } from '../interface';

export const CreationLabel = defineComponent({
  name: 'AXConversationsCreationLabel',
  props: {
    prefixCls: { type: String, required: true },
    shortcutKeysIcon: { type: Array as PropType<string[]>, default: undefined },
  },
  setup(props) {
    const [locale] = useLocale('Conversations', enUS.Conversations);
    return () => {
      const showShortcutKeys = !!props.shortcutKeysIcon?.length;
      return (
        <div
          class={classNames(props.prefixCls, {
            [`${props.prefixCls}-shortcut-keys-show`]: showShortcutKeys,
          })}
        >
          <span>{locale.value.create}</span>
          {showShortcutKeys && (
            <span class={`${props.prefixCls}-shortcut-keys`}>
              {props.shortcutKeysIcon!.map((keyIcon) => (
                <span class={`${props.prefixCls}-shortcut-key`} key={keyIcon}>
                  {keyIcon}
                </span>
              ))}
            </span>
          )}
        </div>
      );
    };
  },
});

interface BaseConfig {
  label: VNode | string;
  icon: VNode;
  align: CreationProps['align'];
}

const useCreation = ({
  icon,
  label,
  align,
  shortcutKeyInfo,
  prefixCls,
}: Pick<
  CreationProps,
  'label' | 'icon' | 'align' | 'shortcutKeyInfo' | 'prefixCls'
>): [VNode, VNode | string, CreationProps['align']] => {
  const { shortcutKeysIcon } = shortcutKeyInfo || {};

  const creationConfig: BaseConfig = {
    label: (
      <CreationLabel
        prefixCls={`${prefixCls}-label`}
        shortcutKeysIcon={shortcutKeysIcon as string[] | undefined}
      />
    ),
    icon: <PlusOutlined class={`${prefixCls}-icon`} />,
    align: 'center',
  };

  if (label) {
    creationConfig.label =
      typeof label === 'function'
        ? label({
            shortcutKeyInfo: shortcutKeyInfo as ShortcutKeyInfoType | undefined,
            components: { CreationLabel },
          })
        : label;
  }
  if (icon) {
    creationConfig.icon = typeof icon === 'function' ? icon() : icon;
  }

  return [
    creationConfig.icon,
    creationConfig.label,
    align || creationConfig.align,
  ];
};

export default useCreation;
