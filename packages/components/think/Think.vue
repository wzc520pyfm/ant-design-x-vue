<script setup lang="tsx">
import { LoadingOutlined, RightOutlined } from '@ant-design/icons-vue';
import classnames from 'classnames';
import { computed, ref, type VNode } from 'vue';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import useMergedState from '../_util/hooks/useMergedState';
import pickAttrs from '../_util/pick-attrs';
import { TransitionCollapse } from '../transition-collapse';
import { useXProviderContext } from '../x-provider';
import ThinkIcon from './icons/think';
import type { ThinkProps } from './interface';
import useStyle from './style';

defineOptions({ name: 'AXThink' });

const {
  prefixCls: customizePrefixCls,
  style,
  styles = {},
  class: className,
  rootClassName,
  classNames = {},
  title,
  icon,
  loading,
  defaultExpanded = true,
  expanded = undefined,
  onExpand,
  blink,
  ...restProps
} = defineProps<ThinkProps>();

const slots = defineSlots<{
  default?(): VNode[];
  title?(): VNode[];
  icon?(): VNode[];
}>();

// ============================ Prefix ============================
const { direction, getPrefixCls } = useXProviderContext();
const prefixCls = getPrefixCls('think', customizePrefixCls);

// ======================= Component Config =======================
const contextConfig = useXComponentConfig('think');

// ============================ Styles ============================
const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

// ============================= Refs =============================
const thinkRef = ref<HTMLDivElement>();

defineExpose({
  nativeElement: thinkRef,
});

const domProps = computed(() =>
  pickAttrs(restProps, { attr: true, aria: true, data: true }),
);

const mergedCls = computed(() =>
  classnames(
    prefixCls,
    contextConfig.value.className,
    className,
    rootClassName,
    classNames.root,
    hashId.value,
    cssVarCls,
    {
      [`${prefixCls}-rtl`]: direction.value === 'rtl',
    },
  ),
);

// ============================ Expand ============================
const expandedRef = computed(() => expanded);
const [isExpand, setIsExpand] = useMergedState<boolean>(defaultExpanded, {
  value: expandedRef as any,
  onChange: onExpand,
});

// ========================= Status Icon ==========================
const StatusIconNode = () => {
  if (loading) {
    return loading === true ? <LoadingOutlined /> : loading;
  }
  if (slots.icon) {
    return slots.icon();
  }
  return icon || <ThinkIcon />;
};

// ========================= Title Node ==========================
const TitleNode = () => {
  if (slots.title) {
    return slots.title();
  }
  return title;
};

// ============================ Render ============================
defineRender(() =>
  wrapCSSVar(
    <div
      ref={thinkRef}
      {...domProps.value}
      class={mergedCls.value}
      style={{
        ...(typeof contextConfig.value.style === 'object' ? contextConfig.value.style : {}),
        ...contextConfig.value.styles?.root,
        ...(typeof style === 'object' ? style : {}),
        ...styles.root,
      }}
    >
      <div
        class={classnames(`${prefixCls}-status-wrapper`, classNames.status)}
        onClick={() => setIsExpand(!isExpand.value)}
        style={styles.status}
      >
        <div class={`${prefixCls}-status-icon`}>
          <StatusIconNode />
        </div>
        <div
          class={classnames(`${prefixCls}-status-text`, {
            [`${prefixCls}-motion-blink`]: blink,
          })}
        >
          <TitleNode />
        </div>
        <RightOutlined
          class={`${prefixCls}-status-down-icon`}
          rotate={isExpand.value ? 90 : 0}
        />
      </div>
      <TransitionCollapse prefixCls={prefixCls}>
        {isExpand.value ? (
          <div
            class={classnames(`${prefixCls}-content`, classNames.content)}
            style={styles.content}
          >
            {slots.default?.()}
          </div>
        ) : null}
      </TransitionCollapse>
    </div>,
  ),
);
</script>
