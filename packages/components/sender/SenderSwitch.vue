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
import { computed, ref, toRef } from 'vue';

defineOptions({ name: 'AXSenderSwitch' });

// `value` must default to undefined: Vue Boolean props otherwise cast absent → false
// and break uncontrolled / defaultValue mode.
const props = withDefaults(defineProps<SenderSwitchProps>(), {
  value: undefined,
  defaultValue: undefined,
  classNames: () => ({}),
  styles: () => ({}),
});

const slots = defineSlots<{
  default?(): any;
  icon?(): any;
  checkedChildren?(): any;
  unCheckedChildren?(): any;
}>();

const senderContext = useSenderContextInject();

const domProps = computed(() => {
  const {
    className: _c,
    classNames: _cs,
    styles: _st,
    icon: _i,
    style: _s,
    onChange: _oc,
    rootClassName: _r,
    loading: _l,
    defaultValue: _dv,
    value: _v,
    checkedChildren: _cc,
    unCheckedChildren: _uc,
    disabled: _d,
    prefixCls: _p,
    ...rest
  } = props;
  return pickAttrs(rest, {
    attr: true,
    aria: true,
    data: true,
  });
});

// ============================ Prefix ============================
const { direction, getPrefixCls } = useXProviderContext();
const prefixCls = computed(() =>
  getPrefixCls('sender', props.prefixCls || senderContext.value.prefixCls),
);
const switchCls = computed(() => `${prefixCls.value}-switch`);
const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls.value);

// ============================= Refs =============================
const containerRef = ref<HTMLDivElement>();

// ============================ Checked ============================
const customValueRef = toRef(props, 'value');
const [mergedChecked, setMergedChecked] = useMergedState<boolean | undefined>(
  props.defaultValue,
  {
    value: customValueRef,
    onChange: (key) => {
      props.onChange?.(key || false);
    },
  },
);

// ============================ Style ============================
const contextConfig = useXComponentConfig('sender');

const mergedCls = computed(() => classnames(
  switchCls.value,
  props.className,
  props.rootClassName,
  contextConfig.value.classNames?.switch,
  senderContext.value.classNames?.switch,
  props.classNames?.root,
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
  const iconNode = slots.icon?.() ?? props.icon;
  const checkedNode = slots.checkedChildren?.() ?? props.checkedChildren;
  const uncheckedNode = slots.unCheckedChildren?.() ?? props.unCheckedChildren;
  const classes = props.classNames || {};
  const styles = props.styles || {};

  // ant-design-vue@4 Button ignores variant/color/classNames (antd 5 APIs).
  // Put `${switchCls}-content` on the real `class` so switch.ts checked styles hit.
  return wrapCSSVar(
    <div
      ref={containerRef}
      class={mergedCls.value}
      style={{
        ...props.style,
        ...contextConfig.value.styles?.switch,
        ...senderContext.value.styles?.switch,
        ...styles.root,
      }}
      {...domProps.value}
    >
      <Button
        disabled={props.disabled}
        loading={props.loading}
        class={classnames(`${switchCls.value}-content`, classes.content)}
        style={styles.content}
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
