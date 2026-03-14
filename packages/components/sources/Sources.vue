<script setup lang="tsx">
import { RightOutlined } from '@ant-design/icons-vue';
import { Popover } from 'ant-design-vue';
import classnames from 'classnames';
import { computed, ref, type VNode } from 'vue';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import useMergedState from '../_util/hooks/useMergedState';
import { TransitionCollapse } from '../transition-collapse';
import { useXProviderContext } from '../x-provider';
import CarouselCard from './components/CarouselCard.vue';
import type { SourcesProps } from './interface';
import useStyle from './style';

defineOptions({ name: 'AXSources' });

const {
  prefixCls: customizePrefixCls,
  style,
  styles = {},
  class: className,
  classNames = {},
  rootClassName,
  title,
  expandIconPosition = 'start',
  inline = false,
  // Use undefined defaults to prevent Vue Boolean casting
  expanded = undefined,
  defaultExpanded = undefined,
  onExpand,
  activeKey,
  items,
  popoverOverlayWidth = 300,
  onClick,
  ...restProps
} = defineProps<SourcesProps>();

const slots = defineSlots<{
  default?(): VNode[];
}>();

// ============================ PrefixCls ============================
const { getPrefixCls, direction } = useXProviderContext();
const prefixCls = getPrefixCls('sources', customizePrefixCls);

// ===================== Component Config =========================
const contextConfig = useXComponentConfig('sources');

// ============================ Style ============================
const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

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
      [`${prefixCls}-inline`]: inline,
      [`${prefixCls}-rtl`]: direction.value === 'rtl',
    },
  ),
);

// ============================= Refs =============================
const sourcesRef = ref<HTMLDivElement>();

defineExpose({
  nativeElement: sourcesRef,
});

// ============================ State ============================
const expandedRef = computed(() => expanded);
const [isExpand, setIsExpand] = useMergedState<boolean>(defaultExpanded ?? true, {
  value: expandedRef as any,
  onChange: onExpand,
});

// ============================ Nodes ============================
const ContentNode = () => {
  if (items) {
    return (
      <ul class={`${prefixCls}-list`}>
        {items.map((item, index) => (
          <li
            key={item.key ?? index}
            class={`${prefixCls}-list-item`}
            onClick={() => onClick?.(item)}
          >
            <a
              class={`${prefixCls}-link`}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.icon && <span class={`${prefixCls}-link-icon`}>{item.icon}</span>}
              <span class={`${prefixCls}-link-title`}>{item.title}</span>
            </a>
          </li>
        ))}
      </ul>
    );
  }
  return slots.default?.();
};

defineRender(() =>
  wrapCSSVar(
    <div
      ref={sourcesRef}
      {...restProps}
      class={mergedCls.value}
      style={{
        ...(typeof contextConfig.value.style === 'object' ? contextConfig.value.style : {}),
        ...contextConfig.value.styles?.root,
        ...(typeof style === 'object' ? style : {}),
        ...styles.root,
      }}
    >
      {inline ? (
        <Popover
          content={
            <CarouselCard
              className={classNames.content}
              style={styles.content}
              activeKey={activeKey}
              prefixCls={prefixCls}
              items={items}
              onClick={onClick}
            />
          }
          overlayStyle={{ width: typeof popoverOverlayWidth === 'number' ? `${popoverOverlayWidth}px` : popoverOverlayWidth }}
          placement="top"
        >
          <div
            class={classnames(`${prefixCls}-title-wrapper`, classNames.title)}
            style={styles.title}
          >
            <span class={`${prefixCls}-title`}>{title}</span>
          </div>
        </Popover>
      ) : (
        <>
          <div
            class={classnames(
              `${prefixCls}-title-wrapper`,
              `${prefixCls}-icon-position-${expandIconPosition}`,
              classNames.title,
            )}
            onClick={() => setIsExpand(!isExpand.value)}
            style={styles.title}
          >
            <RightOutlined
              class={`${prefixCls}-title-down-icon`}
              rotate={isExpand.value ? 90 : 0}
            />
            <span class={`${prefixCls}-title`}>{title}</span>
          </div>
          <TransitionCollapse prefixCls={prefixCls}>
            {isExpand.value ? (
              <div
                class={classnames(`${prefixCls}-content`, classNames.content)}
                style={styles.content}
              >
                <ContentNode />
              </div>
            ) : null}
          </TransitionCollapse>
        </>
      )}
    </div>,
  ),
);
</script>
