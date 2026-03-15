<script setup lang="tsx">
import classnames from 'classnames';
import { computed, useId } from 'vue';
import pickAttrs from '../_util/pick-attrs';
import { useXProviderContext } from '../x-provider';
import { THOUGHT_CHAIN_ITEM_STATUS, type ThoughtChainItemProps } from './interface';
import Status from './Status.vue';
import useStyle from './style';

defineOptions({ name: 'AXThoughtChainItem' });

const {
  blink,
  variant = 'solid',
  prefixCls: customizePrefixCls,
  rootClassName,
  class: className,
  classNames,
  style,
  styles,
  title,
  icon,
  status,
  onClick,
  description,
  ...restProps
} = defineProps<ThoughtChainItemProps>();

const domProps = computed(() => pickAttrs(restProps, {
  attr: true,
  aria: true,
  data: true,
}));

const id = useId();

const { getPrefixCls, direction } = useXProviderContext();

const prefixCls = computed(() => getPrefixCls('thought-chain', customizePrefixCls));
const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);
const itemCls = computed(() => `${prefixCls.value}-item`);

defineRender(() => {
  return wrapCSSVar(
    <div
      key={id}
      onClick={onClick}
      style={style}
      class={classnames(
        prefixCls.value,
        hashId.value,
        className,
        cssVarCls,
        rootClassName,
        classNames?.root,
        itemCls.value,
        {
          [`${itemCls.value}-${variant}`]: variant,
          [`${itemCls.value}-click`]: onClick,
          [`${itemCls.value}-error`]: status === THOUGHT_CHAIN_ITEM_STATUS.ERROR,
          [`${itemCls.value}-rtl`]: direction.value === 'rtl',
        },
      )}
      {...domProps.value}
    >
      {(status || icon) && (
        <Status
          style={styles?.icon}
          class={classNames?.icon}
          prefixCls={prefixCls.value}
          icon={icon}
          status={status}
        />
      )}
      <div
        class={classnames(`${itemCls.value}-content`, {
          [`${prefixCls.value}-motion-blink`]: blink,
        })}
      >
        {title && (
          <div
            style={styles?.title}
            class={classnames(`${itemCls.value}-title`, classNames?.title, {
              [`${itemCls.value}-title-with-description`]: description,
            })}
          >
            {title}
          </div>
        )}
        {description && (
          <div
            style={styles?.description}
            class={classnames(`${itemCls.value}-description`, classNames?.description)}
          >
            {description}
          </div>
        )}
      </div>
    </div>,
  );
});
</script>
