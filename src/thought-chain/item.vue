<script setup lang="tsx">
import classnames from 'classnames';
import { computed, useId } from 'vue';
import pickAttrs from '../_util/pick-attrs';
import type { ThoughtChainNodeProps } from './interface';
import { useThoughtChainNodeContextInject } from './context';
import { Avatar, Typography, Tooltip, type TooltipProps } from 'ant-design-vue';
import { LeftOutlined, RightOutlined } from '@ant-design/icons-vue';
import { TransitionCollapse } from '../transition-collapse';

defineOptions({ name: 'AXThoughtChainNode' });

const {
  info = {},
  nextStatus,
  onClick,
  ...restProps
} = defineProps<ThoughtChainNodeProps>();

const domProps = computed(() =>
  pickAttrs(restProps, {
    attr: true,
    aria: true,
    data: true,
  }),
);

// ================= ThoughtChainNodeContext ====================
const thoughtChainNodeContext = useThoughtChainNodeContextInject();
const prefixCls = computed(() => thoughtChainNodeContext.value.prefixCls);
// const collapseMotion = computed(() => thoughtChainNodeContext.value.collapseMotion);
const enableCollapse = computed(
  () => thoughtChainNodeContext.value.enableCollapse,
);
const expandedKeys = computed(() => thoughtChainNodeContext.value.expandedKeys);
const direction = computed(() => thoughtChainNodeContext.value.direction);
const classNames = computed(() => thoughtChainNodeContext.value.classNames);
const styles = computed(() => thoughtChainNodeContext.value.styles);

// ============================ Info ============================
const id = useId();

const key = computed(() => info.key ?? id);
const icon = computed(() => info.icon);
const title = computed(() => info.title);
const extra = computed(() => info.extra);
const content = computed(() => info.content);
const footer = computed(() => info.footer);
const status = computed(() => info.status);
const description = computed(() => info.description);
const tooltip = computed(() => {
  const tooltipConfig = info.tooltip ?? true;
  const placement = direction.value === 'rtl' ? 'topRight' : 'topLeft';
  const titleConfig: TooltipProps = {
    title: title.value,
    placement,
  };
  const descriptionConfig: TooltipProps = {
    title: description.value,
    placement,
  };

  if (typeof tooltipConfig === 'boolean') {
    return { titleConfig, descriptionConfig };
  }

  return {
    titleConfig: {
      ...titleConfig,
      ...(tooltipConfig.titleConfig ? tooltipConfig.titleConfig : {}),
    },
    descriptionConfig: {
      ...descriptionConfig,
      ...(tooltipConfig.descriptionConfig
        ? tooltipConfig.descriptionConfig
        : {}),
    },
  };
});

const hideTooltip = computed(
  () => typeof info.tooltip === 'boolean' && !info.tooltip,
);

// ============================ Style ============================
const itemCls = computed(() => `${prefixCls.value}-item`);

// ============================ Event ============================
const onThoughtChainNodeClick = () => onClick?.(key.value);

// ============================ Content Open ============================
const contentOpen = computed(() => expandedKeys.value?.includes(key.value));
const contentVisible = computed(() =>
  enableCollapse.value ? contentOpen.value : true,
);

defineRender(() => {
  return (
    <div
      {...domProps.value}
      class={classnames(
        itemCls.value,
        {
          [`${itemCls.value}-${status.value}${
            nextStatus ? `-${nextStatus}` : ''
          }`]: status.value,
        },
        restProps.class,
      )}
      style={restProps.style}
    >
      {/* Header */}
      <div
        class={classnames(
          `${itemCls.value}-header`,
          classNames.value.itemHeader,
        )}
        style={styles.value.itemHeader}
        onClick={onThoughtChainNodeClick}
      >
        {/* Avatar */}
        <Avatar icon={icon.value} class={`${itemCls.value}-icon`} />
        {/* Header */}
        <div
          class={classnames(`${itemCls.value}-header-box`, {
            [`${itemCls.value}-collapsible`]:
              enableCollapse.value && content.value,
          })}
        >
          {/* Title */}
          <Typography.Text
            strong
            // @ts-expect-error
            class={`${itemCls.value}-title`}
          >
            {enableCollapse.value &&
              content.value &&
              (direction.value === 'rtl' ? (
                <LeftOutlined
                  class={`${itemCls.value}-collapse-icon`}
                  rotate={contentOpen.value ? -90 : 0}
                />
              ) : (
                <RightOutlined
                  class={`${itemCls.value}-collapse-icon`}
                  rotate={contentOpen.value ? 90 : 0}
                />
              ))}
            {hideTooltip.value ? (
              title.value
            ) : (
              <Tooltip {...tooltip.value.titleConfig}>{title.value}</Tooltip>
            )}
          </Typography.Text>
          {/* Description */}
          {description.value && (
            <Typography.Text
              // @ts-expect-error
              class={`${itemCls.value}-desc`}
              type="secondary"
            >
              {hideTooltip.value ? (
                title.value
              ) : (
                <Tooltip {...tooltip.value.descriptionConfig}>
                  {description.value}
                </Tooltip>
              )}
            </Typography.Text>
          )}
        </div>
        {/* Extra */}
        {extra.value && (
          <div class={`${itemCls.value}-extra`}>{extra.value}</div>
        )}
      </div>
      {/* Content */}

      <TransitionCollapse prefixCls={prefixCls.value}>
        {content.value && (
          <div
            v-show={contentVisible.value}
            class={classnames(`${itemCls.value}-content`)}
          >
            <div
              class={classnames(
                `${itemCls.value}-content-box`,
                classNames.value.itemContent,
              )}
              style={styles.value.itemContent}
            >
              {content.value}
            </div>
          </div>
        )}
      </TransitionCollapse>

      {/* Footer */}
      {footer.value && (
        <div
          class={classnames(
            `${itemCls.value}-footer`,
            classNames.value.itemFooter,
          )}
          style={styles.value.itemFooter}
        >
          {footer.value}
        </div>
      )}
    </div>
  );
});
</script>
