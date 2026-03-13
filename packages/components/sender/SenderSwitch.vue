<script setup lang="tsx">
import { Button } from 'ant-design-vue';
import classnames from 'classnames';
import pickAttrs from '../_util/pick-attrs';
import useMergedState from '../_util/hooks/useMergedState';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import { useXProviderContext } from '../x-provider';
import { useSenderContextInject } from './context';
import useStyle from './style';
import type { SenderSwitchProps } from './interface';
import { computed, ref } from 'vue';

defineOptions({ name: 'AXSenderSwitch' });

const {
  className,
  classNames: classes = {},
  styles = {},
  icon,
  style,
  onChange,
  rootClassName,
  loading,
  defaultValue,
  value: customValue,
  checkedChildren,
  unCheckedChildren,
  disabled,
  prefixCls: customizePrefixCls,
  ...restProps
} = defineProps<SenderSwitchProps>();

const slots = defineSlots<{
  default?(): any;
  icon?(): any;
  checkedChildren?(): any;
  unCheckedChildren?(): any;
}>();

const senderContext = useSenderContextInject();

const domProps = computed(() => pickAttrs(restProps, {
  attr: true,
  aria: true,
  data: true,
}));

// ============================ Prefix ============================
const { direction, getPrefixCls } = useXProviderContext();
const prefixCls = computed(() =>
  getPrefixCls('sender', customizePrefixCls || senderContext.value.prefixCls),
);
const switchCls = computed(() => `${prefixCls.value}-switch`);
const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls.value);

// ============================= Refs =============================
const containerRef = ref<HTMLDivElement>();

// ============================ Checked ============================
const customValueRef = computed(() => customValue);
const [mergedChecked, setMergedChecked] = useMergedState<boolean | undefined>(
  defaultValue,
  {
    value: customValueRef,
    onChange: (key) => {
      onChange?.(key || false);
    },
  },
);

// ============================ Style ============================
const contextConfig = useXComponentConfig('sender');

const mergedCls = computed(() => classnames(
  switchCls.value,
  className,
  rootClassName,
  contextConfig.value.classNames?.switch,
  senderContext.value.classNames?.switch,
  classes.root,
  hashId.value,
  cssVarCls,
  {
    [`${switchCls.value}-checked`]: mergedChecked.value,
    [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
  },
));

defineExpose({
  nativeElement: containerRef,
});

defineRender(() => {
  const iconNode = slots.icon?.() ?? icon;
  const checkedNode = slots.checkedChildren?.() ?? checkedChildren;
  const uncheckedNode = slots.unCheckedChildren?.() ?? unCheckedChildren;

  return wrapCSSVar(
    <div
      ref={containerRef}
      class={mergedCls.value}
      style={{
        ...style,
        ...contextConfig.value.styles?.switch,
        ...senderContext.value.styles?.switch,
        ...styles.root,
      }}
      {...domProps.value}
    >
      <Button
        disabled={disabled}
        loading={loading}
        styles={{
          icon: styles.icon,
          root: styles.content,
          content: styles.title,
        }}
        classNames={{
          root: classnames(`${switchCls.value}-content`, classes.content),
          icon: classes.icon,
          content: classes.title,
        }}
        variant="outlined"
        color={mergedChecked.value ? 'primary' : 'default'}
        icon={iconNode}
        onClick={() => {
          setMergedChecked(!mergedChecked.value);
        }}
      >
        {mergedChecked.value ? checkedNode : uncheckedNode}
        {slots.default?.()}
      </Button>
    </div>,
  );
});
</script>
